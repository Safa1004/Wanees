const CACHE='wanees-public-v1';
const PUBLIC=['/offline.html','/emblem.svg','/resources/story-en.html','/resources/story-ar.html','/resources/talk-en.html','/resources/talk-ar.html','/resources/planner-en.html','/resources/planner-ar.html','/resources/colour-en.html','/resources/colour-ar.html'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PUBLIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('wanees-public-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!PUBLIC.includes(url.pathname)||url.search)return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});
