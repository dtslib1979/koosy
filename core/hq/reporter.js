/**
 * Guild Core - HQ Reporter
 *
 * 길드 현황을 집계하고 리포트합니다.
 * 대시보드 통계, 슬롯 현황 등을 제공합니다.
 */

(function() {
  'use strict';

  class HQReporter {
    constructor() {
      this.registry = null;
      this.config = null;
      this._init();
    }

    async _init() {
      if (window.GuildConfig) {
        window.GuildConfig.onReady(config => {
          this.config = config;
          this._loadRegistry();
        });
      }
    }

    async _loadRegistry(path = '/registry.json') {
      try {
        const response = await fetch(path);
        if (response.ok) {
          this.registry = await response.json();
        }
      } catch (error) {
        console.warn('[HQReporter] Failed to load registry:', error);
      }
    }

    // Get slot statistics
    getSlotStats() {
      if (!this.registry) return null;

      const slots = this.registry.slots || [];
      const active = slots.filter(s => s.status === 'active');
      const pending = slots.filter(s => s.status === 'pending');
      const empty = slots.filter(s => s.status === 'empty');
      const paid = slots.filter(s => s.type === 'paid' && s.status === 'active');

      return {
        total: this.config?.guild?.maxSlots || 12,
        active: active.length,
        pending: pending.length,
        empty: empty.length,
        paidActive: paid.length,
        occupancyRate: Math.round((active.length / (this.config?.guild?.maxSlots || 12)) * 100)
      };
    }

    // Get revenue statistics
    getRevenueStats() {
      const stats = this.getSlotStats();
      if (!stats) return null;

      const pricing = this.config?.pricing || {};
      const monthlyPerSlot = pricing.monthlyBreakdown?.namoneygoal || pricing.monthly || 70000;

      const fixedRevenue = stats.paidActive * monthlyPerSlot;

      // Variable revenue from PR requests
      const prRequests = window.GuildStorage?.get('PR_REQUESTS') || [];
      const thisMonth = new Date().toISOString().slice(0, 7);
      const monthlyPRs = prRequests.filter(r =>
        r.status === 'completed' &&
        r.createdAt.startsWith(thisMonth)
      );

      let variableRevenue = 0;
      const prTypes = {
        edit: 10000,
        pwa: 50000,
        content: 30000,
        design: 20000
      };
      monthlyPRs.forEach(pr => {
        variableRevenue += prTypes[pr.type] || 0;
      });

      return {
        fixed: fixedRevenue,
        variable: variableRevenue,
        total: fixedRevenue + variableRevenue,
        paidSlots: stats.paidActive,
        completedPRs: monthlyPRs.length
      };
    }

    // Get pending PR count
    getPendingPRCount() {
      const prRequests = window.GuildStorage?.get('PR_REQUESTS') || [];
      return prRequests.filter(r => r.status === 'pending').length;
    }

    // Get recent activity
    getRecentActivity(limit = 10) {
      const prRequests = window.GuildStorage?.get('PR_REQUESTS') || [];

      return prRequests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .map(pr => ({
          type: 'pr',
          icon: '📋',
          text: `PR 요청: ${pr.type}`,
          time: new Date(pr.createdAt).toLocaleString('ko-KR'),
          slot: pr.slot,
          status: pr.status
        }));
    }

    // Get slot list for display
    getSlotList() {
      if (!this.registry) {
        return this._getDefaultSlotList();
      }
      return this.registry.slots;
    }

    _getDefaultSlotList() {
      const maxSlots = this.config?.guild?.maxSlots || 12;
      const anchorSlot = this.config?.guild?.anchorSlot || 'slot01';

      const slots = [];
      for (let i = 1; i <= maxSlots; i++) {
        const id = `slot${String(i).padStart(2, '0')}`;
        slots.push({
          id,
          name: id === anchorSlot ? '앵커 슬롯' : `슬롯 ${String(i).padStart(2, '0')}`,
          owner: id === anchorSlot ? '길드장' : null,
          type: id === anchorSlot ? 'anchor' : 'paid',
          status: id === anchorSlot ? 'active' : 'empty'
        });
      }
      return slots;
    }

    // Generate summary report
    generateReport() {
      const slotStats = this.getSlotStats();
      const revenueStats = this.getRevenueStats();
      const pendingPR = this.getPendingPRCount();

      return {
        guildName: this.config?.site?.name || 'Guild',
        industry: this.registry?.meta?.industry || 'general',
        slots: slotStats,
        revenue: revenueStats,
        pendingPR,
        generatedAt: new Date().toISOString()
      };
    }
  }

  window.HQReporter = HQReporter;

})();
