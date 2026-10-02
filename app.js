/* =====================================================
   DRA. CAROLINA P. CURY — APP.JS V2
   ===================================================== */

const DEFAULTS = {
  name: "Dra. Carolina P. Cury",
  oab: "OAB/SP 372.810",
  whatsapp: "5518997477703",
  whatsappDisplay: "(18) 99747-7703",
  email: "oliveiracury@gmail.com",
  address: "Rua Floriano Peixoto, 777 (Fundos) — Assis — SP",

  title:
    "Orientação jurídica com seriedade, ética e compromisso.",

  whatsappMessage:
    "Olá, Dra. Carolina! Gostaria de obter informações sobre atendimento jurídico.",

  heroImage:
    "assets/carolina-hero.png",

  logoImage:
    ""
};


/* =====================================================
   CARREGAR CONFIGURAÇÃO
   ===================================================== */

let settings = loadSettings();


function loadSettings(){

  try{

    const saved = localStorage.getItem(
      "carolina_cury_site_settings"
    );

    if(saved){

      return {
        ...DEFAULTS,
        ...JSON.parse(saved)
      };

    }

  }catch(error){

    console.warn(
      "Não foi possível carregar as configurações salvas.",
      error
    );

  }

  return {
    ...DEFAULTS
  };

}


/* =====================================================
   SALVAR CONFIGURAÇÃO
   ===================================================== */

function saveSettings(){

  try{

    localStorage.setItem(
      "carolina_cury_site_settings",
      JSON.stringify(settings)
    );

    return true;

  }catch(error){

    console.error(
      "Não foi possível salvar as configurações.",
      error
    );

    return false;

  }

}


/* =====================================================
   NORMALIZAR WHATSAPP
   ===================================================== */

function normalizeWhatsapp(value){

  return String(value || "")
    .replace(/\D/g,"");

}


/* =====================================================
   URL DO WHATSAPP
   ===================================================== */

function getWhatsappUrl(message){

  const number =
    normalizeWhatsapp(settings.whatsapp);

  const text =
    encodeURIComponent(
      message || settings.whatsappMessage
    );

  return `https://wa.me/${number}?text=${text}`;

}


/* =====================================================
   GOOGLE MAPS
   ===================================================== */

function getMapsUrl(){

  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(settings.address)
  );

}


/* =====================================================
   E-MAIL
   ===================================================== */

function getEmailUrl(){

  const subject =
    encodeURIComponent(
      "Contato pelo site"
    );

  return `mailto:${settings.email}?subject=${subject}`;

}


/* =====================================================
   APLICAR DADOS NO SITE
   ===================================================== */

function applySettings(){

  /* Nome */

  const brandName =
    document.getElementById("brandName");

  const lawyerName =
    document.getElementById("lawyerName");

  const footerName =
    document.querySelector(".footer-brand strong");

  if(brandName){

    brandName.textContent =
      settings.name.replace(/^Dra\.\s*/,"");

  }

  if(lawyerName){

    lawyerName.textContent =
      settings.name;

  }

  if(footerName){

    footerName.textContent =
      settings.name;

  }


  /* OAB */

  const lawyerOab =
    document.getElementById("lawyerOab");

  const footerOab =
    document.querySelector(".footer-brand small");

  if(lawyerOab){

    lawyerOab.textContent =
      settings.oab;

  }

  if(footerOab){

    footerOab.textContent =
      settings.oab;

  }


  /* Título principal */

  const heroTitle =
    document.getElementById("heroTitle");

  if(heroTitle){

    setHeroTitle(
      heroTitle,
      settings.title
    );

  }


  /* Imagem principal */

  const heroImage =
    document.getElementById("heroImage");

  if(heroImage){

    heroImage.src =
      settings.heroImage;

  }


  /* WhatsApp */

  document
    .querySelectorAll("[data-whatsapp]")
    .forEach((element) => {

      element.href =
        getWhatsappUrl();

      element.target =
        "_blank";

      element.rel =
        "noopener noreferrer";

    });


  /* E-mail */

  document
    .querySelectorAll("[data-email]")
    .forEach((element) => {

      element.href =
        getEmailUrl();

    });


  /* Google Maps */

  document
    .querySelectorAll("[data-maps]")
    .forEach((element) => {

      element.href =
        getMapsUrl();

      element.target =
        "_blank";

      element.rel =
        "noopener noreferrer";

    });


  /* Telefone no contato */

  const contactWhatsapp =
    document.querySelector(
      '[data-whatsapp] .contact-item'
    );


  const whatsappSmall =
    document.querySelector(
      '.contact-item[data-whatsapp] small'
    );

  if(whatsappSmall){

    whatsappSmall.textContent =
      settings.whatsappDisplay ||
      formatWhatsapp(settings.whatsapp);

  }


  /* E-mail */

  const emailSmall =
    document.querySelector(
      '.contact-item[data-email] small'
    );

  if(emailSmall){

    emailSmall.textContent =
      settings.email;

  }


  /* Endereço */

  const addressSmall =
    document.querySelector(
      '.contact-item[data-maps] small'
    );

  if(addressSmall){

    addressSmall.textContent =
      settings.address;

  }


  /* Endereço da caixa do mapa */

  const mapAddress =
    document.querySelector(
      ".map-card p"
    );

  if(mapAddress){

    mapAddress.textContent =
      settings.address;

  }


  /* Logo */

  applyLogo();


  /* Campos do painel */

  updateAdminFields();

}


