/* =====================================================
   DRA. CAROLINA P. CURY — APP.JS V4
   Firebase + Firestore + Admin
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
    "https://i.postimg.cc/wB5DmxdM/Gemini-Generated-Image-d721dhd721dhd721.jpg",

  logoImage:
    "https://i.postimg.cc/x8sctnws/IMG-20261002-WA0023.jpg"
};


/* =====================================================
   FIREBASE
   ===================================================== */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBvqNqGjG8IWSFhQRpNSIgLF0V540Xr-sg",
  authDomain: "carolinacuryadv-f347d.firebaseapp.com",
  projectId: "carolinacuryadv-f347d",
  storageBucket: "carolinacuryadv-f347d.firebasestorage.app",
  messagingSenderId: "61389745677",
  appId: "1:61389745677:web:c64f35db063d52dc6daf44"
};

let firebaseDb = null;
let firebaseAuth = null;
let firebaseConnected = false;


/* =====================================================
   CONFIGURAÇÃO INICIAL
   ===================================================== */

let settings = loadSettings();

let practiceAreas = [];

let mediaItems = [];


/* =====================================================
   LOCAL STORAGE
   ===================================================== */

function loadSettings() {

  try {

    const saved =
      localStorage.getItem(
        "carolina_cury_site_settings"
      );

    if (saved) {

      return {
        ...DEFAULTS,
        ...JSON.parse(saved)
      };

    }

  } catch (error) {

    console.warn(
      "Erro ao carregar configurações locais.",
      error
    );

  }

  return {
    ...DEFAULTS
  };
}


function saveSettings() {

  try {

    localStorage.setItem(
      "carolina_cury_site_settings",
      JSON.stringify(settings)
    );

    return true;

  } catch (error) {

    console.error(
      "Erro ao salvar configurações locais.",
      error
    );

    return false;
  }
}


/* =====================================================
   FIREBASE SDK
   ===================================================== */

function loadFirebaseScript(src) {

  return new Promise(function(resolve, reject) {

    if (
      document.querySelector(
        'script[src="' + src + '"]'
      )
    ) {

      resolve();

      return;
    }

    const script =
      document.createElement("script");

    script.src = src;

    script.onload = resolve;

    script.onerror = reject;

    document.head.appendChild(script);

  });
}


/* =====================================================
   INICIALIZAR FIREBASE
   ===================================================== */

async function initializeCarolinaFirebase() {

  try {

    await loadFirebaseScript(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
    );

    await loadFirebaseScript(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth-compat.js"
    );

    await loadFirebaseScript(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-compat.js"
    );


    if (!firebase.apps.length) {

      firebase.initializeApp(
        FIREBASE_CONFIG
      );

    }


    firebaseAuth =
      firebase.auth();

    firebaseDb =
      firebase.firestore();

    firebaseConnected = true;


    console.log(
      "Firebase conectado com sucesso."
    );


    await loadSettingsFromFirebase();

    await loadPracticeAreasFromFirebase();

    await loadMediaFromFirebase();


    return true;


  } catch (error) {

    console.error(
      "Erro ao inicializar Firebase:",
      error
    );

    firebaseConnected = false;

    return false;
  }
}


/* =====================================================
   CARREGAR SITE_SETTINGS
   ===================================================== */

async function loadSettingsFromFirebase() {

  if (!firebaseDb) return;

  try {

    const snapshot =
      await firebaseDb
        .collection("site_settings")
        .limit(1)
        .get();


    if (!snapshot.empty) {

      const data =
        snapshot.docs[0].data();

      settings = {
        ...DEFAULTS,
        ...data
      };

      applySettings();


      console.log(
        "site_settings carregado."
      );

    } else {

      console.log(
        "Nenhum documento encontrado em site_settings."
      );

    }

  } catch (error) {

    console.error(
      "Erro ao carregar site_settings:",
      error
    );
  }
}


/* =====================================================
   CARREGAR ÁREAS JURÍDICAS
   ===================================================== */

async function loadPracticeAreasFromFirebase() {

  if (!firebaseDb) return;

  try {

    const snapshot =
      await firebaseDb
        .collection("practice_areas")
        .where("active", "==", true)
        .get();


    practiceAreas =
      snapshot.docs
        .map(function(doc) {

          return {
            documentId: doc.id,
            ...doc.data()
          };

        })
        .sort(function(a, b) {

          return (
            Number(a.sort_order || 0) -
            Number(b.sort_order || 0)
          );

        });


    console.log(
      "Áreas jurídicas carregadas:",
      practiceAreas
    );


    renderPracticeAreas();

  } catch (error) {

    console.error(
      "Erro ao carregar practice_areas:",
      error
    );
  }
}


