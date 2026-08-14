const CACHE_NAME = 'rejailbreak-cache-v1';

// Danh sách toàn bộ file cần tải về để chạy Offline
const urlsToCache = [
    './',
    './index.html',
    './utils.js',
    './helper.js',
    './int64.js',
    './stages.js',
    './offsets.js',
    './pwn.js',
    './icon.png' // Thêm cả logo vào cache
];

// Tiến hành cài đặt và lưu cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Đang lưu Cache hệ thống...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Bắt các yêu cầu tải file và trả về file từ Cache nếu mất mạng
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Nếu file có trong cache thì dùng luôn, không cần mạng
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
