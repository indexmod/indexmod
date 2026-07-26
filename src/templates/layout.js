import { og } from "../meta.js";
import yandexMetrika from "../metrics.js";



export default function layout(
  c,
  rightUI = "",
  meta = {}
) {



const title =
meta.title ||
"Indexmod";



const description =
meta.description ||
"Indexmod — fashion and art encyclopedia";



const url =
meta.url ||
(
meta.slug
?
`https://indexmod.press/${meta.slug}`
:
"https://indexmod.press"
);



return `

<!doctype html>

<html>

<head>


<meta charset="utf-8">


<link rel="icon" href="/favicon.svg" type="image/svg+xml">


<meta name="viewport" content="width=device-width, initial-scale=1">



<title>
${escapeHtml(title)}
</title>



<meta name="description"
content="${escapeHtml(description)}">



<link rel="canonical"
href="${escapeHtml(url)}">



${og({

...meta,

title,

description,

url

})}



<link rel="stylesheet" href="/styles/base.css">

<link rel="stylesheet" href="/styles/view.css">

<link rel="stylesheet" href="/styles/editor.css">

<link rel="stylesheet" href="/styles/index.css">



${yandexMetrika()}


</head>



<body>



<header class="site-header">


<a href="/" class="logo">

<img src="/logo.svg">

</a>


</header>




<div class="action-bar">


<div></div>


<div class="actions">

${rightUI}

</div>


</div>




<main>

${c}

</main>




<footer class="site-footer">


<a class="footer-link"
href="https://mod.indexmod.press">


<span class="footer-dot"></span>


<span class="footer-text">

xx лет

</span>


</a>


</footer>



</body>


</html>

`;

}





function escapeHtml(str = "") {


return String(str)

.replace(/&/g,"&amp;")

.replace(/"/g,"&quot;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;");

}
