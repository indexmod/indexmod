export function robots() {

return `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /_admin/
Disallow: /_get/
Disallow: /_list
Disallow: /_save
Disallow: /_rebuild
Disallow: /_prompt

Sitemap: https://indexmod.press/sitemap.xml
`;

}
