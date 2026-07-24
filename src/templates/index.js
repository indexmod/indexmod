export default function indexTemplate(pages = []) {


  const groups = {};


  pages.forEach(p => {

    const letter =
      (p.title[0] || "#").toUpperCase();


    if (!groups[letter]) {
      groups[letter] = [];
    }


    groups[letter].push(p);

  });



  const letters =
    Object.keys(groups).sort();



  const cols =
    [[], [], []];


  letters.forEach((letter, i)=>{

    cols[i % 3].push(letter);

  });



  let html = `

<h1></h1>

<div class="grid">

`;



  cols.forEach(col=>{


    html += `

<div class="col">

`;


    col.forEach(letter=>{


      html += `

<div class="letter">
${letter}
</div>

`;


      groups[letter].forEach(p=>{


        html += `

<a href="/${p.slug}">
${p.title}
</a>

`;


      });


    });


    html += `

</div>

`;



  });



  html += `

</div>

`;


  return html;

}
