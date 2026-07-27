import { MemoryCache } from "./cache.js";
import { analyzeMarkdown } from "./parser.js";
import { WikimediaCommonsProvider } from "./providers/wikimedia.js";
import { insertAfterFirstParagraph, renderHtmlImage, renderMarkdownImage } from "./renderer.js";

export class AutoMedia {
  constructor({ cache = new MemoryCache(), providers } = {}) {
    this.cache = cache;
    this.providers = providers || [new WikimediaCommonsProvider({ cache })];
  }

  analyzeArticle(markdown) {
    return analyzeMarkdown(markdown);
  }

  async searchImages(markdown, options = {}) {
    const analysis = this.analyzeArticle(markdown);
    const queries = options.query ? [options.query] : analysis.queries;

    for (const query of queries) {
      let images = [];

      try {
        const results = await Promise.all(
          this.providers.map((provider) => provider.search(query, options))
        );
        images = results.flat();
      } catch (error) {
        console.error("AutoMedia search failed", { query, error });
      }

      if (images.length) return { analysis, query, images };
    }

    return { analysis, query: "", images: [] };
  }

  async previewInsertion(markdown, options = {}) {
    const result = await this.searchImages(markdown, options);
    const image = options.image || result.images[0];
    if (!image) return { ...result, image: null, markdown: null, html: null };

    const markdownBlock = renderMarkdownImage(image, { alt: options.alt });
    return {
      ...result,
      image,
      markdown: insertAfterFirstParagraph(markdown, markdownBlock),
      html: renderHtmlImage(image, { alt: options.alt })
    };
  }

  async insertMedia(markdown, options = {}) {
    const preview = await this.previewInsertion(markdown, options);
    return { article: preview.markdown, image: preview.image, analysis: preview.analysis };
  }
}

export { MemoryCache } from "./cache.js";
export { WikimediaCommonsProvider } from "./providers/wikimedia.js";
export { renderHtmlImage, renderMarkdownImage } from "./renderer.js";
