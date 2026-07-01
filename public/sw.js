self.addEventListener('install', (e) => {
  console.log('Pixel Poet PWA Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});