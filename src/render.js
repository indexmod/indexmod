import layout from "./templates/layout.js";


// ===============================
// PAGE RENDERER
// ===============================

export function renderPage(
  content,
  rightUI = ""
) {

  return layout(
    content,
    rightUI
  );

}
