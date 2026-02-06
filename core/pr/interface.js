/**
 * Guild Core - PR Interface
 *
 * PR 시스템의 핵심 인터페이스.
 * 브랜치별 config를 읽어 카카오 채널 ID 등을 자동 설정합니다.
 */

(function() {
  'use strict';

  class PRInterface {
    constructor(options = {}) {
      this.config = {
        storageKey: 'pr_requests',
        kakaoChannelId: null,
        webhookUrl: null,
        types: options.types || this._getDefaultTypes()
      };

      this._initFromConfig();
    }

    async _initFromConfig() {
      if (window.GuildConfig) {
        window.GuildConfig.onReady(config => {
          const prConfig = config.pr || {};
          this.config.kakaoChannelId = prConfig.kakaoId;
          this.config.webhookUrl = prConfig.webhookUrl || null;

          // Update storage key with prefix
          if (window.GuildStorage) {
            this.config.storageKey = window.GuildStorage.key('pr_requests');
          }
        });
      }
    }

    _getDefaultTypes() {
      return {
        edit: { name: '페이지 수정', price: 10000, emoji: '✏️' },
        pwa: { name: 'PWA/APK 제작', price: 50000, emoji: '📱' },
        content: { name: '콘텐츠 제작', price: 30000, emoji: '📝' },
        design: { name: '디자인 변경', price: 20000, emoji: '🎨' },
        custom: { name: '기타 요청', price: 0, emoji: '💬' }
      };
    }

    // Override types for industry-specific templates
    setTypes(types) {
      this.config.types = { ...this._getDefaultTypes(), ...types };
    }

    // Create a new PR request
    create(data) {
      const request = {
        id: this._generateId(),
        type: data.type,
        slot: data.slot || this._detectSlot(),
        content: data.content,
        contact: data.contact || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        page: data.page || window.location.href
      };

      // Save to storage
      const requests = this.getAll();
      requests.push(request);
      this._save(requests);

      return request;
    }

    // Get all requests
    getAll() {
      if (window.GuildStorage) {
        return window.GuildStorage.get('PR_REQUESTS') || [];
      }
      const stored = localStorage.getItem(this.config.storageKey);
      return stored ? JSON.parse(stored) : [];
    }

    // Get requests by slot
    getBySlot(slot) {
      return this.getAll().filter(r => r.slot === slot);
    }

    // Get pending requests
    getPending() {
      return this.getAll().filter(r => r.status === 'pending');
    }

    // Update request status
    updateStatus(id, status) {
      const requests = this.getAll();
      const request = requests.find(r => r.id === id);
      if (request) {
        request.status = status;
        request.updatedAt = new Date().toISOString();
        this._save(requests);
      }
      return request;
    }

    // Generate KakaoTalk message
    generateMessage(request) {
      const typeInfo = this.config.types[request.type] || { name: request.type, emoji: '📋', price: 0 };
      const guildName = window.GuildConfig?.get('site.name') || 'Guild';

      return `[${guildName} PR 요청]

📋 요청 ID: ${request.id}
${typeInfo.emoji} 유형: ${typeInfo.name}
📍 슬롯: ${request.slot}
💰 예상 비용: ${typeInfo.price > 0 ? `${(typeInfo.price/10000).toFixed(0)}만원` : '협의'}

📝 요청 내용:
${request.content}

🔗 페이지: ${request.page}
📅 요청 시간: ${new Date(request.createdAt).toLocaleString('ko-KR')}
`;
    }

    // Open KakaoTalk with message
    openKakao(request) {
      const message = this.generateMessage(request);
      const kakaoUrl = `https://pf.kakao.com/_${this.config.kakaoChannelId}/chat`;

      navigator.clipboard.writeText(message).then(() => {
        window.open(kakaoUrl, '_blank');
      }).catch(() => {
        alert('메시지를 복사해서 카카오톡에 붙여넣기 해주세요:\n\n' + message);
      });
    }

    // Send webhook if configured
    sendWebhook(request) {
      if (!this.config.webhookUrl) return Promise.resolve();

      return fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      }).catch(err => console.error('[PR] Webhook failed:', err));
    }

    // Helpers
    _generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    _detectSlot() {
      const match = window.location.pathname.match(/slots\/(slot\d+)/);
      return match ? match[1] : 'hq';
    }

    _save(requests) {
      if (window.GuildStorage) {
        window.GuildStorage.set('PR_REQUESTS', requests);
      } else {
        localStorage.setItem(this.config.storageKey, JSON.stringify(requests));
      }
    }
  }

  window.PRInterface = PRInterface;

})();
