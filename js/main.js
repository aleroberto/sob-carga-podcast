(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const form = document.querySelector("#case-form");
  const message = document.querySelector("#form-message");

  if (form && message) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const caseText = String(formData.get("case") || "").trim();

      if (!name || !email || !caseText) {
        message.textContent = "Preencha os três campos para continuar.";
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        message.textContent = "Informe um e-mail válido.";
        return;
      }

      message.textContent =
        "Formulário validado. Falta apenas conectar o envio a um serviço (Formspree, Resend, Netlify Forms ou backend próprio).";
    });
  }
})();
