/* =====================================================================
   DINARA MATH & IT — Tools Hub & Calculators
   ===================================================================== */

const UITools = {
  render(tool){
    const root = document.getElementById("tool-panel-root");
    if(!tool){ root.innerHTML = ""; return; }

    const renderers = {
      "calc-quadratic": Calculators.quadratic,
      "calc-percent": Calculators.percent,
      "calc-fractions": Calculators.fractions,
      "calc-matrix": Calculators.matrix,
      "calc-vector": Calculators.vector,
      "calc-derivative": Calculators.derivative,
      "calc-integral": Calculators.integral,
      "calc-base": Calculators.base,
      "ide": window.IDE ? IDE.render : null,
      "graphing": window.Graphing ? Graphing.render : null,
    };

    const renderer = renderers[tool];
    if(renderer){
      root.innerHTML = `<div class="tool-panel card-glass" id="tool-panel-inner"></div>`;
      renderer(document.getElementById("tool-panel-inner"));
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      root.innerHTML = "";
    }
  },
};

const Calculators = {

  quadratic(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Решение квадратных уравнений ax² + bx + c = 0</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <label class="mono">a = <input type="number" class="text-field" id="quad-a" value="1"></label>
          <label class="mono">b = <input type="number" class="text-field" id="quad-b" value="-3"></label>
          <label class="mono">c = <input type="number" class="text-field" id="quad-c" value="2"></label>
          <button class="btn btn-primary" id="quad-calc-btn">Решить</button>
        </div>
        <div class="calc-result" id="quad-result">Введите коэффициенты и нажмите «Решить»</div>
      </div>
    `;
    document.getElementById("quad-calc-btn").addEventListener("click", () => {
      const a = parseFloat(document.getElementById("quad-a").value);
      const b = parseFloat(document.getElementById("quad-b").value);
      const c = parseFloat(document.getElementById("quad-c").value);
      const result = document.getElementById("quad-result");
      if(a === 0){
        result.textContent = "a не может быть равно 0 — это не квадратное уравнение.";
        return;
      }
      const d = b * b - 4 * a * c;
      if(d < 0){
        result.innerHTML = `D = ${d.toFixed(2)} &lt; 0 → действительных корней нет.`;
      } else if(d === 0){
        const x = -b / (2 * a);
        result.innerHTML = `D = 0 → один корень: x = ${x.toFixed(3)}`;
      } else {
        const sqrtD = Math.sqrt(d);
        const x1 = (-b + sqrtD) / (2 * a);
        const x2 = (-b - sqrtD) / (2 * a);
        result.innerHTML = `D = ${d.toFixed(2)} &gt; 0 → x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`;
      }
      Gamification.incIdeRuns && null;
      Store.incTasksSolved(1);
    });
  },

  percent(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Калькулятор процентов</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <label class="mono">Число: <input type="number" class="text-field" id="pct-value" value="200"></label>
          <label class="mono">Процент (%): <input type="number" class="text-field" id="pct-percent" value="15"></label>
          <button class="btn btn-primary" id="pct-calc-btn">Вычислить</button>
        </div>
        <div class="calc-result" id="pct-result">Результат появится здесь</div>
      </div>
    `;
    document.getElementById("pct-calc-btn").addEventListener("click", () => {
      const value = parseFloat(document.getElementById("pct-value").value);
      const percent = parseFloat(document.getElementById("pct-percent").value);
      const part = (value * percent) / 100;
      document.getElementById("pct-result").innerHTML =
        `${percent}% от ${value} = ${part.toFixed(2)}<br>${value} + ${percent}% = ${(value + part).toFixed(2)}<br>${value} − ${percent}% = ${(value - part).toFixed(2)}`;
    });
  },

  fractions(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Калькулятор дробей</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="number" class="text-field" id="fr-a1" value="1" style="width:70px;">/<input type="number" class="text-field" id="fr-a2" value="2" style="width:70px;">
            <select class="select-field" id="fr-op">
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <input type="number" class="text-field" id="fr-b1" value="1" style="width:70px;">/<input type="number" class="text-field" id="fr-b2" value="3" style="width:70px;">
          </div>
          <button class="btn btn-primary" id="fr-calc-btn">Вычислить</button>
        </div>
        <div class="calc-result" id="fr-result">Результат появится здесь</div>
      </div>
    `;
    function gcd(a, b){ return b === 0 ? Math.abs(a) : gcd(b, a % b); }
    document.getElementById("fr-calc-btn").addEventListener("click", () => {
      const a1 = parseInt(document.getElementById("fr-a1").value, 10);
      const a2 = parseInt(document.getElementById("fr-a2").value, 10);
      const b1 = parseInt(document.getElementById("fr-b1").value, 10);
      const b2 = parseInt(document.getElementById("fr-b2").value, 10);
      const op = document.getElementById("fr-op").value;
      let num, den;
      if(op === "+"){ num = a1 * b2 + b1 * a2; den = a2 * b2; }
      else if(op === "-"){ num = a1 * b2 - b1 * a2; den = a2 * b2; }
      else if(op === "*"){ num = a1 * b1; den = a2 * b2; }
      else { num = a1 * b2; den = a2 * b1; }
      const g = gcd(num, den) || 1;
      num /= g; den /= g;
      if(den < 0){ den *= -1; num *= -1; }
      document.getElementById("fr-result").innerHTML = `Результат: ${num}/${den} ${den !== 0 ? `≈ ${(num/den).toFixed(3)}` : ""}`;
    });
  },

  matrix(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Сложение матриц 2×2</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <p class="mono" style="font-size:var(--fs-sm);">Матрица A</p>
          <div class="matrix-grid" style="grid-template-columns: repeat(2, 56px);">
            <input type="number" id="ma-00" value="1"><input type="number" id="ma-01" value="2">
            <input type="number" id="ma-10" value="3"><input type="number" id="ma-11" value="4">
          </div>
          <p class="mono" style="font-size:var(--fs-sm);">Матрица B</p>
          <div class="matrix-grid" style="grid-template-columns: repeat(2, 56px);">
            <input type="number" id="mb-00" value="5"><input type="number" id="mb-01" value="6">
            <input type="number" id="mb-10" value="7"><input type="number" id="mb-11" value="8">
          </div>
          <button class="btn btn-primary" id="matrix-calc-btn">Сложить</button>
        </div>
        <div class="calc-result" id="matrix-result">Результат появится здесь</div>
      </div>
    `;
    document.getElementById("matrix-calc-btn").addEventListener("click", () => {
      const get = id => parseFloat(document.getElementById(id).value);
      const r00 = get("ma-00") + get("mb-00");
      const r01 = get("ma-01") + get("mb-01");
      const r10 = get("ma-10") + get("mb-10");
      const r11 = get("ma-11") + get("mb-11");
      document.getElementById("matrix-result").innerHTML = `A + B = <br>[ ${r00} &nbsp; ${r01} ]<br>[ ${r10} &nbsp; ${r11} ]`;
    });
  },

  vector(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Операции с векторами (2D)</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <label class="mono">Вектор A: x=<input type="number" class="text-field" id="va-x" value="3" style="width:70px;"> y=<input type="number" class="text-field" id="va-y" value="4" style="width:70px;"></label>
          <label class="mono">Вектор B: x=<input type="number" class="text-field" id="vb-x" value="1" style="width:70px;"> y=<input type="number" class="text-field" id="vb-y" value="2" style="width:70px;"></label>
          <button class="btn btn-primary" id="vector-calc-btn">Вычислить</button>
        </div>
        <div class="calc-result" id="vector-result">Результат появится здесь</div>
      </div>
    `;
    document.getElementById("vector-calc-btn").addEventListener("click", () => {
      const ax = parseFloat(document.getElementById("va-x").value);
      const ay = parseFloat(document.getElementById("va-y").value);
      const bx = parseFloat(document.getElementById("vb-x").value);
      const by = parseFloat(document.getElementById("vb-y").value);
      const sum = `(${ax + bx}, ${ay + by})`;
      const dot = ax * bx + ay * by;
      const magA = Math.sqrt(ax * ax + ay * ay).toFixed(3);
      const magB = Math.sqrt(bx * bx + by * by).toFixed(3);
      document.getElementById("vector-result").innerHTML =
        `A + B = ${sum}<br>A · B (скалярное) = ${dot}<br>|A| = ${magA}, |B| = ${magB}`;
    });
  },

  derivative(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Численная производная f(x) = xⁿ в точке</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <label class="mono">n (степень x): <input type="number" class="text-field" id="der-n" value="2"></label>
          <label class="mono">x (точка): <input type="number" class="text-field" id="der-x" value="3"></label>
          <button class="btn btn-primary" id="der-calc-btn">Вычислить</button>
        </div>
        <div class="calc-result" id="der-result">Результат появится здесь</div>
      </div>
    `;
    document.getElementById("der-calc-btn").addEventListener("click", () => {
      const n = parseFloat(document.getElementById("der-n").value);
      const x = parseFloat(document.getElementById("der-x").value);
      const h = 0.0001;
      const f = v => Math.pow(v, n);
      const numeric = (f(x + h) - f(x - h)) / (2 * h);
      const analytic = n * Math.pow(x, n - 1);
      document.getElementById("der-result").innerHTML =
        `f(x) = x^${n}<br>Аналитически: f'(x) = ${n}·x^${n - 1} → f'(${x}) = ${analytic.toFixed(3)}<br>Численно (метод центральной разности): ${numeric.toFixed(3)}`;
    });
  },

  integral(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Численный интеграл f(x) = xⁿ на [a, b] (метод трапеций)</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <label class="mono">n (степень x): <input type="number" class="text-field" id="int-n" value="2"></label>
          <label class="mono">a: <input type="number" class="text-field" id="int-a" value="0"></label>
          <label class="mono">b: <input type="number" class="text-field" id="int-b" value="3"></label>
          <button class="btn btn-primary" id="int-calc-btn">Вычислить</button>
        </div>
        <div class="calc-result" id="int-result">Результат появится здесь</div>
      </div>
    `;
    document.getElementById("int-calc-btn").addEventListener("click", () => {
      const n = parseFloat(document.getElementById("int-n").value);
      const a = parseFloat(document.getElementById("int-a").value);
      const b = parseFloat(document.getElementById("int-b").value);
      const steps = 1000;
      const dx = (b - a) / steps;
      const f = v => Math.pow(v, n);
      let sum = (f(a) + f(b)) / 2;
      for(let i = 1; i < steps; i++) sum += f(a + i * dx);
      const numeric = sum * dx;
      const analytic = (Math.pow(b, n + 1) - Math.pow(a, n + 1)) / (n + 1);
      document.getElementById("int-result").innerHTML =
        `∫ x^${n} dx от ${a} до ${b}<br>Аналитически: ${analytic.toFixed(3)}<br>Численно (трапеции, 1000 шагов): ${numeric.toFixed(3)}`;
    });
  },

  base(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Перевод систем счисления</h3>
      <div class="calc-grid">
        <div class="calc-inputs">
          <label class="mono">Число: <input type="text" class="text-field" id="base-value" value="255"></label>
          <label class="mono">Из системы: <select class="select-field" id="base-from">
            <option value="2">Двоичная (2)</option>
            <option value="8">Восьмеричная (8)</option>
            <option value="10" selected>Десятичная (10)</option>
            <option value="16">Шестнадцатеричная (16)</option>
          </select></label>
          <button class="btn btn-primary" id="base-calc-btn">Перевести</button>
        </div>
        <div class="calc-result" id="base-result">Результат появится здесь</div>
      </div>
    `;
    document.getElementById("base-calc-btn").addEventListener("click", () => {
      const value = document.getElementById("base-value").value;
      const from = parseInt(document.getElementById("base-from").value, 10);
      const dec = parseInt(value, from);
      if(isNaN(dec)){
        document.getElementById("base-result").textContent = "Некорректное число для выбранной системы счисления.";
        return;
      }
      document.getElementById("base-result").innerHTML =
        `Десятичная: ${dec}<br>Двоичная: ${dec.toString(2)}<br>Восьмеричная: ${dec.toString(8)}<br>Шестнадцатеричная: ${dec.toString(16).toUpperCase()}`;
    });
  },
};
