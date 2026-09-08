// Firebase Cloud Messaging arka plan servis çalışanı (service worker).
// Bu dosya repo'nun KÖK dizininde durmalı — yani https://yakapos.com/firebase-messaging-sw.js
// adresinden erişilebilir olmalı. Konumu değiştirilemez, tarayıcı bu adı sabit arar.

importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Not: Bu config tüm restoranlar için ORTAKTIR (aynı Firebase projesi, yakapos-7ccf2).
// Hangi restoranın bildirimi olduğu ayrıca payload içindeki verilerle ayrıştırılır.
firebase.initializeApp({
  apiKey: "AIzaSyB8_i0JrMO5RFg49eqeL2bj_CP_BgxnJdM",
  authDomain: "yakapos-7ccf2.firebaseapp.com",
  projectId: "yakapos-7ccf2",
  storageBucket: "yakapos-7ccf2.firebasestorage.app",
  messagingSenderId: "1073439800098",
  appId: "1:1073439800098:web:f58e7b6ec6dc721aa0837b"
});

const messaging = firebase.messaging();

// Uygulama arka plandayken (sekme kapalı/minimize) gelen bildirimleri göster.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Bildirim";
  const options = {
    body: payload.notification?.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

// Bildirime tıklanınca uygulamayı öne getir.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
