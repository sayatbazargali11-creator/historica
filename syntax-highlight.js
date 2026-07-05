/* =====================================================================
   DINARA MATH & IT — Lightweight Syntax Highlighter
   No external libraries: a small regex-based tokenizer good enough
   for teaching-level HTML / CSS / JS snippets shown in the mini-IDE.
   ===================================================================== */

const SyntaxHighlight = {

  JS_KEYWORDS: [
    "const","let","var","function","return","if","else","for","while","do",
    "break","continue","switch","case","default","class","extends","new",
    "this","super","import","export","from","try","catch","finally","throw",
    "typeof","instanceof","in","of","null","undefined","true","false",
    "async","await","yield","static","get","set","void","delete",
  ],

  CSS_PROPERTIES_HINT: /(color|background|border|margin|padding|width|height|display|position|top|left|right|bottom|font|flex|grid|transition|transform|animation|box-shadow|border-radius|opacity|z-index|overflow|cursor|gap)/,

  escapeHtml(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  tokenizeJS(code){
    const escaped = this.escapeHtml(code);
    let out = "";
    const tokenRegex = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][A-Za-z0-9_$]*\b)|([{}()\[\];,.:])/gm;
    let lastIndex = 0;
    let match;
    while((match = tokenRegex.exec(escaped)) !== null){
      out += escaped.slice(lastIndex, match.index);
      const [full, comment1, comment2, str, num, word, punct] = match;
      if(comment1 || comment2){
        out += `<span class="tok-comment">${full}</span>`;
      } else if(str){
        out += `<span class="tok-string">${full}</span>`;
      } else if(num){
        out += `<span class="tok-number">${full}</span>`;
      } else if(word){
        out += this.JS_KEYWORDS.includes(word)
          ? `<span class="tok-keyword">${full}</span>`
          : `<span class="tok-ident">${full}</span>`;
      } else if(punct){
        out += `<span class="tok-punct">${full}</span>`;
      } else {
        out += full;
      }
      lastIndex = tokenRegex.lastIndex;
    }
    out += escaped.slice(lastIndex);
    return out;
  },

  tokenizeCSS(code){
    const escaped = this.escapeHtml(code);
    let out = "";
    const tokenRegex = /(\/\*[\s\S]*?\*\/)|([.#]?[A-Za-z_-][A-Za-z0-9_-]*(?=\s*\{))|([A-Za-z-]+)(?=\s*:)|(:)|(#[0-9a-fA-F]{3,8}\b)|(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms)?)|([{};])/g;
    let lastIndex = 0;
    let match;
    while((match = tokenRegex.exec(escaped)) !== null){
      out += escaped.slice(lastIndex, match.index);
      const [full, comment, selector, prop, colon, hex, num, punct] = match;
      if(comment) out += `<span class="tok-comment">${full}</span>`;
      else if(selector) out += `<span class="tok-tag">${full}</span>`;
      else if(prop) out += `<span class="tok-keyword">${full}</span>`;
      else if(colon) out += `<span class="tok-punct">${full}</span>`;
      else if(hex) out += `<span class="tok-string">${full}</span>`;
      else if(num) out += `<span class="tok-number">${full}</span>`;
      else if(punct) out += `<span class="tok-punct">${full}</span>`;
      else out += full;
      lastIndex = tokenRegex.lastIndex;
    }
    out += escaped.slice(lastIndex);
    return out;
  },

  tokenizeHTML(code){
    const escaped = this.escapeHtml(code);
    let out = "";
    const tokenRegex = /(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?[A-Za-z][A-Za-z0-9-]*)|("[^"]*"|'[^']*')|([A-Za-z-]+(?==))|(&gt;)/g;
    let lastIndex = 0;
    let match;
    while((match = tokenRegex.exec(escaped)) !== null){
      out += escaped.slice(lastIndex, match.index);
      const [full, comment, tagOpen, attrStr, attrName, tagClose] = match;
      if(comment) out += `<span class="tok-comment">${full}</span>`;
      else if(tagOpen) out += `<span class="tok-tag">${full}</span>`;
      else if(attrStr) out += `<span class="tok-string">${full}</span>`;
      else if(attrName) out += `<span class="tok-ident">${full}</span>`;
      else if(tagClose) out += `<span class="tok-tag">${full}</span>`;
      else out += full;
      lastIndex = tokenRegex.lastIndex;
    }
    out += escaped.slice(lastIndex);
    return out;
  },

  highlight(code, lang){
    if(lang === "js") return this.tokenizeJS(code);
    if(lang === "css") return this.tokenizeCSS(code);
    if(lang === "html") return this.tokenizeHTML(code);
    return this.escapeHtml(code);
  },

  /**
   * Wires a textarea to a synced <pre><code> overlay positioned behind it,
   * giving the illusion of syntax-highlighted editing without a heavy
   * editor dependency.
   */
  attach(textarea, preEl, getLang){
    const sync = () => {
      const lang = getLang();
      preEl.innerHTML = this.highlight(textarea.value, lang) + "\n";
      preEl.scrollTop = textarea.scrollTop;
      preEl.scrollLeft = textarea.scrollLeft;
    };
    textarea.addEventListener("input", sync);
    textarea.addEventListener("scroll", () => {
      preEl.scrollTop = textarea.scrollTop;
      preEl.scrollLeft = textarea.scrollLeft;
    });
    sync();
    return sync;
  },
};
