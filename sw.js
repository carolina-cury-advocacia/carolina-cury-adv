/* =====================================================
   DRA. CAROLINA P. CURY — SERVICE WORKER
   PWA
   ===================================================== */

const CACHE_NAME = "carolina-cury-pwa-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/carolina-hero.png"
];


/* =====================================================
   INSTALAÇÃO
   ===================================================== */

self.addEventListener("install", (event) => {
  
  event.waitUntil(
    
    caches.open(CACHE_NAME).then((cache) => {
      
      return cache.addAll(FILES_TO_CACHE);
      
    })
    
  );
  
  self.skipWaiting();
  
});


/* =====================================================
   ATIVAÇÃO
   ===================================================== */

self.addEventListener("activate", (event) => {
  
  event.waitUntil(
    
    caches.keys().then((cacheNames) => {
      
      return Promise.all(
        
        cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
        
      );
      
    })
    
  );
  
  self.clients.claim();
  
});


/* =====================================================
   CACHE / FUNCIONAMENTO OFFLINE
   ===================================================== */

self.addEventListener("fetch", (event) => {
  
  if (event.request.method !== "GET") {
    return;
  }
  
  event.respondWith(
    
    caches.match(event.request).then((cachedResponse) => {
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then((networkResponse) => {
          
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === "opaque"
          ) {
            return networkResponse;
          }
          
          const responseClone = networkResponse.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            
            cache.put(
              event.request,
              responseClone
            );
            
          });
          
          return networkResponse;
          
        })
        .catch(() => {
          
          return caches.match("./index.html");
          
        });
      
    })
    
  );
  
});
