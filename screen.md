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
            color: #d3d3d3;
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
            color: #FFA500;
        }

        .footer-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
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
            <img id="image" class="footer-image" src="" alt="Image" />
            <span id="title" class="footer-title"></span>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const tokenContainer = document.getElementById("token");
            const titleElement = document.getElementById("title");
            const imageElement = document.getElementById("image");

            let items = [
                {% for page in site.pages %}
                {% assign clean_title = page.title
                    | replace: '-', ' '
                    | replace: '.', ' '
                    | replace: '(', ' '
                    | replace: ')', ' '
                    | replace: ',', ' '
                %}
                {% assign words = clean_title | split: ' ' %}
                {% assign first_part = words[0] | slice: 0,4 | upcase %}
                {% assign initials = '' %}
                {% for word in words offset:1 %}
                    {% assign first_letter = word | slice: 0,1 | upcase %}
                    {% assign initials = initials | append: first_letter %}
                {% endfor %}

                {
                    token: "{{ first_part }}{{ initials }}",
                    title: "{{ page.title }}",
                    image: "{{ page.image }}"
                },
                {% endfor %}
            ];

            // Перемешиваем массив случайным образом
            items = items.sort(() => Math.random() - 0.5);

            let currentIndex = 0;

            function showNextItem() {
                if (items.length > 0) {
                    let currentItem = items[currentIndex];

                    // Скрываем текущие элементы
                    tokenContainer.style.opacity = 0;
                    titleElement.style.opacity = 0;
                    imageElement.style.opacity = 0;

                    // Обновляем текстовые элементы и картинку
                    tokenContainer.innerHTML = currentItem.token;
                    titleElement.innerHTML = currentItem.title;
                    imageElement.src = currentItem.image || '';

                    // Плавно показываем новые элементы
                    setTimeout(() => {
                        tokenContainer.style.opacity = 1;
                        titleElement.style.opacity = 1;
                        imageElement.style.opacity = 1;
                    }, 100);

                    // Следующий элемент
                    currentIndex = (currentIndex + 1) % items.length;
                }
            }

            showNextItem();
            setInterval(showNextItem, 9000);
        });
    </script>
</body>
