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
        }

        .fade-in {
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Контейнер для изображения и названия */
        .footer-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 800px;
        }

        .footer-image {
            height: 50px;
            width: auto;
            margin-right: 20px;
        }

        .footer-title {
            font-family: monospace;
            font-size: 30px;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="content-wrapper">
        <div id="token" class="token-container">ЗАГРУЗКА...</div>
        <div class="footer-container">
            <img id="image" src="" alt="Image" class="footer-image">
            <span id="title" class="footer-title"></span>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const tokenContainer = document.getElementById("token");
            const imageElement = document.getElementById("image");
            const titleElement = document.getElementById("title");

            let items = [
                {% for page in site.pages %}
                    {% assign words = page.title | replace: ',', '' | replace: '.', '' | replace: '(', '' | replace: ')', '' | replace: '-', '' | replace: '–', '' | replace: '_', '' | replace: '/', '' | replace: '&', '' | strip | split: " " %}
                    {% assign token = words[0] | replace: '[^a-zA-Z]', '' | slice: 0,3 | upcase %}

                    {% for word in words offset:1 %}
                        {% assign clean_word = word | replace: '[^a-zA-Z]', '' %}
                        {% assign letter = clean_word | slice: 0,1 | upcase %}
                        {% assign token = token | append: letter %}
                    {% endfor %}

                    {% assign img1 = "/images/" | append: page.permalink | append: ".jpg" %}
                    {% assign img2 = "/images/" | append: page.permalink | append: "-1.jpg" %}
                    {% assign final_image = page.image | default: img1 %}

                    {
                        token: "{{ token | strip }}",
                        title: "{{ page.title }}",
                        image: "{{ final_image | default: img2 | default: '/images/black.jpg' }}"
                    },
                {% endfor %}
            ];

            // Перемешиваем массив случайным образом
            items = items.sort(() => Math.random() - 0.5);

            let currentIndex = 0;

            function showNextItem() {
                if (items.length > 0) {
                    let currentItem = items[currentIndex];

                    tokenContainer.innerHTML = currentItem.token;
                    imageElement.src = currentItem.image;
                    titleElement.innerHTML = currentItem.title;

                    tokenContainer.classList.add("fade-in");
                    imageElement.classList.add("fade-in");
                    titleElement.classList.add("fade-in");

                    setTimeout(() => {
                        tokenContainer.classList.remove("fade-in");
                        imageElement.classList.remove("fade-in");
                        titleElement.classList.remove("fade-in");
                    }, 1000);

                    currentIndex = (currentIndex + 1) % items.length;
                }
            }

            showNextItem();
            setInterval(showNextItem, 5000);
        });
    </script>
</body>
