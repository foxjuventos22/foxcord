const express=require('express');const http=require('http');const path=require('path');const{Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);const PORT=Number(process.env.PORT)||3000,history=new Map(),MAX=100;
app.use(express.static(path.join(__dirname,'public')));app.get('/health',(_,r)=>r.json({ok:true,service:'FoxCord'}));app.get('*',(_,r)=>r.sendFile(path.join(__dirname,'public','index.html')));
const room=v=>String(v??'geral').trim().replace(/\s+/g,'-').slice(0,40)||'geral';const name=v=>String(v??'Usuário').trim().replace(/\s+/g,' ').slice(0,30)||'Usuário';const text=v=>String(v??'').trim().slice(0,2000);
function users(r){return [...(io.sockets.adapter.rooms.get(r)||[])].map(id=>({id,name:io.sockets.sockets.get(id)?.data.name||'Usuário'}))}function leave(s){if(!s.data.room)return;const r=s.data.room;s.leave(r);s.to(r).emit('user-left',{id:s.id});io.to(r).emit('room-users',users(r));s.data.room=null}
io.on('connection',s=>{
 s.on('join',({room,name:n}={},ack)=>{leave(s);const r=room(room),n2=name(n);s.data.room=r;s.data.name=n2;s.join(r);s.emit('joined',{room:r,name:n2,messages:history.get(r)||[]});s.to(r).emit('user-joined',{id:s.id,name:n2});io.to(r).emit('room-users',users(r));if(typeof ack==='function')ack({ok:true})});
 s.on('chat',(t,ack)=>{const r=s.data.room,m=text(t);if(!r||!m)return;const x={id:Date.now()+'-'+Math.random().toString(36).slice(2),name:s.data.name||'Usuário',text:m,time:Date.now()};if(!history.has(r))history.set(r,[]);const h=history.get(r);h.push(x);if(h.length>MAX)h.splice(0,h.length-MAX);io.to(r).emit('chat',x);if(typeof ack==='function')ack({ok:true})});
 s.on('rename',(n,ack)=>{s.data.name=name(n);if(s.data.room)io.to(s.data.room).emit('room-users',users(s.data.room));s.emit('name-updated',s.data.name);if(typeof ack==='function')ack({ok:true})});
 s.on('signal',({to,data}={})=>{if(to&&data)io.to(to).emit('signal',{from:s.id,data})});s.on('disconnect',()=>{if(s.data.room){s.to(s.data.room).emit('user-left',{id:s.id});io.to(s.data.room).emit('room-users',users(s.data.room))}})
});server.listen(PORT,'0.0.0.0',()=>console.log('FoxCord running on '+PORT));
