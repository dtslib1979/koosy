/**
 * Guild Core - Config Loader
 *
 * config.json을 로드하여 전역에서 사용할 수 있게 합니다.
 * 모든 하드코딩된 값은 config.json에서 읽어옵니다.
 */

(function() {
  'use strict';

  const GuildConfig = {
    _config: null,
    _loaded: false,
    _callbacks: [],

    // Load config.json
    async load(configPath = '/config.json') {
      if (this._loaded) return this._config;

      try {
        const response = await fetch(configPath);
        if (!response.ok) throw new Error('Config not found');

        this._config = await response.json();
        this._loaded = true;

        // Execute pending callbacks
        this._callbacks.forEach(cb => cb(this._config));
        this._callbacks = [];

        return this._config;
      } catch (error) {
        console.error('[GuildConfig] Failed to load config:', error);
        return null;
      }
    },

    // Get config value by path (e.g., 'console.accessCode')
    get(path, defaultValue = null) {
      if (!this._config) return defaultValue;

      const keys = path.split('.');
      let value = this._config;

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return defaultValue;
        }
      }

      return value;
    },

    // Get full config object
    getAll() {
      return this._config;
    },

    // Wait for config to be ready
    onReady(callback) {
      if (this._loaded) {
        callback(this._config);
      } else {
        this._callbacks.push(callback);
      }
    },

    // Check if config is loaded
    isLoaded() {
      return this._loaded;
    },

    // Get storage prefix from config
    getStoragePrefix() {
      return this.get('site.shortName', 'guild').toLowerCase();
    },

    // Get auth config
    getAuthConfig() {
      return {
        accessCode: this.get('console.accessCode'),
        storageKey: this.get('console.storageKey')
      };
    },

    // Get PR config
    getPRConfig() {
      return {
        channel: this.get('pr.channel'),
        kakaoId: this.get('pr.kakaoId'),
        webhookEnabled: this.get('pr.webhookEnabled', false)
      };
    },

    // Get guild config
    getGuildConfig() {
      return {
        maxSlots: this.get('guild.maxSlots', 12),
        anchorSlot: this.get('guild.anchorSlot', 'slot01'),
        paidSlots: this.get('guild.paidSlots', [])
      };
    }
  };

  // Export
  window.GuildConfig = GuildConfig;

  // Auto-load if config.json exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GuildConfig.load());
  } else {
    GuildConfig.load();
  }

})();
