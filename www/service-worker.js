// ============================================================
// SERVICE WORKER — для фоновых уведомлений в веб-режиме
// ============================================================
const CACHE_NAME = 'finance-app-v10';

// Установка
self.addEventListener('install', function(event) {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

// Клик по уведомлению — открыть приложение
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});

// Push-сообщение (для будущего)
self.addEventListener('push', function(event) {
  console.log('[SW] Push received');
  const data = event.data ? event.data.json() : {};
  const title = data.title || '💰 Мой Финансовый Путь';
  const options = {
    body: data.body || 'Пора заплатить себе!',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgcng9IjQwIiBmaWxsPSIjMWEwYTJhIi8+PHRleHQgeD0iOTYiIHk9IjEzMCIgZm9udC1zaXplPSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ3MDAiPvCfjrA8L3RleHQ+PC9zdmc+',
    badge: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiA5NiI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMjAiIGZpbGw9IiNmZmQ3MDAiLz48L3N2Zz4=',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: true,
    data: data.data || {}
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Сообщения от приложения
self.addEventListener('message', function(event) {
  console.log('[SW] Message from app:', event.data);

  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title || '💰 Мой Финансовый Путь';
    const body = event.data.body || 'Пора заплатить себе!';
    const tag = event.data.tag || 'reminder-' + Date.now();

    self.registration.showNotification(title, {
      body: body,
      icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgcng9IjQwIiBmaWxsPSIjMWEwYTJhIi8+PHRleHQgeD0iOTYiIHk9IjEzMCIgZm9udC1zaXplPSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ3MDAiPvCfjrA8L3RleHQ+PC9zdmc+',
      vibrate: [200, 100, 200],
      tag: tag,
      requireInteraction: true
    });
  }
});