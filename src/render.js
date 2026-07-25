import layout from "./templates/layout.js";



export function renderPage(
  content,
  rightUI = "",
  meta = {}
) {


return new Response(

layout(
  content,
  rightUI,
  meta
),


{
headers:{
"Content-Type":
"text/html;charset=UTF-8"
}
}


);


}
