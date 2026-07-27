export default function articleTemplate(page) {

const content =
page.illustration
?
replaceAutoMediaPlaceholder(
page.html || "",
page.illustration
)
:
removeAutoMediaPlaceholder(
page.html || "");

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



function replaceAutoMediaPlaceholder(html, illustration) {


return html.replace(
/<p>\s*\{\{automedia:image\}\}\s*<\/p>/i,
illustration
);


}



function removeAutoMediaPlaceholder(html) {


return html.replace(
/<p>\s*\{\{automedia:image\}\}\s*<\/p>/i,
""
);


}
