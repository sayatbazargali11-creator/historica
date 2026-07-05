/* =====================================================================
   DINARA MATH & IT — Mini IDE (HTML/CSS/JS live preview)
   ===================================================================== */

const IDE = {
  code: {
    html: `<h2>Привет, DINARA!</h2>\n<button id="btn">Нажми меня</button>`,
    css: `body{\n  font-family: sans-serif;\n  text-align: center;\n  padding-top: 40px;\n}\nbutton{\n  padding: 10px 20px;\n  border-radius: 999px;\n  border: none;\n  background: #6C5CE7;\n  color: white;\n  cursor: pointer;\n}`,
    js: `document.getElementById('btn').addEventListener('click', () => {\n  console.log('Кнопка нажата!');\n  document.querySelector('h2').textContent = 'Работает!';\n});`,
  },
  activeLang: "html",

  render(container){
    container.innerHTML = `
      <h3 style="margin-bottom:var(--sp-5);">Мини-IDE — HTML / CSS / JS</h3>
      <div class="ide-wrap">
        <div class="ide-editor-col">
          <div class="ide-tab-row">
            <button class="tab-btn active" data-lang="html">HTML</button>
            <button class="tab-btn" data-lang="css">CSS</button>
            <button class="tab-btn" data-lang="js">JavaScript</button>
          </div>
          <div class="ide-highlight-wrap">
            <pre class="ide-highlight-layer" id="ide-highlight" aria-hidden="true"><code></code></pre>
            <textarea class="ide-textarea ide-textarea-transparent" id="ide-editor" spellcheck="false"></textarea>
          </div>
          <button class="btn btn-primary" id="ide-run-btn">▶ Запустить</button>
        </div>
        <div class="ide-preview-col">
          <p style="font-size:var(--fs-sm); font-weight:600;">Результат</p>
          <iframe class="ide-preview-frame" id="ide-preview" sandbox="allow-scripts"></iframe>
          <p style="font-size:var(--fs-sm); font-weight:600;">Консоль</p>
          <div class="ide-console" id="ide-console">Готово к запуску...</div>
        </div>
      </div>
    `;

    const editor = document.getElementById("ide-editor");
    const highlightPre = document.getElementById("ide-highlight");
    editor.value = this.code[this.activeLang];

    const sync = SyntaxHighlight.attach(editor, highlightPre, () => this.activeLang);
    this._syncHighlight = sync;

    container.querySelectorAll("[data-lang]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.code[this.activeLang] = editor.value;
        container.querySelectorAll("[data-lang]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeLang = btn.dataset.lang;
        editor.value = this.code[this.activeLang];
        sync();
      });
    });

    editor.addEventListener("input", () => {
      this.code[this.activeLang] = editor.value;
    });

    document.getElementById("ide-run-btn").addEventListener("click", () => this.run());

    this.run();
  },

  run(){
    const consoleEl = document.getElementById("ide-console");
    const iframe = document.getElementById("ide-preview");
    consoleEl.innerHTML = "";

    const consoleBridge = `
      <script>
        (function(){
          const send = (type, args) => {
            parent.postMessage({ __ideConsole: true, type, message: Array.from(args).map(String).join(' ') }, '*');
          };
          const original = console.log;
          console.log = function(){ send('log', arguments); original.apply(console, arguments); };
          window.onerror = function(msg){ send('error', [msg]); };
        })();
      <\/script>
    `;

    const doc = `
      <!DOCTYPE html>
      <html>
      <head><style>${this.code.css}</style></head>
      <body>
        ${this.code.html}
        ${consoleBridge}
        <script>${this.code.js}<\/script>
      </body>
      </html>
    `;

    iframe.srcdoc = doc;
    Gamification.incIdeRuns();
    Utils.toast("Код выполнен", "success", "▶");
  },
};

window.addEventListener("message", (e) => {
  if(e.data && e.data.__ideConsole){
    const consoleEl = document.getElementById("ide-console");
    if(!consoleEl) return;
    const line = document.createElement("div");
    line.style.color = e.data.type === "error" ? "#FF6B6B" : "#7CFFB2";
    line.textContent = `> ${e.data.message}`;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
});
