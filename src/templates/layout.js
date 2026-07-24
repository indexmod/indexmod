export default function layout(c, rightUI = "") {

return new Response(`
<!doctype html>
<html>

<head>

<meta charset="utf-8">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">

<meta name="viewport" content="width=device-width, initial-scale=1">

<meta name="description" content="Indexmod — evolving fashion and art encyclopedia">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Indexmod Fashion and Art">

<meta name="twitter:card" content="summary_large_image">


<style>

${css()}

</style>

</head>


<body>


<div class="topbar">

<a href="/" class="logo">

<img src="/logo.svg">

</a>


<div class="nav">

${rightUI}

</div>


</div>


${c}


<footer class="site-footer">

<a class="footer-link" href="https://mod.indexmod.press">

<span class="footer-dot"></span>

<span class="footer-text">
xx лет
</span>

</a>

</footer>


</body>

</html>
`,
{
headers:{
"Content-Type":"text/html; charset=utf-8"
}
});

}



// ===============================
// CSS
// ===============================

function css(){

return `

* {
box-sizing:border-box;
}

html,body{
margin:0;
padding:0;
}


body {

font-family:
Georgia,
"Times New Roman",
serif;

font-size:22px;

line-height:1.75;

color:#000;

background:#fff;

max-width:1100px;

margin:0 auto;

padding:100px 40px;

}



.topbar {

display:flex;

justify-content:space-between;

align-items:flex-start;

margin-bottom:40px;

}



.logo img {

height:250px;

display:block;

animation:pulse 4s infinite ease-in-out;

}



@keyframes pulse {

0% {
transform:scale(1);
}

50% {
transform:scale(1.04);
}

100% {
transform:scale(1);
}

}



.nav {

display:flex;

gap:18px;

}



h1 {

font-size:48px;

font-weight:normal;

margin:0 0 40px;

}


h2 {

font-size:28px;

font-weight:normal;

}


a {

color:#1a73e8;

text-decoration:none;

}


a:hover {

text-decoration:underline;

}


button {

all:unset;

cursor:pointer;

color:#1a73e8;

}


textarea {

width:100%;

height:80vh;

font-family:monospace;

font-size:16px;

border:none;

outline:none;

}



.grid {

display:grid;

grid-template-columns:repeat(3,1fr);

gap:40px;

}


.letter {

font-size:90px;

}


.col a {

display:block;

margin:6px 0;

}



img {

max-width:100%;

height:auto;

}



.site-footer {

margin-top:80px;

display:flex;

justify-content:flex-end;

}



.footer-link {

color:violet;

}



.footer-dot {

width:20px;

height:20px;

border-radius:50%;

background:silver;

display:inline-block;

}


.footer-text {

font-family:
Helvetica,
Arial,
sans-serif;

font-weight:900;

}


`;

}
