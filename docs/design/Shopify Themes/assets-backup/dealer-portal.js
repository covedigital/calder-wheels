(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initDealerPortal();
  });

  function initDealerPortal() {
    initMobileSidebar();
    initUserMenu();
    initNotifications();
  }

  /* ── Mobile Sidebar Toggle ── */
  function initMobileSidebar() {
    var toggle = document.querySelector('[data-dealer-mobile-toggle]');
    var sidebar = document.querySelector('[data-dealer-sidebar]');
    var overlay = document.querySelector('.dp-sidebar-overlay');

    if (!toggle || !sidebar) return;

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'dp-sidebar-overlay';
      overlay.setAttribute('data-sidebar-overlay', '');
      document.body.appendChild(overlay);
    }

    function openSidebar() {
      sidebar.classList.add('dp-sidebar--open');
      overlay.classList.add('dp-sidebar-overlay--visible');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('dp-sidebar--open');
      overlay.classList.remove('dp-sidebar-overlay--visible');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (sidebar.classList.contains('dp-sidebar--open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('dp-sidebar--open')) {
        closeSidebar();
      }
    });
  }

  /* ── User Menu Dropdown ── */
  function initUserMenu() {
    var userMenu = document.querySelector('[data-dealer-user-menu]');
    if (!userMenu) return;

    userMenu.addEventListener('click', function(e) {
      var target = this.querySelector('.dp-topbar__user-dropdown');
      if (!target) {
        var dropdown = document.createElement('div');
        dropdown.className = 'dp-topbar__user-dropdown';
        dropdown.style.cssText = 'position:absolute;top:100%;right:0;background:var(--dp-white);border:1px solid var(--dp-border);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.1);padding:8px 0;min-width:200px;z-index:200;';
        dropdown.innerHTML =
          '<a href="/account" style="display:block;padding:8px 16px;font-size:13px;color:var(--dp-text);text-decoration:none;">Account Settings</a>' +
          '<a href="/account/addresses" style="display:block;padding:8px 16px;font-size:13px;color:var(--dp-text);text-decoration:none;">Addresses</a>' +
          '<div style="border-top:1px solid var(--dp-border);margin:4px 12px;"></div>' +
          '<a href="/account/logout" style="display:block;padding:8px 16px;font-size:13px;color:var(--dp-bad, #C94A4A);text-decoration:none;">Sign Out</a>';
        this.style.position = 'relative';
        this.appendChild(dropdown);
      } else {
        target.remove();
      }
    });

    document.addEventListener('click', function(e) {
      if (!userMenu.contains(e.target)) {
        var dropdown = userMenu.querySelector('.dp-topbar__user-dropdown');
        if (dropdown) dropdown.remove();
      }
    });
  }

  /* ── Notification Panel ── */
  function initNotifications() {
    var notifBtn = document.querySelector('[data-dealer-notif-toggle]');
    if (!notifBtn) return;

    notifBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var existing = this.querySelector('.dp-topbar__notif-panel');
      if (existing) {
        existing.remove();
        return;
      }
      var panel = document.createElement('div');
      panel.className = 'dp-topbar__notif-panel';
      panel.style.cssText = 'position:absolute;top:100%;right:0;width:320px;background:var(--dp-white);border:1px solid var(--dp-border);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.1);z-index:200;';
      panel.innerHTML =
        '<div style="padding:14px 16px;border-bottom:1px solid var(--dp-border);font-size:14px;font-weight:600;">Notifications</div>' +
        '<div style="padding:24px 16px;text-align:center;color:var(--dp-text-light);font-size:13px;">No new notifications.</div>';
      this.style.position = 'relative';
      this.appendChild(panel);

      document.addEventListener('click', function docClick(ev) {
        if (!notifBtn.contains(ev.target)) {
          var p = notifBtn.querySelector('.dp-topbar__notif-panel');
          if (p) p.remove();
          document.removeEventListener('click', docClick);
        }
      });
    });
  }
})();