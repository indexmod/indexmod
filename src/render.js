import layout from "./templates/layout.js";


// ===============================
// PAGE RENDERER
// ===============================

export function renderPage(
  content,
  rightUI = ""
) {

  return new Response(

    layout(
      content,
      rightUI
    ),

    {
      headers:{
        "Content-Type":
        "text/html; charset=utf-8"
      }
    }

  );

}
