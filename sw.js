/* O.Poong Game retirement: replace old offline games with the closure notice. */
const CLOSED_HTML = "<!doctype html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n<meta name=\"theme-color\" content=\"#f5f7fb\"><meta name=\"description\" content=\"오풍 게임 서비스가 종료되었습니다. 이용해 주셔서 감사합니다.\">\n<title>오풍 게임 · 서비스 종료 안내</title>\n<style>\n*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:#f5f7fb;color:#202b42;font-family:system-ui,-apple-system,'Noto Sans KR',sans-serif}main{width:min(460px,100%);padding:36px 28px;border:1px solid #e1e6ef;border-radius:28px;background:#fff;box-shadow:0 18px 70px #2434510a}.brand{font-size:14px;letter-spacing:.03em;font-weight:750;color:#375bc8}.badge{display:inline-block;margin:36px 0 12px;padding:7px 11px;border-radius:9px;background:#eef1f7;color:#59647a;font-size:12px;font-weight:650}h1{font-size:30px;line-height:1.4;letter-spacing:-1px;margin:0 0 18px}p{font-size:15px;color:#647087;line-height:1.85;margin:0 0 12px}.notice{margin-top:24px;padding:14px 16px;border-radius:12px;background:#f6f8fc;font-size:13px;color:#51617e}a{display:flex;justify-content:center;align-items:center;min-height:52px;margin-top:28px;border-radius:14px;text-decoration:none;background:#315acd;color:white;font-weight:700}a:focus-visible{outline:3px solid #92b0ff;outline-offset:4px}\n</style>\n</head>\n<body><main><div class=\"brand\">O.Poong Game</div><div class=\"badge\">서비스 종료 안내</div><h1>오풍 게임의<br>서비스가 종료되었어요.</h1><p>그동안 오풍 게임을 이용해 주셔서 감사합니다.</p><p>이제 게임을 실행할 수 없어요.<br>학교생활 정보는 오풍에서 계속 만나보세요.</p><div class=\"notice\" role=\"status\">오풍 게임의 모든 게임 제공이 종료되었습니다.</div><a href=\"https://hyukjunps.github.io/\">오풍으로 돌아가기</a></main>\n<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});</script>\n</body></html>\n";
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('opoong-game-shell-')).map(k=>caches.delete(k)));
 await self.clients.claim();
 const tabs=await self.clients.matchAll({type:'window'});
 const scope=new URL(self.registration.scope);
 await Promise.all(tabs.filter(c=>new URL(c.url).pathname.startsWith(scope.pathname)).map(c=>c.navigate(c.url).catch(()=>{})));
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.mode==='navigate'&&url.origin===scope.origin&&url.pathname.startsWith(scope.pathname)){
  event.respondWith(Promise.resolve(new Response(CLOSED_HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})));
 }
});
