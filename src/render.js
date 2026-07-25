import layout from "./templates/layout.js";


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
        "text/html;charset=UTF-8"
      }
    }

  );

}
