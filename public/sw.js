const CACHE_NAME = 'pawpost-v2'

// Install — just activate immediately
self.addEventListener('install', () => {
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

// Fetch — pass everything through to network (no caching)
// This SW exists only to enable PWA install prompt
self.addEventListener('fetch', () => {
  // Let the browser handle all requests normally
  return
})
