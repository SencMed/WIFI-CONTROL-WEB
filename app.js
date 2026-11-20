const content = {
  connection: {title:"Conexión", eyebrow:"ESTADO ACTUAL", tiles:[["Tipo de acceso","Web / navegador"],["Router","Por identificar"],["Dirección IP","No disponible"],["Puerta de enlace","No disponible"]], note:"Esta versión sirve para probar el diseño y la navegación. La conexión real con routers se implementará por marca y modelo."},
  devices: {title:"Dispositivos", eyebrow:"EQUIPOS DE LA RED", tiles:[["Equipos detectados","No disponible"],["Nombre del dispositivo","No disponible"],["Dirección IP","No disponible"],["Dirección MAC","No disponible"]], note:"El navegador no puede explorar libremente la red local. La detección real requiere una aplicación nativa o un servicio local compatible."},
  wifi: {title:"Wi-Fi", eyebrow:"RED INALÁMBRICA", tiles:[["Banda 2.4 GHz","No consultada"],["Banda 5 GHz","No consultada"],["Nombre de red (SSID)","No consultado"],["Seguridad","No consultada"]], note:"No se han leído ni modificado ajustes del router. La integración se realizará cuando exista un método seguro y validado."},
  speed: {title:"Velocidad", eyebrow:"DIAGNÓSTICO", tiles:[["Descarga","Sin medición"],["Subida","Sin medición"],["Latencia","Sin medición"],["Estado","Pendiente"]], note:"Todavía no se ejecuta una prueba de velocidad. Los resultados reales se incorporarán en una etapa posterior."},
  security: {title:"Seguridad", eyebrow:"PROTECCIÓN", tiles:[["Cifrado Wi-Fi","No consultado"],["WPS","No consultado"],["Firewall","No consultado"],["Revisión","Pendiente"]], note:"No se recomienda cambiar contraseñas ni opciones de seguridad desde esta maqueta. Primero validaremos la compatibilidad del router."},
  maintenance: {title:"Mantenimiento", eyebrow:"SISTEMA", tiles:[["Versión web","0.1.0"],["Proyecto","WIFI CONTROL WEB"],["Conexión con router","No configurada"],["Estado","Prototipo visual"]], note:"Esta versión web es independiente de WIFI CONTROL Flutter. Sus cambios no afectan el proyecto original."}
};
const homeView=document.querySelector("#home-view");
const moduleView=document.querySelector("#module-view");
const moduleContent=document.querySelector("#module-content");
function showHome(){
  moduleView.hidden=true;
  homeView.hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}
function showModule(key){
  const item=content[key];
  if(!item)return;
  moduleContent.innerHTML=`<div class="module-page-heading"><p class="eyebrow">${item.eyebrow}</p><h1>${item.title}</h1><span class="tag">DEMO</span></div><div class="data-grid">${item.tiles.map(([label,value])=>`<article class="data-tile"><span>${label}</span><strong>${value}</strong></article>`).join("")}</div><div class="notice"><b>Información:</b> ${item.note}</div>`;
  homeView.hidden=true;
  moduleView.hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".module").forEach(button=>button.addEventListener("click",()=>showModule(button.dataset.panel)));
document.querySelector("#back-home").addEventListener("click",showHome);
document.querySelector("#brand-home").addEventListener("click",event=>{event.preventDefault();showHome();});
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}