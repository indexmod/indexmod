import layout from "./templates/layout.js";
import { buildMeta } from "./meta.js";



export function renderPage(
  content,
  rightUI = "",
  meta = {}
) {



const pageMeta =
buildMeta(meta);



return new Response(

layout(

content,

rightUI,

pageMeta

),

{

headers:{

"Content-Type":
"text/html;charset=UTF-8"

}

}

);

}
