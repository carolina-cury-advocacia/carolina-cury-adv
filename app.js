const DEFAULTS={name:"Carolina P. Cury",oab:"OAB/SP 372.810",phone:"(18) 99747-7703",email:"oliveiracury@gmail.com",address:"Rua Floriano Peixoto, 777 (Fundos) — Assis/SP",title:"Orientação jurídica com seriedade, ética e compromisso.",message:"Olá, Dra. Carolina! Gostaria de obter informações sobre atendimento jurídico.",image:"assets/carolina-hero.png",logo:""};
const KEY="carolinaCurySiteV2";
let data={...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||"{}")} ;
const $=s=>document.querySelector(s); const $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function phoneDigits(){return data.phone.replace(/\D/g,"");}
function apply(){
  $("#brandName").textContent=data.name; $("#footerName").textContent=data.name; $("#captionName").textContent=`Dra. ${data.name}`; $("#captionOab").textContent=data.oab;
  $("#heroSub").innerHTML=`Dra. ${data.name} · <strong>${data.oab}</strong>`;
  $("#heroTitle").innerHTML=data.title.replace(/seriedade, ética e compromisso\.?/i,"<em>seriedade, ética e compromisso.</em>");
  $("#phoneText").textContent=data.phone; $("#emailText").textContent=data.email; $("#addressText").textContent=data.address; $("#addressText2").textContent=data.address.replace(" — Assis/SP","");
  $("#heroImage").src=data.image;
  if(data.logo){$("#brandLogo").innerHTML=`<img src="${data.logo}" alt="Logo">`;}
  const wa=`https://wa.me/${phoneDigits()}?text=${encodeURIComponent(data.message)}`;
  const maps=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.address)}`;
  const mail=`mailto:${data.email}?subject=${encodeURIComponent("Contato pelo site")}`;
  $$('[data-whatsapp]').forEach(a=>{a.href=wa;a.target="_blank";a.rel="noopener"});
  $$('[data-maps]').forEach(a=>{a.href=maps;a.target="_blank";a.rel="noopener"});
  $$('[data-email]').forEach(a=>{a.href=mail});
  $("#year").textContent=new Date().getFullYear();
}
apply();
$("#backTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});
let taps=0,timer; $("#brandTrigger").addEventListener("click",e=>{taps++;clearTimeout(timer);timer=setTimeout(()=>taps=0,1500);if(taps>=5){e.preventDefault();taps=0;openAdmin();}});
function openAdmin(){
  $("#adminOverlay").hidden=false; $("#aName").value=data.name;$("#aOab").value=data.oab;$("#aPhone").value=data.phone;$("#aEmail").value=data.email;$("#aAddress").value=data.address;$("#aTitle").value=data.title;$("#aMessage").value=data.message;
}
$("#adminClose").onclick=()=>$("#adminOverlay").hidden=true;
$("#adminOverlay").addEventListener("click",e=>{if(e.target.id==="adminOverlay")e.currentTarget.hidden=true});
$("#adminForm").addEventListener("submit",async e=>{e.preventDefault();data.name=$("#aName").value.trim();data.oab=$("#aOab").value.trim();data.phone=$("#aPhone").value.trim();data.email=$("#aEmail").value.trim();data.address=$("#aAddress").value.trim();data.title=$("#aTitle").value.trim();data.message=$("#aMessage").value.trim();const img=$("#aImage").files[0];const logo=$("#aLogo").files[0];if(img)data.image=await toData(img);if(logo)data.logo=await toData(logo);save();apply();$("#adminOverlay").hidden=true;alert("Alterações salvas neste navegador.");});
$("#adminReset").onclick=()=>{if(confirm("Restaurar os dados padrão?")){data={...DEFAULTS};save();location.reload();}};
function toData(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);});}
