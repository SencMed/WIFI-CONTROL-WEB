const content = {
  connection: {title:"Conexión", eyebrow:"CONFIGURAR ACCESO AL ROUTER", interactive:true},
  devices: {title:"Dispositivos", eyebrow:"EQUIPOS DE LA RED", tiles:[["Equipos detectados","No disponible"],["Nombre del dispositivo","No disponible"],["Dirección IP","No disponible"],["Dirección MAC","No disponible"]], note:"La edición web aún no puede explorar libremente la red local. Para detectar equipos reales necesitaremos una integración local compatible."},
  wifi: {title:"Wi-Fi", eyebrow:"RED INALÁMBRICA", tiles:[["Banda 2.4 GHz","No consultada"],["Banda 5 GHz","No consultada"],["Nombre de red (SSID)","No consultado"],["Seguridad","No consultada"]], note:"Todavía no se han leído ni modificado ajustes del router."},
  speed: {title:"Velocidad", eyebrow:"DIAGNÓSTICO", tiles:[["Descarga","Sin medición"],["Subida","Sin medición"],["Latencia","Sin medición"],["Estado","Pendiente"]], note:"La prueba de velocidad real se incorporará en una siguiente etapa."},
  security: {title:"Seguridad", eyebrow:"PROTECCIÓN", tiles:[["Cifrado Wi-Fi","No consultado"],["WPS","No consultado"],["Firewall","No consultado"],["Revisión","Pendiente"]], note:"No cambiaremos contraseñas ni opciones de seguridad sin una integración validada."},
  maintenance: {title:"Mantenimiento", eyebrow:"SISTEMA", tiles:[["Versión web","0.2.0"],["Proyecto","WIFI CONTROL WEB"],["Conexión con router","En configuración"],["Estado","Prototipo funcional inicial"]], note:"Esta edición web es independiente de WIFI CONTROL Flutter."}
};
const homeView=document.querySelector("#home-view");
const moduleView=document.querySelector("#module-view");
const moduleContent=document.querySelector("#module-content");
function showHome(){
  moduleView.hidden=true;homeView.hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}
function connectionMarkup(){
  const saved=localStorage.getItem("wifiControlRouterIp")||"192.168.1.1";
  return `<div class="router-form">
    <label for="router-ip">Dirección IP del router</label>
    <input id="router-ip" inputmode="decimal" autocomplete="off" placeholder="Ej. 192.168.1.1" value="${saved}">
    <label for="router-brand">Fabricante</label>
    <select id="router-brand"><option value="Huawei">Huawei</option><option value="KAON">KAON</option><option value="Otro">Otro fabricante</option></select>
    <label for="router-model">Modelo (opcional)</label>
    <input id="router-model" placeholder="Ej. HG8245W5-6T o CG3000">
    <button class="action-button" id="open-router" type="button">Abrir panel del router ↗</button>
    <p class="form-status" id="router-status" role="status">Dirección inicial sugerida: 192.168.1.1. Confirmá que tu iPhone esté conectado al Wi-Fi de ese router.</p>
  </div>
  <div class="notice"><b>Importante:</b> este botón abre la dirección del router en otra pestaña. La página web no puede confirmar por sí sola si el router respondió ni leer sus datos debido a las restricciones de seguridad del navegador. No se modifica ninguna configuración.</div>`;
}
function showModule(key){
  const item=content[key];if(!item)return;
  let body=item.interactive?connectionMarkup():`<div class="data-grid">${item.tiles.map(([label,value])=>`<article class="data-tile"><span>${label}</span><strong>${value}</strong></article>`).join("")}</div><div class="notice"><b>Información:</b> ${item.note}</div>`;
  moduleContent.innerHTML=`<div class="module-page-heading"><p class="eyebrow">${item.eyebrow}</p><h1>${item.title}</h1><span class="tag">v0.2.0</span></div>${body}`;
  homeView.hidden=true;moduleView.hidden=false;
  if(item.interactive){
    const ipInput=document.querySelector("#router-ip");
    const status=document.querySelector("#router-status");
    document.querySelector("#open-router").addEventListener("click",()=>{
      const ip=ipInput.value.trim();
      const valid=/^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/.test(ip);
      if(!valid){status.textContent="Escribí una dirección IPv4 válida, por ejemplo 192.168.1.1.";return;}
      localStorage.setItem("wifiControlRouterIp",ip);
      status.textContent="Abriendo "+ip+". Si no carga, revisá que estés conectado al Wi-Fi del router y probá http://"+ip;
      window.open("http://"+ip+"/","_blank","noopener");
    });
  }
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".module").forEach(button=>button.addEventListener("click",()=>showModule(button.dataset.panel)));
document.querySelector("#back-home").addEventListener("click",showHome);
document.querySelector("#brand-home").addEventListener("click",event=>{event.preventDefault();showHome();});
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}