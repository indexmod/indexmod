export function renderPage(content, rightUI = "") {

  return new Response(
    `
    <!doctype html>
    <html>
    <body>
    ${content}
    </body>
    </html>
    `,
    {
      headers:{
        "Content-Type":"text/html;charset=UTF-8"
      }
    }
  );

}
