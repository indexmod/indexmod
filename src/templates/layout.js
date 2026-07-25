export default function layout(
  c,
  rightUI = "",
  meta = {}
) {


return `

<!doctype html>

<html>

<head>

<meta charset="utf-8">


<link rel="icon" href="/favicon.svg" type="image/svg+xml">


<meta name="viewport" content="width=device-width, initial-scale=1">



<title>

${escapeHtml(
meta.title ||
"Indexmod"

)}

</title>



<meta name="description" content="${
escapeHtml(
meta.description ||
"Indexmod — fashion and art encyclopedia"
)
}">



${og(meta)}



<link rel="stylesheet" href="/styles/base.css">

<link rel="stylesheet" href="/styles/view.css">

<link rel="stylesheet" href="/styles/editor.css">

<link rel="stylesheet" href="/styles/index.css">



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





// ===============================
// OPEN GRAPH
// ===============================


function og(meta = {}) {


const title =
meta.title ||
"Indexmod Fashion and Art";



const description =
meta.description ||
"Indexmod — fashion and art encyclopedia";



const url =
meta.slug
?
`https://indexmod.press/${meta.slug}`
:
"https://indexmod.press";



return `


<meta property="og:type" content="article">


<meta property="og:site_name" content="Indexmod Fashion and Art">


<meta property="og:title"
content="${escapeHtml(title)}">


<meta property="og:description"
content="${escapeHtml(description)}">


<meta property="og:url"
content="${url}">



<meta name="twitter:card"
content="summary_large_image">


<meta name="twitter:title"
content="${escapeHtml(title)}">


<meta name="twitter:description"
content="${escapeHtml(description)}">



${
meta.image
?

`

<meta property="og:image"
content="${meta.image}">


<meta name="twitter:image"
content="${meta.image}">

`

:

""

}


`;

}





function escapeHtml(str = "") {


return String(str)

.replace(/&/g,"&amp;")

.replace(/"/g,"&quot;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;");


}
