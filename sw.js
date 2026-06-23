const CACHE='edoworkout-alpha-v1.1';
const ASSETS=['./','./index.html','https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET')return;
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp).catch(()=>{}));return res;}).catch(()=>caches.match('./index.html'))));});
