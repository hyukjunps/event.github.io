/* O.Poong Game 2.1 — offline app shell. Do not intercept/cache third-party ads. */
const CACHE='opoong-game-shell-2.1.0';
const SHELL=['./','./index.html','./sw.js'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('opoong-game-shell-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return; // never cache ads
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);cache.put('./index.html',response.clone())}return response}).catch(async()=>await(await caches.open(CACHE)).match('./index.html')||Response.error()));
 }else if(url.pathname.startsWith(new URL(self.registration.scope).pathname)){
  event.respondWith(caches.match(req).then(found=>found||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return response})));
 }
});
