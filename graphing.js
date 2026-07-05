/* =====================================================================
   DINARA MATH & IT — Graphing Calculator (Canvas function plotter)
   ===================================================================== */

const Graphing = {
  params: { a: 1, b: 0, c: 0 },
  fnType: "quadratic",

  render(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Построение графиков функций</h3>
      <div class="graph-wrap">
        <div class="graph-canvas-wrap">
          <canvas id="graph-canvas" width="640" height="420"></canvas>
        </div>
        <div>
          <label style="font-size:var(--fs-sm); font-weight:600;">Функция</label>
          <select class="select-field" id="graph-fn-type" style="width:100%; margin:var(--sp-2) 0 var(--sp-5);">
            <option value="quadratic">y = a·x² + b·x + c</option>
            <option value="sine">y = a·sin(b·x + c)</option>
            <option value="linear">y = a·x + b</option>
          </select>
          <div class="slider-row">
            <label>a <span id="val-a">1.0</span></label>
            <input type="range" id="slider-a" min="-5" max="5" step="0.1" value="1">
          </div>
          <div class="slider-row">
            <label>b <span id="val-b">0.0</span></label>
            <input type="range" id="slider-b" min="-5" max="5" step="0.1" value="0">
          </div>
          <div class="slider-row">
            <label>c <span id="val-c">0.0</span></label>
            <input type="range" id="slider-c" min="-5" max="5" step="0.1" value="0">
          </div>
        </div>
      </div>
    `;

    const sA = document.getElementById("slider-a");
    const sB = document.getElementById("slider-b");
    const sC = document.getElementById("slider-c");
    const fnSelect = document.getElementById("graph-fn-type");

    const update = () => {
      this.params.a = parseFloat(sA.value);
      this.params.b = parseFloat(sB.value);
      this.params.c = parseFloat(sC.value);
      document.getElementById("val-a").textContent = this.params.a.toFixed(1);
      document.getElementById("val-b").textContent = this.params.b.toFixed(1);
      document.getElementById("val-c").textContent = this.params.c.toFixed(1);
      this.fnType = fnSelect.value;
      this.draw();
    };

    [sA, sB, sC, fnSelect].forEach(el => el.addEventListener("input", update));
    update();
    Gamification.incGraphsBuilt();
  },

  evaluate(x){
    const { a, b, c } = this.params;
    if(this.fnType === "quadratic") return a * x * x + b * x + c;
    if(this.fnType === "sine") return a * Math.sin(b * x + c);
    return a * x + b;
  },

  draw(){
    const canvas = document.getElementById("graph-canvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const scale = 30; // px per unit
    const originX = w / 2, originY = h / 2;

    /* grid */
    ctx.strokeStyle = "rgba(108,92,231,0.12)";
    ctx.lineWidth = 1;
    for(let x = originX % scale; x < w; x += scale){
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for(let y = originY % scale; y < h; y += scale){
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    /* axes */
    ctx.strokeStyle = "rgba(108,92,231,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    /* function curve */
    ctx.strokeStyle = "#6C5CE7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for(let px = 0; px <= w; px++){
      const x = (px - originX) / scale;
      const y = this.evaluate(x);
      const py = originY - y * scale;
      if(py < -1000 || py > h + 1000){ started = false; continue; }
      if(!started){ ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  },
};
