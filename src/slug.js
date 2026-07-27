export function normalizeSlug(value = "") {

return String(value)

.normalize("NFKD")

.replace(/[ßẞ]/g,"ss")

.replace(/[æÆ]/g,"ae")

.replace(/[œŒ]/g,"oe")

.replace(/[øØ]/g,"o")

.replace(/[đĐ]/g,"d")

.replace(/[þÞ]/g,"th")

.replace(/[ðÐ]/g,"d")

.replace(/[łŁ]/g,"l")

.replace(/[\u0300-\u036f]/g,"")

.toLowerCase()

.trim()

.replace(
/[^a-z0-9а-яё\s-]/gi,
""
)

.replace(/\s+/g,"-")

.replace(/-+/g,"-")

.replace(/^-|-$/g,"");

}
