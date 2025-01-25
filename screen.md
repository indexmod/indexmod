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
            color: #e1e1e1;
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
            color: #d97f1a;
        }

        .fade-in {
            animation: fadeIn 5s ease-in-out;
        }

        .fade-out {
            animation: fadeOut 5s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        /* Контейнер для изображения и названия */
        .footer-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
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
        }

        .footer-content {
            font-size: 16px;
            max-width: 100%;
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 3em;
        }
    </style>
</head>
<body>
    <div class="content-wrapper">
        <div id="token" class="token-container">ЗАГРУЗКА...</div>
        <div class="footer-container">
            <img id="image" src="" alt="Image" class="footer-image">
            <span id="title" class="footer-title"></span>
            <div id="content" class="footer-content">{{ page.content | truncate: 100 }}</div>
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
                    {% assign words = page.title | replace: ',', '' | replace: '.', '' | replace: '(', '' | replace: ')', '' | replace: '-', '' | replace: '–', '' | replace: '_', '' | replace: '/', '' | replace: '&', '' | strip | split: " " %}
                    {% assign token = words[0] | replace: '[^a-zA-Z]', '' | slice: 0,4 | upcase %}

                    {% for word in words offset:1 %}
                        {% assign clean_word = word | replace: '[^a-zAZ]', '' %}
                        {% assign letter = clean_word | slice: 0,1 | upcase %}
                        {% assign token = token | append: letter %}
                    {% endfor %}

                    {% assign img1 = "/images/" | append: page.permalink | append: ".jpg" %}
                    {% assign img2 = "/images/" | append: page.permalink | append: "-1.jpg" %}
                    {% assign final_image = page.image | default: img1 %}

                    {
                        token: "{{ token | strip }}",
                        title: "{{ page.title }}",
                        content: "{{ page.content | truncate: 100 }}",
                        images: [ "{{ final_image }}", "{{ img2 }}"]
                    },
                {% endfor %}
            ];

            // Функция для проверки существования изображения
            function imageExists(url) {
                return fetch(url, { method: 'HEAD' })
                    .then(response => response.ok)
                    .catch(() => false);
            }

            items = items.sort(() => Math.random() - 0.5);
            let currentIndex = 0;

            function showNextItem() {
                if (items.length > 0) {
                    let currentItem = items[currentIndex];
                    let imageUrls = currentItem.images;
                    let imageIndex = 0;

                    function showImageWithFade(imageUrl) {
                        imageExists(imageUrl).then(exists => {
                            if (exists) {
                                imageElement.src = imageUrl;
                            } else {
                                imageElement.src = '/images/logo.png';
                            }
                            imageElement.classList.add("fade-in");
                            setTimeout(() => {
                                imageElement.classList.remove("fade-in");
                            }, 5000);
                        });
                    }

                    showImageWithFade(imageUrls[imageIndex]);
                    setTimeout(() => {
                        imageIndex = 1;
                        showImageWithFade(imageUrls[imageIndex]);
                    }, 5000);

                    tokenContainer.innerHTML = currentItem.token;
                    titleElement.innerHTML = currentItem.title;
                    contentElement.innerHTML = currentItem.content;

                    currentIndex = (currentIndex + 1) % items.length;
                }
            }

            showNextItem();
            setInterval(showNextItem, 10000);
        });
    </script>
</body>
