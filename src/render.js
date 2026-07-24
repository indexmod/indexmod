import layout from "./templates/layout.js";


export function renderPage(
  content,
  rightUI = ""
) {

  return layout(
    content,
    rightUI
  );

}
