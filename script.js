/**
 * Deborah Dangui — Portfólio
 * script.js — 2026
 *
 * Módulos:
 *  1. Navbar scroll + menu mobile
 *  2. Animações de entrada (IntersectionObserver)
 *  3. Link ativo na navbar conforme scroll
 *  4. Botão voltar ao topo
 *  5. Formulário — reCAPTCHA v3 + Formspree + validação + LGPD
 */

"use strict";

/* ================================================
   1. NAVBAR
   ================================================ */
(function initNavbar() {
  const navbar   = document.getElementById("navbar");
  const toggle   = document.getElementById("nav-toggle");
  const menu     = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target)) {
      menu.classList.remove("aberto");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ================================================
   2. ANIMAÇÕES DE ENTRADA (Intersection Observer)
   ================================================ */
(function initAnimacoes() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visivel");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ================================================
   3. LINK ATIVO NA NAVBAR CONFORME SCROLL
   ================================================ */
(function initNavAtivo() {
  const secoes   = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("ativo"));
          const link = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`
          );
          if (link) link.classList.add("ativo");
        }
      });
    },
    { threshold: 0.45 }
  );

  secoes.forEach((s) => observer.observe(s));
})();

/* ================================================
   4. BOTÃO VOLTAR AO TOPO
   ================================================ */
(function initBtnTopo() {
  const btn = document.getElementById("btn-topo");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => { btn.classList.toggle("visivel", window.scrollY > 400); },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ================================================
   5. FORMULÁRIO — reCAPTCHA v3 + FORMSPREE + LGPD
   ================================================ */
(function initFormulario() {

  // ⚠️ Substitua pelo valor da sua chave pública do reCAPTCHA v3
  const RECAPTCHA_SITE_KEY = "6LeBsfUsAAAAAAeENJVtOYxGrZKNfW8g32RpgxDQ";

  const form         = document.getElementById("formulario-contato");
  const btnEnviar    = document.getElementById("btn-enviar");
  const btnTexto     = btnEnviar?.querySelector(".btn-texto");
  const btnLoading   = btnEnviar?.querySelector(".btn-loading");
  const divSucesso   = document.getElementById("form-sucesso");
  const divErroGeral = document.getElementById("form-erro-geral");
  const btnNova      = document.getElementById("btn-nova-msg");

  if (!form) return;

  /* --- Regras de validação --- */
  const regras = {
    nome: {
      campo: document.getElementById("nome"),
      erro:  document.getElementById("erro-nome"),
      validar(v) {
        if (!v.trim())           return "Por favor, informe seu nome.";
        if (v.trim().length < 2) return "Nome muito curto.";
        return "";
      },
    },
    email: {
      campo: document.getElementById("email"),
      erro:  document.getElementById("erro-email"),
      validar(v) {
        if (!v.trim()) return "Por favor, informe seu e-mail.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "E-mail inválido.";
        return "";
      },
    },
    assunto: {
      campo: document.getElementById("assunto"),
      erro:  document.getElementById("erro-assunto"),
      validar(v) {
        return v ? "" : "Selecione um assunto.";
      },
    },
    mensagem: {
      campo: document.getElementById("mensagem"),
      erro:  document.getElementById("erro-mensagem"),
      validar(v) {
        if (!v.trim())            return "Por favor, escreva sua mensagem.";
        if (v.trim().length < 10) return "Mensagem muito curta.";
        return "";
      },
    },
    consentimento: {
      campo: document.getElementById("consentimento"),
      erro:  document.getElementById("erro-consentimento"),
      validar(v, campo) {
        return campo.checked ? "" : "É necessário aceitar a Política de Privacidade para enviar.";
      },
    },
  };

  function mostrarErro(regra, msg) {
    regra.campo.classList.toggle("invalido", !!msg);
    regra.erro.textContent = msg;
  }

  function validarTudo() {
    let valido = true;
    Object.values(regras).forEach((regra) => {
      const msg = regra.validar(regra.campo.value, regra.campo);
      mostrarErro(regra, msg);
      if (msg) valido = false;
    });
    return valido;
  }

  // Validação em tempo real
  Object.values(regras).forEach((regra) => {
    regra.campo.addEventListener("blur", () => {
      mostrarErro(regra, regra.validar(regra.campo.value, regra.campo));
    });
    regra.campo.addEventListener("input", () => {
      if (regra.campo.classList.contains("invalido")) {
        mostrarErro(regra, regra.validar(regra.campo.value, regra.campo));
      }
    });
  });

  /* --- Máscara de telefone --- */
  const telInput = document.getElementById("telefone");
  if (telInput) {
    telInput.addEventListener("input", () => {
      let v = telInput.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      telInput.value = v;
    });
  }

  /* --- Obter token reCAPTCHA v3 (invisível) --- */
  function obterTokenRecaptcha() {
    return new Promise((resolve) => {
      if (typeof grecaptcha === "undefined") {
        // reCAPTCHA não disponível (sem internet, adblocker) — envia sem token
        resolve("");
        return;
      }
      grecaptcha.ready(() => {
        grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "contato" })
          .then(resolve)
          .catch(() => resolve(""));
      });
    });
  }

  /* --- Envio via Formspree com reCAPTCHA --- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarTudo()) {
      form.querySelector(".invalido")?.focus();
      return;
    }

    // Estado de loading
    btnEnviar.disabled       = true;
    btnTexto.style.display   = "none";
    btnLoading.style.display = "inline-flex";
    divErroGeral.style.display = "none";

    try {
      // 1. Obtém token reCAPTCHA v3 invisível
      const token = await obterTokenRecaptcha();
      document.getElementById("recaptcha-token").value = token;

      // 2. Envia para Formspree
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.style.display = "none";
        form.previousElementSibling.style.display = "none"; // lgpd-aviso
        divSucesso.style.display = "block";
        divSucesso.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error || "Erro no servidor.");
      }
    } catch (err) {
      console.error("Erro no envio:", err);
      divErroGeral.style.display = "block";
      divErroGeral.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      btnEnviar.disabled       = false;
      btnTexto.style.display   = "inline";
      btnLoading.style.display = "none";
    }
  });

  /* --- Resetar formulário para nova mensagem --- */
  if (btnNova) {
    btnNova.addEventListener("click", () => {
      form.reset();
      Object.values(regras).forEach((r) => {
        r.campo.classList.remove("invalido");
        r.erro.textContent = "";
      });
      form.style.display = "flex";
      const lgpdAviso = form.previousElementSibling;
      if (lgpdAviso) lgpdAviso.style.display = "flex";
      divSucesso.style.display   = "none";
      divErroGeral.style.display = "none";
    });
  }

  /* --- Detecta redirect ?enviado=true do Formspree --- */
  if (new URLSearchParams(location.search).get("enviado") === "true") {
    form.style.display = "none";
    const lgpdAviso = form.previousElementSibling;
    if (lgpdAviso) lgpdAviso.style.display = "none";
    divSucesso.style.display = "block";
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", location.pathname);
  }
})();