/* =====================================================
   TÍTULO PRINCIPAL
   ===================================================== */

function setHeroTitle(element,text){

  const phrase =
    String(text || "").trim();

  if(!phrase){

    element.textContent = "";

    return;

  }


  /*
     Destaca automaticamente a parte final
     do título.

     Exemplo:

     Orientação jurídica com
     seriedade, ética e compromisso.
  */

  const words =
    phrase.split(" ");

  if(words.length < 4){

    element.textContent =
      phrase;

    return;

  }


  const split =
    Math.max(
      2,
      Math.floor(words.length * 0.55)
    );

  const first =
    words.slice(0,split).join(" ");

  const second =
    words.slice(split).join(" ");


  element.innerHTML =
    `${escapeHtml(first)} <em>${escapeHtml(second)}</em>`;

}


/* =====================================================
   PROTEÇÃO BÁSICA DE TEXTO
   ===================================================== */

function escapeHtml(value){

  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


/* =====================================================
   FORMATAR WHATSAPP
   ===================================================== */

function formatWhatsapp(value){

  const digits =
    normalizeWhatsapp(value);

  /*
     Formatação brasileira simples.
  */

  if(digits.length === 13){

    return `(${digits.slice(2,4)}) ${digits.slice(4,9)}-${digits.slice(9)}`;

  }

  if(digits.length === 12){

    return `(${digits.slice(2,4)}) ${digits.slice(4,8)}-${digits.slice(8)}`;

  }

  return value;

}


/* =====================================================
   LOGO
   ===================================================== */

function applyLogo(){

  const mark =
    document.getElementById("brandMark");

  if(!mark){

    return;

  }


  if(settings.logoImage){

    mark.innerHTML =
      `<img src="${escapeAttribute(settings.logoImage)}" alt="Logo">`;

    mark.classList.add(
      "has-logo"
    );

  }else{

    mark.textContent =
      "C";

    mark.classList.remove(
      "has-logo"
    );

  }

}


/* =====================================================
   ESCAPE PARA ATRIBUTO
   ===================================================== */

function escapeAttribute(value){

  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/"/g,"&quot;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");

}


/* =====================================================
   FORMULÁRIO DE CONTATO
   ===================================================== */

function setupContactForm(){

  const form =
    document.getElementById(
      "contactForm"
    );

  if(!form){

    return;

  }


  form.addEventListener(
    "submit",
    function(event){

      event.preventDefault();


      const data =
        new FormData(form);


      const nome =
        String(
          data.get("nome") || ""
        ).trim();


      const contato =
        String(
          data.get("contato") || ""
        ).trim();


      const mensagem =
        String(
          data.get("mensagem") || ""
        ).trim();


      const finalMessage =
`Olá, Dra. Carolina!

Nome: ${nome}
Contato: ${contato}

Mensagem:
${mensagem}`;


      window.open(
        getWhatsappUrl(finalMessage),
        "_blank",
        "noopener,noreferrer"
      );

    }
  );

}


/* =====================================================
   VOLTAR AO TOPO
   ===================================================== */

function setupBackTop(){

  const button =
    document.getElementById(
      "backTop"
    );

  if(!button){

    return;

  }


  button.addEventListener(
    "click",
    function(){

      window.scrollTo({
        top:0,
        behavior:"smooth"
      });

    }
  );


  function updateBackTop(){

    if(window.scrollY > 500){

      button.classList.add(
        "visible"
      );

    }else{

      button.classList.remove(
        "visible"
      );

    }

  }


  window.addEventListener(
    "scroll",
    updateBackTop,
    {passive:true}
  );


  updateBackTop();

}


/* =====================================================
   SISTEMA DE 5 TOQUES NA LOGO
   ===================================================== */

function setupAdminTrigger(){

  const trigger =
    document.getElementById(
      "adminTrigger"
    );

  if(!trigger){

    return;

  }


  let tapCount = 0;
  let tapTimer = null;


  trigger.addEventListener(
    "click",
    function(event){

      event.preventDefault();

      tapCount++;


      clearTimeout(
        tapTimer
      );


      tapTimer =
        setTimeout(
          function(){

            tapCount = 0;

          },
          1800
        );


      if(tapCount >= 5){

        tapCount = 0;

        openAdmin();

      }

    }
  );

}


/* =====================================================
   ABRIR ADMIN
   ===================================================== */

function openAdmin(){

  const overlay =
    document.getElementById(
      "adminOverlay"
    );

  if(!overlay){

    return;

  }


  updateAdminFields();

  overlay.classList.add(
    "active"
  );

  overlay.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "admin-open"
  );

}