/* =====================================================
   CARREGAR MÍDIA
   ===================================================== */

async function loadMediaFromFirebase() {

  if (!firebaseDb) return;

  try {

    const snapshot =
      await firebaseDb
        .collection("media")
        .where("active", "==", true)
        .get();


    mediaItems =
      snapshot.docs.map(function(doc) {

        return {
          documentId: doc.id,
          ...doc.data()
        };

      });


    console.log(
      "Mídias carregadas:",
      mediaItems
    );


    const banner =
      mediaItems.find(function(item) {

        return (
          item.type === "banner" ||
          item.id === "hero"
        );

      });


    const logo =
      mediaItems.find(function(item) {

        return (
          item.type === "logo" ||
          item.id === "logo"
        );

      });


    if (banner && banner.url) {

      settings.heroImage =
        banner.url;

    }


    if (logo && logo.url) {

      settings.logoImage =
        logo.url;

    }


    applySettings();

  } catch (error) {

    console.error(
      "Erro ao carregar media:",
      error
    );
  }
}


/* =====================================================
   RENDERIZAR ÁREAS
   ===================================================== */

function renderPracticeAreas() {

  /*
     Esta função procura automaticamente
     um container de áreas jurídicas caso
     o HTML tenha sido preparado para isso.

     Se o elemento não existir, simplesmente
     não altera a página.
  */

  const containers = [
    document.getElementById("practiceAreas"),
    document.getElementById("areasGrid"),
    document.querySelector("[data-practice-areas]")
  ];

  const container =
    containers.find(Boolean);


  if (!container) {

    return;

  }


  container.innerHTML = "";


  practiceAreas.forEach(function(area) {

    const article =
      document.createElement("article");

    article.className =
      "practice-card";


    article.innerHTML = `
      <div class="practice-icon" aria-hidden="true">
        ${getPracticeIcon(area.icon)}
      </div>

      <h3>${escapeHtml(area.title || "")}</h3>

      <p>${escapeHtml(area.description || "")}</p>
    `;


    container.appendChild(article);

  });
}


/* =====================================================
   ÍCONES DAS ÁREAS
   ===================================================== */

function getPracticeIcon(icon) {

  const icons = {

    scale: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3v18"/>
        <path d="M5 6h14"/>
        <path d="M5 6l-3 5h6L5 6z"/>
        <path d="M19 6l-3 5h6l-3-5z"/>
        <path d="M8 21h8"/>
      </svg>
    `,

    users: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="8" r="3"/>
        <path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
        <path d="M16 4.5a3 3 0 010 6"/>
        <path d="M18 15c2.2.7 3.7 2.7 3.7 6"/>
      </svg>
    `,

    landmark: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10h18"/>
        <path d="M5 10v9"/>
        <path d="M9 10v9"/>
        <path d="M15 10v9"/>
        <path d="M19 10v9"/>
        <path d="M3 19h18"/>
        <path d="M12 3l9 5H3l9-5z"/>
      </svg>
    `,

    shield: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l8 3v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    `,

    briefcase: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2"/>
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
        <path d="M3 12h18"/>
        <path d="M10 12v2h4v-2"/>
      </svg>
    `

  };


  return (
    icons[icon] ||
    icons.briefcase
  );
}


/* =====================================================
   WHATSAPP
   ===================================================== */

function normalizeWhatsapp(value) {

  return String(value || "")
    .replace(/\D/g, "");

}


function getWhatsappUrl(message) {

  const number =
    normalizeWhatsapp(settings.whatsapp);

  const text =
    encodeURIComponent(
      message ||
      settings.whatsappMessage
    );

  return (
    `https://wa.me/${number}?text=${text}`
  );

}


/* =====================================================
   GOOGLE MAPS
   ===================================================== */

function getMapsUrl() {

  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(settings.address)
  );

}


/* =====================================================
   E-MAIL
   ===================================================== */

function getEmailUrl() {

  const subject =
    encodeURIComponent(
      "Contato pelo site"
    );

  return (
    `mailto:${settings.email}?subject=${subject}`
  );

}


