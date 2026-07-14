const CACHE='edoworkout-alpha-v1.9';
// Coquille de l'app (les photos sont mises en cache à la volée, pas ici,
// pour qu'une photo absente n'empêche pas la mise en cache du reste).
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'];

self.addEventListener('install',e=>{
  // Précache résilient : chaque ressource indépendamment (une erreur n'annule pas les autres)
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})))));
  // NB : pas de skipWaiting() ici → le nouveau SW attend, ce qui permet
  // d'afficher le bandeau "mise à jour disponible" dans l'app.
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));
  self.clients.claim();
});
// L'app demande au SW en attente de prendre la main immédiatement
self.addEventListener('message',e=>{ if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp).catch(()=>{}));return res;}).catch(()=>caches.match('./index.html'))));
});
