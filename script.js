/* ==========================================================================
   ONYX PAY — script.js
   Small, self-contained modules: (1) card mirroring + formatting,
   (2) 3D tilt + dynamic reflection, (3) flip-on-CVV, (4) validation,
   (5) pay button lifecycle (idle → loading → success).
   ========================================================================== */

(function () {
  "use strict";

  document.body.classList.add("is-ready");

  /* ------------------------------------------------------------------ *
   *  DOM refs
   * ------------------------------------------------------------------ */
  const cardStage = document.getElementById("cardStage");
  const cardTilt = document.getElementById("cardTilt");
  const cardFlip = document.getElementById("cardFlip");

  const numberGroups = document.querySelectorAll("#cardNumberDisplay .grp");
  const nameDisplay = document.getElementById("cardNameDisplay");
  const expiryDisplay = document.getElementById("cardExpiryDisplay");
  const cvvDisplay = document.getElementById("cvvDisplay");
  const networkFront = document.getElementById("cardNetwork");
  const networkBack = document.getElementById("cardNetworkBack");
  const inputNetworkIcon = document.getElementById("inputNetworkIcon");

  const cardNumberInput = document.getElementById("cardNumber");
  const cardNameInput = document.getElementById("cardName");
  const cardExpiryInput = document.getElementById("cardExpiry");
  const cardCvvInput = document.getElementById("cardCvv");

  const form = document.getElementById("paymentForm");
  const payBtn = document.getElementById("payBtn");

  /* ------------------------------------------------------------------ *
   *  1. CARD NUMBER — formatting + live mirror
   * ------------------------------------------------------------------ */
  cardNumberInput.addEventListener("input", () => {
    const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 19);
    const groups = digits.match(/.{1,4}/g) || [];
    cardNumberInput.value = groups.join(" ");

    mirrorCardNumber(digits);
    updateNetwork(digits);
    clearFieldState("fieldCardNumber");
  });

  cardNumberInput.addEventListener("blur", () => validateCardNumber(true));

  function mirrorCardNumber(digits) {
    for (let i = 0; i < 4; i++) {
      const finalText = buildGroupDisplay(digits, i);
      if (numberGroups[i].textContent !== finalText) {
        numberGroups[i].textContent = finalText;
        pulse(numberGroups[i]);
      }
    }
  }

  // Builds a 4-character group: real digits where typed, bullets for the rest.
  function buildGroupDisplay(digits, groupIndex) {
    let out = "";
    for (let i = 0; i < 4; i++) {
      const idx = groupIndex * 4 + i;
      out += idx < digits.length ? digits[idx] : "\u2022";
    }
    return out;
  }

  function pulse(el) {
    el.classList.remove("is-updated");
    // Force reflow so the animation can restart on rapid typing
    void el.offsetWidth;
    el.classList.add("is-updated");
  }

  /* ------------------------------------------------------------------ *
   *  2. NETWORK DETECTION (fictional, card-scheme inspired marks)
   * ------------------------------------------------------------------ */
  function detectNetwork(digits) {
    if (digits.startsWith("4")) return "velocity";
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "duopay";
    return "generic";
  }

  function updateNetwork(digits) {
    const network = detectNetwork(digits);
    networkFront.dataset.network = network;
    networkBack.dataset.network = network;

    inputNetworkIcon.innerHTML =
      network === "velocity"
        ? `<svg viewBox="0 0 32 20" width="30" height="20"><text x="0" y="15" font-family="Sora, sans-serif" font-style="italic" font-weight="800" font-size="13" fill="#6FC1FF">vel</text></svg>`
        : network === "duopay"
        ? `<svg viewBox="0 0 32 20" width="30" height="20"><circle cx="12" cy="10" r="8" fill="#D4AF6A" opacity="0.9"/><circle cx="20" cy="10" r="8" fill="#2F6FED" opacity="0.9" style="mix-blend-mode:screen"/></svg>`
        : "";
  }

  /* ------------------------------------------------------------------ *
   *  3. CARDHOLDER NAME — live mirror
   * ------------------------------------------------------------------ */
  cardNameInput.addEventListener("input", () => {
    // Allow letters, spaces, hyphens and apostrophes only
    cardNameInput.value = cardNameInput.value.replace(/[^a-zA-Z\s'-]/g, "");
    nameDisplay.textContent = cardNameInput.value.trim() ? cardNameInput.value : "YOUR NAME";
    clearFieldState("fieldCardName");
  });
  cardNameInput.addEventListener("blur", () => validateName(true));

  /* ------------------------------------------------------------------ *
   *  4. EXPIRY — auto slash formatting + live mirror
   * ------------------------------------------------------------------ */
  cardExpiryInput.addEventListener("input", () => {
    let digits = cardExpiryInput.value.replace(/\D/g, "").slice(0, 4);

    if (digits.length >= 2) {
      let mm = digits.slice(0, 2);
      // Guard against impossible months while typing (e.g. "13" -> "01")
      if (parseInt(mm, 10) > 12) mm = "12";
      if (mm === "00") mm = "01";
      digits = mm + digits.slice(2);
    }

    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    cardExpiryInput.value = formatted;
    expiryDisplay.textContent = formatted || "MM/YY";
    clearFieldState("fieldExpiry");
  });
  cardExpiryInput.addEventListener("blur", () => validateExpiry(true));

  /* ------------------------------------------------------------------ *
   *  5. CVV — live mirror + flip-to-back on focus
   * ------------------------------------------------------------------ */
  cardCvvInput.addEventListener("input", () => {
    cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 4);
    cvvDisplay.textContent = cardCvvInput.value.padEnd(3, "\u2022");
    clearFieldState("fieldCvv");
  });
  cardCvvInput.addEventListener("focus", () => cardFlip.classList.add("is-flipped"));
  cardCvvInput.addEventListener("blur", () => {
    cardFlip.classList.remove("is-flipped");
    validateCvv(true);
  });

  /* ------------------------------------------------------------------ *
   *  6. 3D TILT + DYNAMIC REFLECTION
   * ------------------------------------------------------------------ */
  const maxTilt = 14;
  cardStage.addEventListener("mousemove", (e) => {
    const rect = cardStage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;
    cardTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardTilt.style.setProperty("--mx", `${px * 100}%`);
    cardTilt.style.setProperty("--my", `${py * 100}%`);
  });
  cardStage.addEventListener("mouseleave", () => {
    cardTilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    cardTilt.style.setProperty("--mx", "50%");
    cardTilt.style.setProperty("--my", "30%");
  });

  // Gentle parallax on the whole visual panel for extra depth
  const visualPanel = document.getElementById("visualPanel");
  visualPanel.addEventListener("mousemove", (e) => {
    const rect = visualPanel.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cardStage.style.translate = `${px * 10}px ${py * 6}px`;
  });
  visualPanel.addEventListener("mouseleave", () => { cardStage.style.translate = "0 0"; });

  /* ------------------------------------------------------------------ *
   *  7. VALIDATION
   * ------------------------------------------------------------------ */
  function setFieldValid(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove("is-error");
    field.classList.add("is-valid");
  }
  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.remove("is-valid");
    field.classList.add("is-error");
    if (message) field.querySelector(".field-msg").textContent = message;
  }
  function clearFieldState(fieldId) {
    document.getElementById(fieldId).classList.remove("is-error");
  }

  // Luhn checksum — the same check real card networks use
  function luhnValid(digits) {
    let sum = 0, alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  }

  function validateCardNumber(showMsg) {
    const digits = cardNumberInput.value.replace(/\D/g, "");
    const ok = digits.length >= 13 && digits.length <= 19 && luhnValid(digits);
    if (ok) setFieldValid("fieldCardNumber");
    else if (showMsg) setFieldError("fieldCardNumber", "That card number doesn't look right.");
    return ok;
  }

  function validateName(showMsg) {
    const value = cardNameInput.value.trim();
    const ok = value.length >= 3 && /^[a-zA-Z\s'-]+$/.test(value);
    if (ok) setFieldValid("fieldCardName");
    else if (showMsg) setFieldError("fieldCardName", "Enter the name as printed on the card.");
    return ok;
  }

  function validateExpiry(showMsg) {
    const value = cardExpiryInput.value;
    const match = /^(\d{2})\/(\d{2})$/.exec(value);
    if (!match) {
      if (showMsg) setFieldError("fieldExpiry", "Use MM/YY format.");
      return false;
    }
    const month = parseInt(match[1], 10);
    const year = 2000 + parseInt(match[2], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const ok = month >= 1 && month <= 12 && (year > currentYear || (year === currentYear && month >= currentMonth));
    if (ok) setFieldValid("fieldExpiry");
    else if (showMsg) setFieldError("fieldExpiry", "This card has expired.");
    return ok;
  }

  function validateCvv(showMsg) {
    const ok = /^\d{3,4}$/.test(cardCvvInput.value);
    if (ok) setFieldValid("fieldCvv");
    else if (showMsg) setFieldError("fieldCvv", "3 or 4 digits, please.");
    return ok;
  }

  /* ------------------------------------------------------------------ *
   *  8. RIPPLE EFFECT (buttons)
   * ------------------------------------------------------------------ */
  function spawnRipple(container, e) {
    const rect = container.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
    container.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }
  payBtn.addEventListener("click", (e) => {
    if (!payBtn.classList.contains("is-loading") && !payBtn.classList.contains("is-success")) {
      spawnRipple(payBtn, e);
    }
  });

  /* ------------------------------------------------------------------ *
   *  9. FORM SUBMIT — validate all, then simulate payment lifecycle
   * ------------------------------------------------------------------ */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (payBtn.classList.contains("is-loading") || payBtn.classList.contains("is-success")) return;

    const results = [
      validateCardNumber(true),
      validateName(true),
      validateExpiry(true),
      validateCvv(true)
    ];

    if (results.includes(false)) {
      const firstInvalid = form.querySelector(".field.is-error input");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // All good — run the loading → success sequence
    payBtn.classList.add("is-loading");

    setTimeout(() => {
      payBtn.classList.remove("is-loading");
      payBtn.classList.add("is-success");

      setTimeout(resetToIdle, 3200);
    }, 1700);
  });

  function resetToIdle() {
    payBtn.classList.remove("is-success");
    form.reset();
    mirrorCardNumber("");
    updateNetwork("");
    nameDisplay.textContent = "YOUR NAME";
    expiryDisplay.textContent = "MM/YY";
    cvvDisplay.textContent = "\u2022\u2022\u2022";
    inputNetworkIcon.innerHTML = "";
    ["fieldCardNumber", "fieldCardName", "fieldExpiry", "fieldCvv"].forEach((id) => {
      document.getElementById(id).classList.remove("is-valid", "is-error");
    });
  }

})();