/* =====================================================
   FECHAR ADMIN
   ===================================================== */

function closeAdmin(){

  const overlay =
    document.getElementById(
      "adminOverlay"
    );

  if(!overlay){

    return;

  }


  overlay.classList.remove(
    "active"
  );

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "admin-open"
  );

}


/* =====================================================
   CONTROLES DO ADMIN
   ===================================================== */

function setupAdmin(){

  const close =
    document.getElementById(
      "adminClose"
    );

  const save =
    document.getElementById(
      "saveAdmin"
    );

  const reset =
    document.getElementById(
      "resetAdmin"
    );

  const overlay =
    document.getElementById(
      "adminOverlay"
    );


  if(close){

    close.addEventListener(
      "click",
      closeAdmin
    );

  }


  if(overlay){

    overlay.addEventListener(
      "click",
      function(event){

        if(event.target === overlay){

          closeAdmin();

        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key === "Escape" &&
        overlay &&
        overlay.classList.contains("active")
      ){

        closeAdmin();

      }

    }
  );


  if(save){

    save.addEventListener(
      "click",
      saveAdminSettings
    );

  }


  if(reset){

    reset.addEventListener(
      "click",
      resetAdminSettings
    );

  }


  setupImageControls();

}


/* =====================================================
   ATUALIZAR CAMPOS DO ADMIN
   ===================================================== */

function updateAdminFields(){

  const fields = {

    adminName:
      settings.name,

    adminOab:
      settings.oab,

    adminWhatsapp:
      settings.whatsappDisplay ||
      formatWhatsapp(settings.whatsapp),

    adminEmail:
      settings.email,

    adminAddress:
      settings.address,

    adminTitleText:
      settings.title,

    adminWhatsappMessage:
      settings.whatsappMessage,

    adminImageUrl:
      isExternalImage(settings.heroImage)
        ? settings.heroImage
        : "",

    adminLogoUrl:
      isExternalImage(settings.logoImage)
        ? settings.logoImage
        : ""

  };


  Object.keys(fields)
    .forEach(function(id){

      const element =
        document.getElementById(id);

      if(element){

        element.value =
          fields[id] || "";

      }

    });


  const preview =
    document.getElementById(
      "adminImagePreview"
    );

  if(preview){

    preview.src =
      settings.heroImage;

  }

}


/* =====================================================
   SALVAR ADMIN
   ===================================================== */

function saveAdminSettings(){

  const name =
    getInputValue("adminName");

  const oab =
    getInputValue("adminOab");

  const whatsapp =
    getInputValue("adminWhatsapp");

  const email =
    getInputValue("adminEmail");

  const address =
    getInputValue("adminAddress");

  const title =
    getInputValue("adminTitleText");

  const whatsappMessage =
    getInputValue(
      "adminWhatsappMessage"
    );


  if(name){

    settings.name =
      name;

  }

  if(oab){

    settings.oab =
      oab;

  }

  if(whatsapp){

    settings.whatsappDisplay =
      whatsapp;

    settings.whatsapp =
      normalizeWhatsapp(whatsapp);

  }

  if(email){

    settings.email =
      email;

  }

  if(address){

    settings.address =
      address;

  }

  if(title){

    settings.title =
      title;

  }

  if(whatsappMessage){

    settings.whatsappMessage =
      whatsappMessage;

  }


  const imageUrl =
    getInputValue(
      "adminImageUrl"
    );


  if(imageUrl){

    settings.heroImage =
      imageUrl;

  }


  const logoUrl =
    getInputValue(
      "adminLogoUrl"
    );


  if(logoUrl){

    settings.logoImage =
      logoUrl;

  }


  const saved =
    saveSettings();


  applySettings();


  showAdminStatus(
    saved
      ? "Alterações salvas neste navegador."
      : "Não foi possível salvar as alterações."
  );

}


/* =====================================================
   PEGAR VALOR DO INPUT
   ===================================================== */

function getInputValue(id){

  const element =
    document.getElementById(id);

  if(!element){

    return "";

  }

  return String(
    element.value || ""
  ).trim();

}


/* =====================================================
   RESTAURAR PADRÃO
   ===================================================== */

function resetAdminSettings(){

  const confirmed =
    window.confirm(
      "Restaurar todas as configurações padrão?"
    );


  if(!confirmed){

    return;

  }


  settings = {
    ...DEFAULTS
  };


  saveSettings();

  applySettings();

  showAdminStatus(
    "Configurações padrão restauradas."
  );

}


/* =====================================================
   STATUS DO ADMIN
   ===================================================== */

function showAdminStatus(message){

  const status =
    document.getElementById(
      "adminStatus"
    );

  if(!status){

    return;

  }


  status.textContent =
    message;


  clearTimeout(
    status._timer
  );


  status._timer =
    setTimeout(
      function(){

        status.textContent =
          "";

      },
      4000
    );

}


/* =====================================================
   CONTROLE DE IMAGENS
   ===================================================== */

function setupImageControls(){

  const imageUrl =
    document.getElementById(
      "adminImageUrl"
    );

  const imageUpload =
    document.getElementById(
      "adminImageUpload"
    );

  const imagePreview =
    document.getElementById(
      "adminImagePreview"
    );


  if(imageUrl && imagePreview){

    imageUrl.addEventListener(
      "input",
      function(){

        const value =
          imageUrl.value.trim();

        if(
          value &&
          isExternalImage(value)
        ){

          imagePreview.src =
            value;

        }

      }
    );

  }


  if(imageUpload){

    imageUpload.addEventListener(
      "change",
      function(event){

        const file =
          event.target.files &&
          event.target.files[0];

        if(!file){

          return;

        }


        if(!file.type.startsWith("image/")){

          showAdminStatus(
            "Selecione um arquivo de imagem."
          );

          return;

        }


        const reader =
          new FileReader();


        reader.onload =
          function(){

            const result =
              reader.result;

            if(imagePreview){

              imagePreview.src =
                result;

            }


            /*
               A imagem fica salva no localStorage
               apenas se o usuário clicar em salvar.
            */

            settings._pendingHeroImage =
              result;

          };


        reader.readAsDataURL(file);

      }
    );

  }


  /* =================================================
     LOGO
     ================================================= */

  const logoUrl =
    document.getElementById(
      "adminLogoUrl"
    );

  const logoUpload =
    document.getElementById(
      "adminLogoUpload"
    );


  if(logoUrl){

    logoUrl.addEventListener(
      "input",
      function(){

        const value =
          logoUrl.value.trim();

        if(value){

          settings._pendingLogoImage =
            value;

        }

      }
    );

  }


  if(logoUpload){

    logoUpload.addEventListener(
      "change",
      function(event){

        const file =
          event.target.files &&
          event.target.files[0];

        if(!file){

          return;

        }


        if(
          !file.type.startsWith("image/")
        ){

          showAdminStatus(
            "Selecione um arquivo de imagem para a logo."
          );

          return;

        }


        const reader =
          new FileReader();


        reader.onload =
          function(){

            settings._pendingLogoImage =
              reader.result;

          };


        reader.readAsDataURL(file);

      }
    );

  }

}


/* =====================================================
   PROCESSAR IMAGENS PENDENTES
   ===================================================== */

function processPendingImages(){

  if(settings._pendingHeroImage){

    settings.heroImage =
      settings._pendingHeroImage;

    delete settings._pendingHeroImage;

  }


  if(settings._pendingLogoImage){

    settings.logoImage =
      settings._pendingLogoImage;

    delete settings._pendingLogoImage;

  }

}


/* =====================================================
   VERIFICAR URL DE IMAGEM
   ===================================================== */

function isExternalImage(value){

  if(!value){

    return false;

  }

  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );

}


/* =====================================================
   ATUALIZAR SALVAMENTO
   ===================================================== */

const originalSaveAdminSettings =
  saveAdminSettings;


/*
   Substituímos a função de salvar para garantir
   que uploads pendentes sejam processados antes
   do armazenamento.
*/

saveAdminSettings = function(){

  processPendingImages();

  originalSaveAdminSettings();

};


/* =====================================================
   ANO AUTOMÁTICO
   ===================================================== */

function updateYear(){

  const year =
    document.getElementById(
      "year"
    );

  if(year){

    year.textContent =
      new Date().getFullYear();

  }

}


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    applySettings();

    setupContactForm();

    setupBackTop();

    setupAdminTrigger();

    setupAdmin();

    updateYear();

  }
);
