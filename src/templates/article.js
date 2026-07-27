export default function articleTemplate(page) {

const content =
page.illustration
?
insertIllustration(
page.html || "",
page.illustration
)
:
page.html || "";

return `

<article>

<h1>
${page.title || page.slug || ""}
</h1>


<div class="content">

${content}

</div>


</article>

`;

}



function insertIllustration(html, illustration) {


const paragraphEnd =
html.indexOf("</p>");


if(paragraphEnd === -1)
return illustration + html;


const insertAt =
paragraphEnd + 4;


return (
html.slice(0, insertAt) +
illustration +
html.slice(insertAt)
);


}
