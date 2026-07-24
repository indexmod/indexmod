export default `

<h1 id="t"></h1>

<div id="c"></div>


<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>


<script>

const slug =
location.pathname
.split("/")
.filter(Boolean)
.pop();



fetch("/_get/" + slug)

.then(r => r.json())

.then(d => {


document.getElementById("t")
.innerText =
d.title || slug;



const container =
document.getElementById("c");



// Markdown → HTML

let html =
marked.parse(
d.content || ""
);



// AUTO IMAGE LINKS

html =
html.replace(

/(^|\\s)(https?:\\/\\/[^\\s]+?\\.(jpg|jpeg|png|gif|webp|svg))(\\s|$)/gi,

'$1<img src="$2" style="max-width:100%;display:block;margin:20px 0;">$4'

);



// FOOTNOTES

html =
html.replace(

/\\[(\\d+)\\]/g,

'<span class="fn">[$1]</span>'

);



container.innerHTML =
html;


});


</script>

`;
