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
    var closingPdf = activeModal.id === "pdf-modal";
    activeModal.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    activeModal = null;
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    if (closingPdf) {
      var frame = document.getElementById("pdf-frame");
      if (frame) setTimeout(function () { frame.src = ""; }, 300);
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

  /* ---- Documents (certificates, résumé, recommendation letters).
     Capability check: if the browser can display PDFs inline, open the
     in-page viewer dialog (preview + download button). If it can't
     (e.g. Android Chrome, which has no inline PDF viewer and blocks framed
     downloads), open the PDF straight in a new tab instead. ---- */
  function canInlinePdf() {
    // iOS/iPadOS can technically embed PDFs but only shows page one and
    // doesn't scroll reliably, so treat it as "can't" and use a new tab.
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) return false;

    // Modern browsers report this directly (Chrome 94+, Firefox 99+, Safari 16.4+).
    if (typeof navigator.pdfViewerEnabled === "boolean") {
      return navigator.pdfViewerEnabled;
    }
    // Older browsers: fall back to checking for a registered PDF handler.
    return !!(navigator.mimeTypes && navigator.mimeTypes["application/pdf"]);
  }

  function openInNewTab(src) {
    var link = document.createElement("a");
    link.href = src;
    link.target = "_blank";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  var pdfFrame = document.getElementById("pdf-frame");
  var pdfTitle = document.getElementById("pdf-modal-title");
  var pdfKicker = document.getElementById("pdf-modal-kicker");
  var pdfDownload = document.getElementById("pdf-download");
  var pdfNewTab = document.getElementById("pdf-newtab");

  document.querySelectorAll("[data-pdf-src]").forEach(function (el) {
    el.addEventListener("click", function () {
      var src = el.getAttribute("data-pdf-src");

      if (!canInlinePdf()) {
        openInNewTab(src);
        return;
      }

      var title = el.getAttribute("data-pdf-title") || "Document";
      var kicker = el.getAttribute("data-pdf-kicker") || "";
      pdfTitle.textContent = title;
      pdfKicker.textContent = kicker;
      pdfKicker.style.display = kicker ? "" : "none";
      pdfFrame.src = src;
      pdfDownload.href = src;
      pdfNewTab.href = src;
      openModal("pdf-modal");
    });
  });

  /* ---- Active nav highlight while scrolling ---- */
  var navLinks = document.querySelectorAll(".site-nav nav a[href^='#']");
  var navSections = [];
  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section) navSections.push({ link: link, section: section });
  });

  if (navSections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = navSections.find(function (ns) { return ns.section === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("active"); });
            match.link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    navSections.forEach(function (ns) { observer.observe(ns.section); });
  }

  /* ---- Contact form: block submission until reCAPTCHA is complete, then
     let the browser do a normal POST. (Netlify's reCAPTCHA verification is
     most reliable with a real form submission rather than an AJAX/fetch
     request, so this intentionally does NOT intercept a valid submit.) ---- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      if (window.grecaptcha) {
        var recaptchaResponse = window.grecaptcha.getResponse();
        if (!recaptchaResponse) {
          e.preventDefault();
          status.textContent = "Please complete the \u201cI'm not a robot\u201d check before sending.";
          status.classList.add("is-error");
          return;
        }
      }
      status.textContent = "Sending…";
      status.classList.remove("is-error");
      // No preventDefault here — the form submits normally to Netlify.
    });
  }

  /* After Netlify processes the submission it redirects back to
     "/?sent=true#contact" — this is what shows the confirmation, since it
     doesn't depend on a separate success page existing on the deploy. */
  if (window.location.search.indexOf("sent=true") !== -1) {
    if (status) {
      status.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
      status.classList.remove("is-error");
    }
    var cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState(null, "", cleanUrl);
  }
})();