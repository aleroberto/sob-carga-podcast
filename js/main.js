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

  document.querySelectorAll("form.ajax-form").forEach((form) => {
    const message = form.querySelector(".form-message");
    const submitButton = form.querySelector('button[type="submit"]');

    if (!message || !submitButton) return;

    const defaultButtonText = submitButton.textContent;
    const successMessage =
      form.dataset.success || "Mensagem enviada com sucesso.";

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

      if (!form.checkValidity()) {
        form.reportValidity();
        setMessage("Revise os campos obrigatórios antes de enviar.", "error");
        return;
      }

      setLoading(true);
      setMessage("Enviando...");

      try {
        const response = await fetch(form.action, {
          method: form.method || "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          form.reset();
          setMessage(successMessage, "success");
          return;
        }

        let errorMessage =
          "Não foi possível enviar agora. Tente novamente em alguns instantes.";

        try {
          const data = await response.json();

          if (Array.isArray(data.errors) && data.errors.length) {
            errorMessage = data.errors
              .map((error) => error.message)
              .filter(Boolean)
              .join(" ");
          }
        } catch (_) {}

        setMessage(errorMessage, "error");
      } catch (_) {
        setMessage(
          "Falha de conexão. Verifique sua internet e tente novamente.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    });
  });
})();
