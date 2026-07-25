export default function layout(
  c,
  rightUI = ""
) {

return `

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


<a class="footer-link" href="https://mod.indexmod.press">


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




function css(){

return `


*{
box-sizing:border-box;
}



html,
body{

margin:0;
padding:0;

}



body{

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



.site-header{

display:flex;

align-items:flex-start;

margin-bottom:20px;

}



.logo img{

height:250px;

display:block;

animation:pulse 4s infinite ease-in-out;

}



@keyframes pulse{

0%{
transform:scale(1);
}

50%{
transform:scale(1.04);
}

100%{
transform:scale(1);
}

}



.action-bar{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:40px;

}



.actions{

font-size:22px;

}



.actions a,
.actions button{

color:#1a73e8;

text-decoration:none;

cursor:pointer;

}



.actions a:hover,
.actions button:hover{

text-decoration:underline;

}



h1{

font-size:48px;

font-weight:normal;

line-height:1.2;

margin:0 0 40px;

}



h2{

font-size:32px;

font-weight:normal;

margin-top:50px;

}



.content{

max-width:900px;

}



.content p{

margin:0 0 30px;

}



.content table{

border-collapse:collapse;

width:100%;

margin:40px 0;

}



.content th,
.content td{

border-bottom:1px solid #ddd;

padding:10px;

text-align:left;

}



.content ul{

margin-bottom:40px;

}



.content blockquote{

border-left:3px solid #000;

padding-left:30px;

font-style:italic;

}



.content code{

font-family:monospace;

font-size:16px;

}



textarea{

width:100%;

height:80vh;

font-family:monospace;

font-size:16px;

border:none;

outline:none;

}



button{

all:unset;

cursor:pointer;

}



.grid{

display:grid;

grid-template-columns:repeat(3,1fr);

gap:40px;

}



.letter{

font-size:90px;

}



.col a{

display:block;

margin:6px 0;

}



a{

color:#1a73e8;

text-decoration:none;

}



a:hover{

text-decoration:underline;

}



img{

max-width:100%;

height:auto;

}



.site-footer{

margin-top:100px;

display:flex;

justify-content:flex-end;

}



.footer-link{

color:violet;

}



.footer-dot{

width:20px;

height:20px;

border-radius:50%;

background:silver;

display:inline-block;

}



.footer-text{

font-family:
Helvetica,
Arial,
sans-serif;

font-weight:900;

}


`;

}
