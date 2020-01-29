importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log('Workbox berhasil dimuat');
else
  console.log('Workbox gagal dimuat');

// precache
workbox.precaching.precacheAndRoute([
    { url: 'index.html', revision: '1' },
    { url: 'nav.html', revision: '1' },
    { url: 'assets/css/style.css', revision: '1' },
    { url: 'assets/css/animate.css', revision: '1' },
    { url: 'assets/css/materialize.min.css', revision: '1' },
    { url: 'assets/js/materialize.min.js', revision: '1' },
    { url: 'assets/js/jquery.min.js', revision: '1' },
    { url: 'assets/js/nav.js', revision: '1' },
    { url: 'assets/js/api.js', revision: '6' },
    { url: 'assets/js/loadSw.js', revision: '1' },
    { url: 'assets/lib/idb.js', revision: '1' },
    { url: 'assets/lib/db.js', revision: '1' },
    { url: 'manifest.json', revision: '1' }
]);

// routing
workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.cacheFirst({
    cacheName: 'wikimedia-team-badges',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2\//,
  workbox.strategies.cacheFirst({
    cacheName: 'api-football3',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/wow\/1\.1\.2\/wow\.min\.js/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'wow-js',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);
 
// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// notification
self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'assets/img/icon_.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});