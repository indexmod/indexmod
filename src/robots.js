import { DOMAIN } from "./meta.js";

export function robots() {
  return `User-agent: *
Allow: /
Allow: /new
Allow: /edit/

Disallow: /admin/
Disallow: /_admin/
Disallow: /_get/
Disallow: /_list
Disallow: /_save
Disallow: /_rebuild
Disallow: /_prompt
Disallow: /_media

Sitemap: ${DOMAIN}/sitemap.xml
Host: indexmod.press
`;
}
