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
"text/html;charset=UTF-8",
...(pageMeta.robots.includes("noindex")
? {"X-Robots-Tag":"noindex", "Cache-Control":"no-store"}
: {"Cache-Control":"public,max-age=300,s-maxage=3600,stale-while-revalidate=86400"})

}

}

);

}