/* =====================================================
   FORMATAR WHATSAPP
   ===================================================== */

function formatWhatsapp(value) {

  const digits =
    normalizeWhatsapp(value);


  if (digits.length === 13) {

    return (
      `(${digits.slice(2, 4)}) ` +
      `${digits.slice(4, 9)}-` +
      `${digits.slice(9)}`
    );

  }


  if (digits.length === 12) {

    return (
      `(${digits.slice(2, 4)}) ` +
      `${digits.slice(4, 8)}-` +
      `${digits.slice(8)}`
    );

  }


  return value;
}


/* =====================================================
   APLICAR CONFIGURAÇÕES
   ===================================================== */

function applySettings() {

  const brandName =
    document.getElementById("brandName");

  const lawyerName =
    document.getElementById("lawyerName");

  const footerName =
    document.querySelector(
      ".footer-brand strong"
    );


  if (brandName) {

    brandName.textContent =
      settings.name.replace(
        /^Dra\.\s*/,
        ""
      );

  }


  if (lawyerName) {

    lawyerName.textContent =
      settings.name;

  }


  if (footerName) {

    footerName.textContent =
      settings.name;

  }


  const lawyerOab =
    document.getElementById("lawyerOab");

  const footerOab =
    document.querySelector(
      ".footer-brand small"
    );


  if (lawyerOab) {

    lawyerOab.textContent =
      settings.oab;

  }


  if (footerOab) {

    footerOab.textContent =
      settings.oab;

  }


  const heroTitle =
    document.getElementById("heroTitle");


  if (heroTitle) {

    setHeroTitle(
      heroTitle,
      settings.title
    );

  }


  const heroImage =
    document.getElementById("heroImage");


  if (heroImage) {

    heroImage.src =
      settings.heroImage;

  }


  document
    .querySelectorAll("[data-whatsapp]")
    .forEach(function(element) {

      element.href =
        getWhatsappUrl();

      element.target =
        "_blank";

      element.rel =
        "noopener noreferrer";

    });


  document
    .querySelectorAll("[data-email]")
    .forEach(function(element) {

      element.href =
        getEmailUrl();

    });


  document
    .querySelectorAll("[data-maps]")
    .forEach(function(element) {

      element.href =
        getMapsUrl();

      element.target =
        "_blank";

      element.rel =
        "noopener noreferrer";

    });


  const whatsappSmall =
    document.querySelector(
      '.contact-item[data-whatsapp] small'
    );


  if (whatsappSmall) {

    whatsappSmall.textContent =
      settings.whatsappDisplay ||
      formatWhatsapp(settings.whatsapp);

  }


  const emailSmall =
    document.querySelector(
      '.contact-item[data-email] small'
    );


  if (emailSmall) {

    emailSmall.textContent =
      settings.email;

  }


  const addressSmall =
    document.querySelector(
      '.contact-item[data-maps] small'
    );


  if (addressSmall) {

    addressSmall.textContent =
      settings.address;

  }


  const mapAddress =
    document.querySelector(
      ".map-card p"
    );


  if (mapAddress) {

    mapAddress.textContent =
      settings.address;

  }


  applyLogo();

  updateAdminFields();
}


/* =====================================================
   TÍTULO PRINCIPAL
   ===================================================== */

function setHeroTitle(element, text) {

  const phrase =
    String(text || "").trim();


  if (!phrase) {

    element.textContent = "";

    return;

  }


  const words =
    phrase.split(" ");


  if (words.length < 4) {

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
    words
      .slice(0, split)
      .join(" ");


  const second =
    words
      .slice(split)
      .join(" ");


  element.innerHTML =
    `${escapeHtml(first)} <em>${escapeHtml(second)}</em>`;
}


/* =====================================================
   SEGURANÇA DE TEXTO
   ===================================================== */

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}


/* =====================================================
   LOGO
   ===================================================== */

function applyLogo() {

  const mark =
    document.getElementById("brandMark");


  if (!mark) {

    return;

  }


  if (settings.logoImage) {

    mark.innerHTML =
      `<img src="${escapeAttribute(
        settings.logoImage
      )}" alt="Logo da Dra. Carolina P. Cury">`;

    mark.classList.add(
      "has-logo"
    );

  } else {

    mark.textContent =
      "C";

    mark.classList.remove(
      "has-logo"
    );

  }
}


