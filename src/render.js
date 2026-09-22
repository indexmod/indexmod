import layout from "./templates/layout.js";
import { buildMeta } from "./meta.js";



export function renderPage(
  content,
  rightUI = "",
  meta = {},
  options = {}
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

status:
options.status || 200,

headers:{

"Content-Type":
"text/html;charset=UTF-8"

}

}

);

}
