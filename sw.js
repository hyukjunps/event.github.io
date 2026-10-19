/* O.Poong Game — cache only same-origin game files, never third-party ads. */
const CACHE='opoong-game-shell-2.1.4-hormone';
const SHELL=['./','./index.html','./sw.js','./hormone-expedition.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('opoong-game-shell-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 const scope=new URL(self.registration.scope);
 if(!url.pathname.startsWith(scope.pathname))return;
 if(req.mode==='navigate'){
  // Cache each document by its own URL so offline RPG navigation keeps the RPG.
  event.respondWith(fetch(req).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);cache.put(req,response.clone())}return response}).catch(async()=>await caches.match(req)||Response.error()));
 }else{
  event.respondWith(caches.match(req).then(found=>found||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return response})));
 }
});
