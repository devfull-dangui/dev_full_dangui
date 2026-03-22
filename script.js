/**
 * Script de Redirecionamento de Redes Sociais
 * Deborah Dangui - 2026
 */

const configuracaoRedes = {
  "btn-instagram": "https://www.instagram.com/devfull.dangui/",
  "btn-tiktok": "https://www.tiktok.com/@devfull.dangui",
  "btn-youtube": "https://www.youtube.com/@devfull.dangui",
  "btn-linkedin": "https://www.linkedin.com/in/devfull-dangui/"
};

function inicializarLinks() {
  Object.keys(configuracaoRedes).forEach(id => {
    const elemento = document.getElementById(id);
    
    if (elemento) {
      elemento.addEventListener("click", () => {
        const url = configuracaoRedes[id];
        window.open(url, "_blank");
      });
    }
  });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", inicializarLinks);