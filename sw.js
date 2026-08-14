const CACHE_NAME = 'rejailbreak-cache-v2';

// Danh sách các file cốt lõi cần cache ngay khi cài đặt
const urlsToCache = [
    './',
    './index.html',
    './utils.js',
    './helper.js',
    './int64.js',
    './stages.js',
    './offsets.js',
    './pwn.js',
    './version.json',
    './icon.png'
];

// Tiến hành cài đặt và lưu cache
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Đang lưu Cache hệ thống phiên bản mới...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Xóa bỏ các cache cũ khi có phiên bản Service Worker mới kích hoạt
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Đang dọn dẹp cache cũ:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Bắt các yêu cầu tải file
self.addEventListener('fetch', event => {
    // Nếu request là file version.json thì luôn lấy mới từ mạng, không lấy cache cũ
    if (event.request.url.includes('version.json')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Các file khác thì ưu tiên lấy từ cache để chạy offline
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
