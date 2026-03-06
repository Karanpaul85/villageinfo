// public/sw.js
// ✅ This file must be in the /public folder so it's served at the root

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ✅ Handle incoming push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "New Notification", body: event.data.text() };
  }

  const {
    title = "VillageInfo",
    body = "",
    url = "/",
    icon,
    badge,
    image,
  } = data;

  const options = {
    body,
    icon: icon || "/icons/icon-192x192.png",
    badge: badge || "/icons/badge-72x72.png",
    data: { url },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...(image && { image }), // ← only added if image exists in payload
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ✅ Handle notification click — open/focus the target URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window with that URL is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
