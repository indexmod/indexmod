# AutoMedia v0.1

Independent CMS media layer for verified, attributed article images.

```js
import { AutoMedia } from "./src/index.js";

const media = new AutoMedia();
const result = await media.insertMedia(articleMarkdown);

console.log(result.article);
```

The MVP searches Wikimedia Commons only. It accepts only CC0, public-domain, CC BY, and CC BY-SA files with metadata supplied by Wikimedia. Image URLs come from the file API response, never from generated guesses. The result includes the direct image URL, author, source page, and license.

Public API:

- `analyzeArticle(markdown)`
- `searchImages(markdown, options)`
- `previewInsertion(markdown, options)`
- `insertMedia(markdown, options)`
