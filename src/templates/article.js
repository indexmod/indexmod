export default function articleTemplate(page) {

return `

<article>

<h1>
${page.title || page.slug}
</h1>


<div class="content">

${page.html || ""}

</div>


</article>

`;

}
