/* =====================================================================
   DINARA MATH & IT — Certificate Generation (print-to-PDF)
   ===================================================================== */

const Certificates = {
  generate(courseTitle, studentName, date){
    const win = window.open("", "_blank", "width=900,height=650");
    if(!win){
      Utils.toast("Разрешите всплывающие окна для скачивания сертификата", "error", "⚠️");
      return;
    }
    const formattedDate = new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });

    win.document.write(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Сертификат — ${studentName}</title>
        <style>
          @page{ size: landscape; margin: 0; }
          body{
            margin: 0;
            font-family: 'Georgia', serif;
            background: #FAFBFF;
            display: flex; align-items: center; justify-content: center;
            height: 100vh;
          }
          .cert{
            width: 90%;
            max-width: 980px;
            aspect-ratio: 1.55;
            border: 10px solid #6C5CE7;
            outline: 2px solid #00B8A9;
            outline-offset: -22px;
            border-radius: 18px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px;
            background:
              radial-gradient(circle at 15% 15%, rgba(108,92,231,0.08), transparent 40%),
              radial-gradient(circle at 85% 85%, rgba(0,184,169,0.08), transparent 40%),
              #ffffff;
          }
          .brand{ font-family: Arial, sans-serif; font-weight: bold; letter-spacing: 2px; color: #6C5CE7; margin-bottom: 18px; font-size: 14px; text-transform: uppercase;}
          .title{ font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: #6B7280; margin-bottom: 22px; }
          .name{ font-size: 42px; color: #1A1B25; margin-bottom: 18px; border-bottom: 2px solid #F5A623; padding-bottom: 10px; }
          .desc{ font-size: 16px; color: #33344A; max-width: 640px; margin-bottom: 6px; }
          .course{ font-size: 22px; color: #00B8A9; font-weight: bold; margin: 14px 0 24px; }
          .footer-row{ display:flex; justify-content: space-between; width: 80%; margin-top: 30px; font-family: Arial, sans-serif; font-size: 12px; color: #6B7280; }
          .sign{ border-top: 1px solid #1A1B25; padding-top: 6px; width: 200px; }
          @media print{
            body{ height: auto; }
          }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="brand">DINARA MATH &amp; IT</div>
          <div class="title">Сертификат о прохождении курса</div>
          <div class="name">${studentName}</div>
          <div class="desc">успешно завершил(а) курс</div>
          <div class="course">«${courseTitle}»</div>
          <div class="desc">и продемонстрировал(а) отличное понимание материала, включая теорию, практические задания и итоговое тестирование.</div>
          <div class="footer-row">
            <div class="sign">Дата: ${formattedDate}</div>
            <div class="sign">DINARA MATH &amp; IT</div>
          </div>
        </div>
        <script>
          window.onload = () => setTimeout(() => window.print(), 350);
        <\/script>
      </body>
      </html>
    `);
    win.document.close();
  },
};
