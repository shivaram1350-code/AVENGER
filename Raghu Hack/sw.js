// Service Worker for StressCheck Pro
const CACHE_NAME = 'stresscheck-pro-v1.0.0';
const urlsToCache = [
    '/app.html',
    '/app-styles.css',
    '/app-script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.log('Cache installation failed:', error);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(function(response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(function(error) {
                    console.log('Fetch failed:', error);
                    // Return offline page or fallback
                    if (event.request.destination === 'document') {
                        return caches.match('/app.html');
                    }
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline data
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Sync offline data when connection is restored
    return new Promise(function(resolve) {
        // Get offline data from IndexedDB
        const request = indexedDB.open('StressCheckDB', 1);
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['offlineData'], 'readwrite');
            const store = transaction.objectStore('offlineData');
            
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = function() {
                const offlineData = getAllRequest.result;
                
                // Process offline data
                offlineData.forEach(function(data) {
                    // Send data to server or process locally
                    console.log('Processing offline data:', data);
                });
                
                // Clear offline data after processing
                store.clear();
                resolve();
            };
        };
        
        request.onerror = function() {
            console.log('Failed to open IndexedDB');
            resolve();
        };
    });
}

// Push notification handling
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'New stress management tip available!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('StressCheck Pro', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/app.html')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', function(event) {
    if (event.tag === 'stress-data-sync') {
        event.waitUntil(syncStressData());
    }
});

function syncStressData() {
    // Sync stress data periodically
    return fetch('/api/sync-stress-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            timestamp: Date.now(),
            data: 'stress-data'
        })
    }).catch(function(error) {
        console.log('Background sync failed:', error);
    });
}

// Handle app updates
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
});

// Cache strategies for different types of requests
const CACHE_STRATEGIES = {
    // Cache first for static assets
    CACHE_FIRST: function(request) {
        return caches.match(request).then(function(response) {
            return response || fetch(request).then(function(fetchResponse) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        });
    },
    
    // Network first for API calls
    NETWORK_FIRST: function(request) {
        return fetch(request).then(function(response) {
            return caches.open(CACHE_NAME).then(function(cache) {
                cache.put(request, response.clone());
                return response;
            });
        }).catch(function() {
            return caches.match(request);
        });
    },
    
    // Stale while revalidate for dynamic content
    STALE_WHILE_REVALIDATE: function(request) {
        return caches.match(request).then(function(response) {
            const fetchPromise = fetch(request).then(function(fetchResponse) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
            
            return response || fetchPromise;
        });
    }
};

// Apply appropriate cache strategy based on request type
self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);
    
    // Static assets - cache first
    if (url.pathname.endsWith('.css') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.png') || 
        url.pathname.endsWith('.jpg') || 
        url.pathname.endsWith('.svg')) {
        event.respondWith(CACHE_STRATEGIES.CACHE_FIRST(request));
    }
    // API calls - network first
    else if (url.pathname.startsWith('/api/')) {
        event.respondWith(CACHE_STRATEGIES.NETWORK_FIRST(request));
    }
    // HTML pages - stale while revalidate
    else if (request.destination === 'document') {
        event.respondWith(CACHE_STRATEGIES.STALE_WHILE_REVALIDATE(request));
    }
    // Default - network first
    else {
        event.respondWith(CACHE_STRATEGIES.NETWORK_FIRST(request));
    }
});
