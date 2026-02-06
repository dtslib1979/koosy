/**
 * Guild Core - Storage Keys Manager
 *
 * localStorage 키를 중앙 관리합니다.
 * 브랜치별 prefix를 자동으로 붙여 충돌을 방지합니다.
 */

(function() {
  'use strict';

  const GuildStorage = {
    _prefix: null,

    // Initialize with prefix from config
    init(prefix) {
      this._prefix = prefix || 'guild';
    },

    // Get prefixed key
    key(name) {
      if (!this._prefix && window.GuildConfig) {
        this._prefix = window.GuildConfig.getStoragePrefix();
      }
      return `${this._prefix || 'guild'}_${name}`;
    },

    // Standard key names
    keys: {
      CONSOLE_AUTH: 'console_auth',
      SLOTS: 'slots',
      PR_REQUESTS: 'pr_requests',
      BILLING: 'billing',
      ACTIVITY: 'activity',
      USER_PREFS: 'user_prefs'
    },

    // Get item with prefix
    get(keyName) {
      const fullKey = this.key(this.keys[keyName] || keyName);
      const value = localStorage.getItem(fullKey);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    },

    // Set item with prefix
    set(keyName, value) {
      const fullKey = this.key(this.keys[keyName] || keyName);
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
    },

    // Remove item
    remove(keyName) {
      const fullKey = this.key(this.keys[keyName] || keyName);
      localStorage.removeItem(fullKey);
    },

    // Session storage (for auth)
    session: {
      get(keyName) {
        const fullKey = GuildStorage.key(GuildStorage.keys[keyName] || keyName);
        return sessionStorage.getItem(fullKey);
      },
      set(keyName, value) {
        const fullKey = GuildStorage.key(GuildStorage.keys[keyName] || keyName);
        sessionStorage.setItem(fullKey, value);
      },
      remove(keyName) {
        const fullKey = GuildStorage.key(GuildStorage.keys[keyName] || keyName);
        sessionStorage.removeItem(fullKey);
      }
    },

    // Clear all guild-related storage
    clearAll() {
      const prefix = this._prefix || 'guild';
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix + '_')) {
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(prefix + '_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  };

  // Auto-init when config is ready
  if (window.GuildConfig) {
    window.GuildConfig.onReady(config => {
      GuildStorage.init(config.site?.shortName?.toLowerCase());
    });
  }

  window.GuildStorage = GuildStorage;

})();
