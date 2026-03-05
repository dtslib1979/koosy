#!/usr/bin/env node
/**
 * collector.js — 4채널 매출/트래픽 데이터 수집기
 *
 * 각 채널에서 데이터를 가져와 analytics/*.jsonl에 append.
 * 헌법 제2조: append-only 원장. 삭제 금지.
 *
 * Usage:
 *   node collector.js [--channel coupang|naver|youtube|showroom|all] [--date YYYY-MM-DD]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ANALYTICS = path.join(ROOT, 'analytics');

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const channel = getArg('--channel', 'all');
const date = getArg('--date', new Date().toISOString().split('T')[0]);
const inputFile = getArg('--input', null);

console.log(`\n${'='.repeat(50)}`);
console.log(`  COLLECTOR: ${channel} / ${date}`);
console.log(`${'='.repeat(50)}\n`);

// ── Append to JSONL ───────────────────────────────
function appendLog(file, entry) {
  const line = JSON.stringify(entry) + '\n';
  fs.appendFileSync(path.join(ANALYTICS, file), line);
}

// ── Load catalog ──────────────────────────────────
const catalogPath = path.join(ROOT, 'catalog/index.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const liveProducts = catalog.products.filter(p => p.state === 'ALL_LIVE');

// ── CSV/JSON Input Mode ───────────────────────────
if (inputFile) {
  console.log(`  input: ${inputFile}`);
  const raw = fs.readFileSync(inputFile, 'utf8').trim();

  if (inputFile.endsWith('.json')) {
    const entries = JSON.parse(raw);
    (Array.isArray(entries) ? entries : [entries]).forEach(e => {
      e.timestamp = e.timestamp || new Date().toISOString();
      e.source = 'manual-import';
      if (e.revenue !== undefined) {
        appendLog('sales-log.jsonl', e);
        console.log(`  + sale: ${e.product_id} ${e.channel} ₩${e.revenue}`);
      } else {
        appendLog('traffic-log.jsonl', e);
        console.log(`  + traffic: ${e.product_id} ${e.channel} ${e.count}`);
      }
    });
  } else if (inputFile.endsWith('.csv')) {
    const lines = raw.split('\n').slice(1);
    lines.forEach(line => {
      const [product_id, ch, type, value] = line.split(',').map(s => s.trim());
      if (!product_id) return;
      const ts = new Date().toISOString();
      if (type === 'sale') {
        appendLog('sales-log.jsonl', {
          timestamp: ts, product_id, channel: ch,
          event: 'sale', quantity: 1, price: Number(value), revenue: Number(value),
          source: 'csv-import'
        });
        console.log(`  + sale: ${product_id} ${ch} ₩${value}`);
      } else {
        appendLog('traffic-log.jsonl', {
          timestamp: ts, product_id, channel: ch,
          event: type || 'view', count: Number(value) || 1,
          source: 'csv-import'
        });
        console.log(`  + traffic: ${product_id} ${ch} ${value}`);
      }
    });
  }
  console.log('\n  ✓ import complete');
  process.exit(0);
}

// ── Interactive: Manual Data Entry ────────────────
if (args.includes('--interactive')) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  function ask(q) {
    return new Promise(resolve => rl.question(q, resolve));
  }

  (async () => {
    console.log('  Available products:');
    liveProducts.forEach(p => console.log(`    ${p.id}: ${p.name} (${p.state})`));
    console.log();

    const pid = await ask('  product_id: ');
    const ch = await ask('  channel (coupang/naver/youtube/showroom): ');
    const type = await ask('  type (sale/view/click): ');

    if (type === 'sale') {
      const qty = await ask('  quantity: ');
      const price = await ask('  price: ');
      appendLog('sales-log.jsonl', {
        timestamp: new Date().toISOString(),
        product_id: pid, channel: ch, event: 'sale',
        quantity: Number(qty), price: Number(price),
        revenue: Number(qty) * Number(price),
        source: 'manual'
      });
      console.log(`  ✓ sale recorded`);
    } else {
      const count = await ask('  count: ');
      appendLog('traffic-log.jsonl', {
        timestamp: new Date().toISOString(),
        product_id: pid, channel: ch,
        event: type, count: Number(count),
        source: 'manual'
      });
      console.log(`  ✓ traffic recorded`);
    }

    updateChannelPerformance(pid, ch);
    rl.close();
  })();
} else {
  // ── Auto Collect: Aggregate from logs ───────────
  console.log('  mode: aggregate');
  console.log(`  live products: ${liveProducts.length}`);

  aggregateDashboard();
  console.log('\n  ✓ dashboard.json updated');
}

// ── Channel Performance ───────────────────────────
function updateChannelPerformance(productId, ch) {
  appendLog('channel-performance.jsonl', {
    timestamp: new Date().toISOString(),
    product_id: productId,
    channel: ch,
    event: 'update'
  });
}

// ── Dashboard Aggregation ─────────────────────────
function aggregateDashboard() {
  const salesLog = path.join(ANALYTICS, 'sales-log.jsonl');
  const trafficLog = path.join(ANALYTICS, 'traffic-log.jsonl');
  const deployLog = path.join(ANALYTICS, 'deploy-log.jsonl');

  function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf8').trim().split('\n')
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(e => e && !e.$dummy);
  }

  const sales = readJsonl(salesLog);
  const traffic = readJsonl(trafficLog);
  const deploys = readJsonl(deployLog);

  const revenueByChannel = {};
  const salesByProduct = {};
  sales.forEach(s => {
    revenueByChannel[s.channel] = (revenueByChannel[s.channel] || 0) + (s.revenue || 0);
    salesByProduct[s.product_id] = (salesByProduct[s.product_id] || 0) + (s.quantity || 0);
  });

  const trafficByChannel = {};
  traffic.forEach(t => {
    trafficByChannel[t.channel] = (trafficByChannel[t.channel] || 0) + (t.count || 0);
  });

  const channels = ['coupang', 'naver', 'youtube', 'showroom'];
  const channelMetrics = {};
  channels.forEach(ch => {
    const rev = revenueByChannel[ch] || 0;
    const views = trafficByChannel[ch] || 0;
    channelMetrics[ch] = {
      revenue: rev,
      traffic: views,
      conversion: views > 0 ? ((salesByProduct[ch] || 0) / views * 100).toFixed(2) + '%' : 'N/A',
      status: 'active'
    };
  });

  const totalRevenue = Object.values(revenueByChannel).reduce((a, b) => a + b, 0);
  const totalTraffic = Object.values(trafficByChannel).reduce((a, b) => a + b, 0);

  const dashboard = {
    generated: new Date().toISOString(),
    period: date.substring(0, 7),
    kpi: {
      total_revenue: totalRevenue,
      total_orders: sales.length,
      total_traffic: totalTraffic,
      products_live: liveProducts.length,
      products_total: catalog.products.length,
      avg_order_value: sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0,
      currency: 'KRW'
    },
    channels: channelMetrics,
    top_products: Object.entries(salesByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, qty]) => ({ product_id: id, quantity: qty, revenue: revenueByChannel[id] || 0 })),
    deploys: {
      total: deploys.length,
      all_live: deploys.filter(d => d.all_live).length
    },
    loopback: {
      note: 'TRACKING → S1_SPEC: 매출 데이터 기반 다음 상품 기획',
      ready: totalRevenue > 0
    }
  };

  fs.writeFileSync(
    path.join(ANALYTICS, 'dashboard.json'),
    JSON.stringify(dashboard, null, 2) + '\n'
  );

  console.log(`  revenue: ₩${totalRevenue.toLocaleString()}`);
  console.log(`  orders: ${sales.length}`);
  console.log(`  traffic: ${totalTraffic}`);
  channels.forEach(ch => {
    console.log(`    ${ch}: ₩${channelMetrics[ch].revenue.toLocaleString()} / ${channelMetrics[ch].traffic} views`);
  });
}
