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

  if (!form || !message) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const defaultButtonText = submitButton.textContent;

  function setMessage(text, type = "neutral") {
    message.textContent = text;
    if (type === "success") {
      message.style.color = "#d8e6d4";
    } else if (type === "error") {
      message.style.color = "#f0a589";
    } else {
      message.style.color = "";
    }
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Enviando..." : defaultButtonText;
    submitButton.style.opacity = isLoading ? "0.7" : "";
    submitButton.style.cursor = isLoading ? "wait" : "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const caseText = String(formData.get("case") || "").trim();

    if (!name || !email || !caseText) {
      setMessage("Preencha os três campos para continuar.", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("Informe um e-mail válido.", "error");
      return;
    }

    setLoading(true);
    setMessage("Enviando seu caso...");

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        form.reset();
        setMessage("Caso enviado com sucesso. Obrigado por colocar esse problema Sob Carga.", "success");
        return;
      }

      let errorMessage = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
      try {
        const data = await response.json();
        if (Array.isArray(data.errors) && data.errors.length) {
          errorMessage = data.errors.map((error) => error.message).filter(Boolean).join(" ");
        }
      } catch (_) {}

      setMessage(errorMessage, "error");
    } catch (_) {
      setMessage("Falha de conexão. Verifique sua internet e tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  });
})();
