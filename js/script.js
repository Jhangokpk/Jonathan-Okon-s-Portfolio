(function () {
  "use strict";

  var backdrop = document.getElementById("modal-backdrop");
  var openTriggers = document.querySelectorAll("[data-open-modal]");
  var closeTriggers = document.querySelectorAll("[data-close-modal]");
  var activeModal = null;
  var lastFocused = null;

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;

    if (activeModal) closeModal();

    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    activeModal = modal;

    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    activeModal = null;
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(e) {
    if (!activeModal || e.key !== "Tab") return;
    var focusable = activeModal.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  openTriggers.forEach(function (el) {
    el.addEventListener("click", function () {
      openModal(el.getAttribute("data-open-modal"));
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(el.getAttribute("data-open-modal"));
      }
    });
    if (el.tagName !== "BUTTON" && el.tagName !== "A") {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
    }
  });

  closeTriggers.forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
    trapFocus(e);
  });

  /* ---- Contact form: AJAX submit to Netlify Forms ---- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (window.grecaptcha) {
        var recaptchaResponse = window.grecaptcha.getResponse();
        if (!recaptchaResponse) {
          status.textContent = "Please complete the \u201cI'm not a robot\u201d check before sending.";
          status.classList.add("is-error");
          return;
        }
      }

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) {
        payload[key] = value;
      });

      status.textContent = "Sending…";
      status.classList.remove("is-error");

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload)
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
            form.reset();
            if (window.grecaptcha) window.grecaptcha.reset();
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please email me directly instead.";
          status.classList.add("is-error");
        });
    });
  }
})();
