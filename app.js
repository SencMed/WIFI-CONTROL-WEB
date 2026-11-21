const content = {
  connection: {title:"Conexión", eyebrow:"DIAGNÓSTICO DEL TELÉFONO", interactive:true},
  devices: {title:"Dispositivos", eyebrow:"EQUIPOS DE LA RED", tiles:[["Escaneo de red","No disponible en navegador"],["Equipos conectados al router","Requiere acceso autorizado del router"],["Dirección MAC","Protegida por el sistema móvil"],["Detección local","Limitada por iOS y Android"]], note:"El navegador no puede escanear libremente la red local ni leer la lista privada de clientes del módem. Esa lectura se añadirá cuando exista un método compatible con cada router."},
  wifi: {title:"Wi-Fi", eyebrow:"RED INALÁMBRICA", tiles:[["Tipo de conexión","Según navegador"],["Red Wi-Fi (SSID)","Protegida por el sistema"],["Banda Wi-Fi","No expuesta por todos los móviles"],["Seguridad","Consultar en el router"]], note:"Por privacidad, iOS y muchos navegadores no permiten leer el nombre, contraseña, banda o configuración Wi-Fi. No se modifica ninguna opción."},
  speed: {title:"Velocidad", eyebrow:"PRUEBA REAL DESDE EL TELÉFONO", interactiveSpeed:true},
  security: {title:"Seguridad", eyebrow:"PROTECCIÓN", tiles:[["Panel del router","Acceso manual"],["Contraseña Wi-Fi","No consultada"],["WPS / Firewall","No consultados"],["Cambios automáticos","Desactivados"]], note:"No cambiaremos contraseñas ni opciones de seguridad. La revisión de ajustes dependerá del acceso de solo lectura que permita cada modelo."},
  maintenance: {title:"MANTENIMIENTO", eyebrow:"SISTEMA", tiles:[["Versión web","0.3.0"],["Proyecto","WIFI CONTROL WEB"],["Compatibilidad","iPhone y Android"],["Proyecto Flutter","Independiente e intacto"]], note:"Esta edición web se ejecuta directamente en el navegador. Las mediciones de velocidad usan servidores públicos y requieren conexión a internet."}
};
const homeView=document.querySelector("#home-view");
const moduleView=document.querySelector("#module-view");
const moduleContent=document.querySelector("#module-content");
function showHome(){moduleView.hidden=true;homeView.hidden=false;window.scrollTo({top:0,behavior:"smooth"});}
function connectionMarkup(){
  const saved=localStorage.getItem("wifiControlRouterIp")||"192.168.1.1";
  return `<div class="data-grid">
    <article class="data-tile"><span>Internet en el teléfono</span><strong id="net-online">Consultando…</strong></article>
    <article class="data-tile"><span>Tipo de red estimado</span><strong id="net-type">No informado</strong></article>
    <article class="data-tile"><span>Velocidad estimada por navegador</span><strong id="net-downlink">No disponible</strong></article>
    <article class="data-tile"><span>Latencia estimada por navegador</span><strong id="net-rtt">No disponible</strong></article>
  </div>
  <div class="router-form" style="margin-top:16px">
    <label for="router-ip">Dirección IP del router</label>
    <input id="router-ip" inputmode="decimal" autocomplete="off" placeholder="Ej. 192.168.1.1" value="${saved}">
    <label for="router-brand">Fabricante</label>
    <select id="router-brand"><option value="Huawei">Huawei</option><option value="KAON">KAON</option><option value="Otro">Otro fabricante</option></select>
    <label for="router-model">Modelo (opcional)</label>
    <input id="router-model" placeholder="Ej. HG8245W5-6T o CG3000">
    <button class="action-button" id="open-router" type="button">Abrir panel del router ↗</button>
    <p class="form-status" id="router-status" role="status">Dirección sugerida: 192.168.1.1. Conectá el teléfono al Wi-Fi del router.</p>
  </div>
  <div class="notice"><b>Alcance:</b> el diagnóstico de arriba consulta el teléfono. Abrir el panel no significa que WIFI CONTROL ya pueda leer los datos internos del router.</div>`;
}
function speedMarkup(){
  return `<div class="speed-panel">
    <div class="data-grid">
      <article class="data-tile"><span>Latencia HTTP</span><strong id="speed-ping">—</strong></article>
      <article class="data-tile"><span>Descarga</span><strong id="speed-download">—</strong></article>
      <article class="data-tile"><span>Subida</span><strong id="speed-upload">—</strong></article>
      <article class="data-tile"><span>Estado</span><strong id="speed-state">Listo para medir</strong></article>
    </div>
    <button class="action-button" id="run-speed" type="button">Iniciar prueba de velocidad</button>
    <p class="form-status" id="speed-status" role="status">La prueba usa servidores públicos de Cloudflare. Puede consumir hasta unos 15 MB de datos móviles.</p>
  </div>
  <div class="notice"><b>Importante:</b> la latencia es una medición HTTP, no un ping ICMP. El resultado depende del servidor de prueba, la señal y el teléfono; no mide directamente la velocidad entre el router y el proveedor.</div>`;
}
function updatePhoneInfo(){
  const online=document.querySelector("#net-online");
  if(!online)return;
  online.textContent=navigator.onLine?"Conectado":"Sin conexión";
  const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  document.querySelector("#net-type").textContent=c?(c.type||c.effectiveType||"No especificado"):"No expuesto por este navegador";
  document.querySelector("#net-downlink").textContent=c&&c.downlink?c.downlink+" Mbps":"No disponible";
  document.querySelector("#net-rtt").textContent=c&&c.rtt?c.rtt+" ms":"No disponible";
}
function showModule(key){
  const item=content[key];if(!item)return;
  let body=item.interactive?connectionMarkup():item.interactiveSpeed?speedMarkup():`<div class="data-grid">${item.tiles.map(([label,value])=>`<article class="data-tile"><span>${label}</span><strong>${value}</strong></article>`).join("")}</div><div class="notice"><b>Información:</b> ${item.note}</div>`;
  moduleContent.innerHTML=`<div class="module-page-heading"><p class="eyebrow">${item.eyebrow}</p><h1>${item.title}</h1><span class="tag">v0.3.0</span></div>${body}`;
  homeView.hidden=true;moduleView.hidden=false;
  if(item.interactive){
    updatePhoneInfo();
    const ipInput=document.querySelector("#router-ip"),status=document.querySelector("#router-status");
    document.querySelector("#open-router").addEventListener("click",()=>{
      const ip=ipInput.value.trim();
      const valid=/^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/.test(ip);
      if(!valid){status.textContent="Escribí una dirección IPv4 válida, por ejemplo 192.168.1.1.";return;}
      localStorage.setItem("wifiControlRouterIp",ip);
      status.textContent="Abriendo "+ip+". Si no carga, verificá que estés conectado al Wi-Fi del router.";
      window.open("http://"+ip+"/","_blank","noopener");
    });
    window.addEventListener("online",updatePhoneInfo);window.addEventListener("offline",updatePhoneInfo);
  }
  if(item.interactiveSpeed)setupSpeedTest();
  window.scrollTo({top:0,behavior:"smooth"});
}
function setupSpeedTest(){
  const $=id=>document.getElementById(id);
  const button=$("run-speed"),status=$("speed-status"),state=$("speed-state");
  button.addEventListener("click",async()=>{
    if(!navigator.onLine){status.textContent="El teléfono aparece sin conexión a internet.";return;}
    button.disabled=true;button.textContent="Midiendo…";state.textContent="En curso";
    $("speed-ping").textContent="Midiendo…";$("speed-download").textContent="—";$("speed-upload").textContent="—";
    try{
      const base="https://speed.cloudflare.com";
      const samples=[];
      for(let i=0;i<5;i++){
        const start=performance.now();
        const response=await fetch(base+"/__down?bytes=0&cache="+Date.now()+"-"+i,{cache:"no-store"});
        if(!response.ok)throw new Error("El servidor de medición no respondió.");
        await response.arrayBuffer();samples.push(performance.now()-start);
      }
      const sorted=[...samples].sort((a,b)=>a-b),ping=Math.round(sorted[2]);
      $("speed-ping").textContent=ping+" ms";status.textContent="Midiendo descarga…";
      const downBytes=8000000,startDown=performance.now();
      const down=await fetch(base+"/__down?bytes="+downBytes+"&cache="+Date.now(),{cache:"no-store"});
      if(!down.ok)throw new Error("No se pudo medir la descarga.");
      const downData=await down.arrayBuffer(),downSeconds=(performance.now()-startDown)/1000;
      const downMbps=(downData.byteLength*8/downSeconds/1000000);
      $("speed-download").textContent=downMbps.toFixed(2)+" Mbps";status.textContent="Midiendo subida…";
      const uploadBytes=2000000,buffer=new Uint8Array(uploadBytes);crypto.getRandomValues(buffer.subarray(0,65536));
      for(let i=65536;i<uploadBytes;i+=65536)buffer.set(buffer.subarray(0,Math.min(65536,uploadBytes-i)),i);
      const startUp=performance.now();
      const up=await fetch(base+"/__up",{method:"POST",body:buffer,headers:{"Content-Type":"application/octet-stream"},cache:"no-store"});
      if(!up.ok)throw new Error("El servidor no aceptó la prueba de subida.");
      await up.text();const upSeconds=(performance.now()-startUp)/1000;
      $("speed-upload").textContent=(uploadBytes*8/upSeconds/1000000).toFixed(2)+" Mbps";
      state.textContent="Completada";status.textContent="Prueba terminada. Repetí para comparar resultados.";
    }catch(error){state.textContent="No completada";status.textContent="No se pudo completar la prueba: "+error.message+" Podés intentarlo de nuevo con una conexión estable.";}
    finally{button.disabled=false;button.textContent="Repetir prueba";}
  });
}
document.querySelectorAll(".module").forEach(button=>button.addEventListener("click",()=>showModule(button.dataset.panel)));
document.querySelector("#back-home").addEventListener("click",showHome);
document.querySelector("#brand-home").addEventListener("click",event=>{event.preventDefault();showHome();});
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
