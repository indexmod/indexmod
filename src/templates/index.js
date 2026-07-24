export default `

<h1></h1>

<div id="list">

<div id="preload">
Loading topics Indexmod Fashion and Art
</div>

</div>


<script>

fetch("/_list")

.then(r => r.json())

.then(items => {


const container =
document.getElementById("list");


if (!items.length) {

container.innerHTML =
"no pages yet";

return;

}



// группировка по первой букве

const groups = {};


items.forEach(p => {

const letter =
(p.title[0] || "#").toUpperCase();


if (!groups[letter])
groups[letter] = [];


groups[letter].push(p);

});



const letters =
Object.keys(groups).sort();



// три колонки

const cols =
[[], [], []];


letters.forEach((l, i)=>{

cols[i % 3].push(l);

});



container.innerHTML =
'<div class="grid"></div>';



const grid =
container.firstChild;



cols.forEach(colLetters=>{


const col =
document.createElement("div");


col.className =
"col";



colLetters.forEach(letter=>{


const h =
document.createElement("div");


h.className =
"letter";


h.textContent =
letter;


col.appendChild(h);



groups[letter].forEach(p=>{


const a =
document.createElement("a");


a.href =
"/" + p.slug;


a.textContent =
p.title;


col.appendChild(a);


});


});



grid.appendChild(col);



});


});


</script>

`;
