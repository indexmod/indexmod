---
layout: none
title: Screensaver
permalink: screen
exclude: true
---

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ page.title }}</title>
    <style>
        body {
            background: black;
            color: white;
            font-family: Arial, sans-serif;
            margin: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
            flex-direction: column;
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .token-container {
            font-size: 160px;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            color: orange;
        }

        .fade-in {
            animation: fadeIn 5s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .footer-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            max-width: 800px;
            text-align: center;
        }

        .footer-image {
            height: 50px;
            width: auto;
            margin-bottom: 10px;
        }

        .footer-title {
            font-family: monospace;
            font-size: 30px;
            white-space: nowrap;
            color: lightgray;
        }

        .footer-content {
            font-size: 18px;
            color: lightgray;
            word-wrap: break-word;
            max-width: 80%;
        }
    </style>
</head>
<body>
    <div class="content-wrapper">
        <div id="token" class="token-container">ЗАГРУЗКА...</div>
        <div class="footer-container">
            <img id="image" src="" alt="Image" class="footer-image">
            <span id="title" class="footer-title"></span>
            <p id="content" class="footer-content"></p>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const tokenContainer = document.getElementById("token");
            const imageElement = document.getElementById("image");
            const titleElement = document.getElementById("title");
            const contentElement = document.getElementById("content");

            let items = [
                {% for page in site.pages %}
                    {
                        token: "{{ page.title | slice: 0, 4 | upcase }}",
                        title: "{{ page.title }}",
                        images: ["/images/{{ page.permalink }}.jpg", "/images/{{ page.permalink }}-1.jpg"],
                        content: "{{ page.content | strip_html | truncate: 100 }}"
                    },
                {% endfor %}
            ];

            function showNextItem() {
                if (items.length > 0) {
                    let currentItem = items[Math.floor(Math.random() * items.length)];
                    tokenContainer.innerHTML = currentItem.token;
                    titleElement.innerHTML = currentItem.title;
                    contentElement.innerHTML = currentItem.content;
                    imageElement.src = currentItem.images[0];
                }
            }

            showNextItem();
            setInterval(showNextItem, 10000);
        });
    </script>
</body>
