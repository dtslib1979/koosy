/**
 * Guild Core - Console Gate (Authentication)
 *
 * 콘솔 접근 인증을 처리합니다.
 * config.json에서 accessCode를 읽어 하드코딩을 제거합니다.
 */

(function() {
  'use strict';

  class ConsoleGate {
    constructor(options = {}) {
      this.accessCode = options.accessCode || null;
      this.storageKey = options.storageKey || 'console_auth';
      this.onSuccess = options.onSuccess || (() => {});
      this.onFail = options.onFail || (() => {});
      this.lockElement = options.lockElement || document.getElementById('authLock');
      this.inputElement = options.inputElement || document.getElementById('authInput');
      this.buttonElement = options.buttonElement || document.getElementById('authBtn');

      this._initFromConfig();
    }

    async _initFromConfig() {
      // Wait for GuildConfig if not ready
      if (window.GuildConfig) {
        window.GuildConfig.onReady(config => {
          if (!this.accessCode) {
            this.accessCode = config.console?.accessCode;
          }
          if (config.console?.storageKey) {
            this.storageKey = config.console.storageKey;
          }
          this.init();
        });
      } else {
        this.init();
      }
    }

    init() {
      this.checkAuth();
      this.bindEvents();
    }

    checkAuth() {
      const isAuthed = this._getSession() === 'true';
      if (isAuthed) {
        this.unlock();
        return true;
      }
      return false;
    }

    bindEvents() {
      if (this.buttonElement) {
        this.buttonElement.addEventListener('click', () => {
          this.attemptAuth(this.inputElement?.value);
        });
      }

      if (this.inputElement) {
        this.inputElement.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.attemptAuth(this.inputElement.value);
          }
        });
      }
    }

    attemptAuth(code) {
      if (code === this.accessCode) {
        this._setSession('true');
        this.unlock();
        this.onSuccess();
        return true;
      } else {
        this.showError();
        this.onFail();
        return false;
      }
    }

    unlock() {
      if (this.lockElement) {
        this.lockElement.style.display = 'none';
      }
    }

    lock() {
      this._removeSession();
      if (this.lockElement) {
        this.lockElement.style.display = 'flex';
      }
    }

    showError() {
      if (this.inputElement) {
        this.inputElement.style.borderColor = '#ef4444';
        setTimeout(() => {
          this.inputElement.style.borderColor = '';
          this.inputElement.value = '';
        }, 500);
      }
    }

    isAuthenticated() {
      return this._getSession() === 'true';
    }

    logout() {
      this.lock();
    }

    // Session helpers using GuildStorage if available
    _getSession() {
      if (window.GuildStorage) {
        return window.GuildStorage.session.get('CONSOLE_AUTH');
      }
      return sessionStorage.getItem(this.storageKey);
    }

    _setSession(value) {
      if (window.GuildStorage) {
        window.GuildStorage.session.set('CONSOLE_AUTH', value);
      } else {
        sessionStorage.setItem(this.storageKey, value);
      }
    }

    _removeSession() {
      if (window.GuildStorage) {
        window.GuildStorage.session.remove('CONSOLE_AUTH');
      } else {
        sessionStorage.removeItem(this.storageKey);
      }
    }
  }

  window.ConsoleGate = ConsoleGate;

})();
