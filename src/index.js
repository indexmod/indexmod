import { renderPage } from "./render.js";
import { getFile, savePage, list } from "./storage.js";
import { parse } from "./markdown.js";

import indexTemplate from "./templates/index.js";
import articleTemplate from "./templates/article.js";
import editorTemplate from "./templates/editor.js";


export default {
  async fetch(req, env) {

    const url = new URL(req.url);
    const path = url.pathname;

    try {

      // ======================
      // STATIC
      // ======================

      if (path === "/logo.svg") {
        const file = await env.PAGES.get("logo.svg");
        return new Response(await file.arrayBuffer(), {
          headers: {
            "Content-Type": "image/svg+xml"
          }
        });
      }


      if (path === "/favicon.svg") {
        const file = await env.PAGES.get("favicon.svg");
        return new Response(await file.arrayBuffer(), {
          headers: {
            "Content-Type": "image/svg+xml"
          }
        });
      }


      // ======================
      // API LIST
      // ======================

      if (path === "/_list") {

        return Response.json(
          await list(env)
        );

      }


      // ======================
      // API GET
      // ======================

      if (path.startsWith("/_get/")) {

        const slug = path.split("/").pop();

        const md = await getFile(env, slug);

        if (!md) {
          return Response.json(
            {error:"not found"},
            {status:404}
          );
        }

        return Response.json(
          parse(md)
        );

      }


      // ======================
      // API SAVE
      // ======================

      if (path === "/_save") {

        const body = await req.json();

        await savePage(
          env,
          body.slug,
          body.content
        );

        return new Response("ok");

      }


      // ======================
      // PAGES
      // ======================

      if (path === "/") {

        return renderPage(
          indexTemplate,
          `<a href="/new">New</a>`
        );

      }


      if (path === "/new") {

        return renderPage(
          editorTemplate,
          `<button onclick="save()">Save</button>`
        );

      }


      if (path.startsWith("/edit/")) {

        return renderPage(
          editorTemplate,
          `<button onclick="save()">Save</button>`
        );

      }


      if (path.startsWith("/") && !path.startsWith("/_")) {

        return renderPage(
          articleTemplate,
          `<a href="/edit/${path.slice(1)}">Edit</a>`
        );

      }


      return new Response("404", {
        status:404
      });


    } catch(e) {

      return new Response(
        e.message,
        {status:500}
      );

    }

  }
};
