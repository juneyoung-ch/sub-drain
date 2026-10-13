const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}const file=path.resolve(__dirname,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(err,body)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)]||'text/plain'});res.end(err?'Not found':body);});}).listen(4173,'127.0.0.1',()=>console.log('subdrain: http://localhost:4173'));
