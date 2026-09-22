export function robots() {

return `User-agent: *
Allow: /

# Empty topics (Write here... / Write here…) and /edit/ return noindex.
# Keep them crawlable: robots.txt cannot match page text, and blocking
# these URLs would prevent crawlers from seeing their noindex directive.

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