/* =====================================================
   FORMULÁRIO
   ===================================================== */

function setupContactForm() {

  const form =
    document.getElementById(
      "contactForm"
    );


  if (!form) {

    return;

  }


  form.addEventListener(
    "submit",
    function(event) {

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

function setupBackTop() {

  const button =
    document.getElementById(
      "backTop"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function() {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  function updateBackTop() {

    if (window.scrollY > 500) {

      button.classList.add(
        "visible"
      );

    } else {

      button.classList.remove(
        "visible"
      );

    }

  }


  window.addEventListener(
    "scroll",
    updateBackTop,
    {
      passive: true
    }
  );


  updateBackTop();
}


/* =====================================================
   ADMIN — 5 TOQUES
   ===================================================== */

function setupAdminTrigger() {

  const trigger =
    document.getElementById(
      "adminTrigger"
    );


  if (!trigger) {

    return;

  }


  let tapCount = 0;

  let tapTimer = null;


  trigger.addEventListener(
    "click",
    function(event) {

      event.preventDefault();

      tapCount++;


      clearTimeout(
        tapTimer
      );


      tapTimer =
        setTimeout(
          function() {

            tapCount = 0;

          },
          1800
        );


      if (tapCount >= 5) {

        tapCount = 0;

        openAdmin();

      }

    }
  );
}


/* =====================================================
   ABRIR ADMIN
   ===================================================== */

function openAdmin() {

  const overlay =
    document.getElementById(
      "adminOverlay"
    );


  if (!overlay) {

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

function closeAdmin() {

  const overlay =
    document.getElementById(
      "adminOverlay"
    );


  if (!overlay) {

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
   CAMPOS DO ADMIN
   ===================================================== */

function getInputValue(id) {

  const element =
    document.getElementById(id);


  if (!element) {

    return "";

  }


  return String(
    element.value || ""
  ).trim();
}


function updateAdminFields() {

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
      isExternalImage(
        settings.heroImage
      )
        ? settings.heroImage
        : "",

    adminLogoUrl:
      isExternalImage(
        settings.logoImage
      )
        ? settings.logoImage
        : ""

  };


  Object.keys(fields)
    .forEach(function(id) {

      const element =
        document.getElementById(id);


      if (element) {

        element.value =
          fields[id] || "";

      }

    });


  const preview =
    document.getElementById(
      "adminImagePreview"
    );


  if (preview) {

    preview.src =
      settings.heroImage;

  }
}


/* =====================================================
   LOGIN DO ADMIN
   ===================================================== */

async function ensureAdminLogin() {

  if (!firebaseAuth) {

    return false;

  }


  if (firebaseAuth.currentUser) {

    return true;

  }


  const email =
    window.prompt(
      "E-mail do administrador:"
    );


  if (!email) {

    return false;

  }


  const password =
    window.prompt(
      "Senha do administrador:"
    );


  if (!password) {

    return false;

  }


  try {

    await firebaseAuth
      .signInWithEmailAndPassword(
        email.trim(),
        password
      );


    return true;


  } catch (error) {

    console.error(
      "Erro no login do administrador:",
      error
    );


    showAdminStatus(
      "Não foi possível entrar. Confira o e-mail e a senha."
    );


    return false;
  }
}


/* =====================================================
   SALVAR ADMIN
   ===================================================== */

async function saveAdminSettings() {

  const logged =
    await ensureAdminLogin();


  if (
    firebaseConnected &&
    !logged
  ) {

    return;

  }


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


  if (name) {

    settings.name =
      name;

  }


  if (oab) {

    settings.oab =
      oab;

  }


  if (whatsapp) {

    settings.whatsappDisplay =
      whatsapp;

    settings.whatsapp =
      normalizeWhatsapp(
        whatsapp
      );

  }


  if (email) {

    settings.email =
      email;

  }


  if (address) {

    settings.address =
      address;

  }


  if (title) {

    settings.title =
      title;

  }


  if (whatsappMessage) {

    settings.whatsappMessage =
      whatsappMessage;

  }


  const imageUrl =
    getInputValue(
      "adminImageUrl"
    );


  if (imageUrl) {

    settings.heroImage =
      imageUrl;

  }


  const logoUrl =
    getInputValue(
      "adminLogoUrl"
    );


  if (logoUrl) {

    settings.logoImage =
      logoUrl;

  }


  const localSaved =
    saveSettings();


  applySettings();


  if (
    firebaseConnected &&
    firebaseDb &&
    firebaseAuth.currentUser
  ) {

    try {

      await firebaseDb
        .collection(
          "site_settings"
        )
        .doc(
          "main"
        )
        .set(
          {
            name: settings.name,
            oab: settings.oab,
            whatsapp: settings.whatsapp,
            whatsappDisplay:
              settings.whatsappDisplay,
            email: settings.email,
            address: settings.address,
            title: settings.title,
            whatsappMessage:
              settings.whatsappMessage,
            heroImage:
              settings.heroImage,
            logoImage:
              settings.logoImage,
            updated_at:
              firebase.firestore
                .FieldValue
                .serverTimestamp()
          },
          {
            merge: true
          }
        );


      showAdminStatus(
        "Alterações salvas no Firebase."
      );


    } catch (error) {

      console.error(
        "Erro ao salvar no Firebase:",
        error
      );


      showAdminStatus(
        "Salvo localmente, mas houve erro no Firebase."
      );

    }

  } else {

    showAdminStatus(
      localSaved
        ? "Alterações salvas neste navegador."
        : "Não foi possível salvar."
    );

  }
}


/* =====================================================
   RESET ADMIN
   ===================================================== */

function resetAdminSettings() {

  const confirmed =
    window.confirm(
      "Restaurar todas as configurações padrão?"
    );


  if (!confirmed) {

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
   STATUS
   ===================================================== */

function showAdminStatus(message) {

  const status =
    document.getElementById(
      "adminStatus"
    );


  if (!status) {

    return;

  }


  status.textContent =
    message;


  clearTimeout(
    status._timer
  );


  status._timer =
    setTimeout(
      function() {

        status.textContent =
          "";

      },
      5000
    );
}


/* =====================================================
   CONTROLES DE IMAGEM
   ===================================================== */

function setupImageControls() {

  const imageUrl =
    document.getElementById(
      "adminImageUrl"
    );


  const imagePreview =
    document.getElementById(
      "adminImagePreview"
    );


  if (
    imageUrl &&
    imagePreview
  ) {

    imageUrl.addEventListener(
      "input",
      function() {

        const value =
          imageUrl.value.trim();


        if (
          value &&
          isExternalImage(value)
        ) {

          imagePreview.src =
            value;

        }

      }
    );

  }


  const logoUrl =
    document.getElementById(
      "adminLogoUrl"
    );


  if (logoUrl) {

    logoUrl.addEventListener(
      "input",
      function() {

        const value =
          logoUrl.value.trim();


        if (value) {

          settings.logoImage =
            value;

        }

      }
    );

  }
}


/* =====================================================
   VERIFICAR IMAGEM
   ===================================================== */

function isExternalImage(value) {

  if (!value) {

    return false;

  }


  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}


/* =====================================================
   ADMIN
   ===================================================== */

function setupAdmin() {

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


  if (close) {

    close.addEventListener(
      "click",
      closeAdmin
    );

  }


  if (overlay) {

    overlay.addEventListener(
      "click",
      function(event) {

        if (
          event.target === overlay
        ) {

          closeAdmin();

        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Escape" &&
        overlay &&
        overlay.classList.contains(
          "active"
        )
      ) {

        closeAdmin();

      }

    }
  );


  if (save) {

    save.addEventListener(
      "click",
      saveAdminSettings
    );

  }


  if (reset) {

    reset.addEventListener(
      "click",
      resetAdminSettings
    );

  }


  setupImageControls();
}


/* =====================================================
   ANO
   ===================================================== */

function updateYear() {

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }
}


/* =====================================================
   SERVICE WORKER
   ===================================================== */

function setupServiceWorker() {

  if (
    "serviceWorker" in navigator
  ) {

    window.addEventListener(
      "load",
      function() {

        navigator.serviceWorker
          .register("./sw.js")
          .then(function() {

            console.log(
              "Service Worker registrado."
            );

          })
          .catch(function(error) {

            console.error(
              "Erro no Service Worker:",
              error
            );

          });

      }
    );

  }
}


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    applySettings();

    setupContactForm();

    setupBackTop();

    setupAdminTrigger();

    setupAdmin();

    updateYear();

    setupServiceWorker();

    initializeCarolinaFirebase();

  }
);
