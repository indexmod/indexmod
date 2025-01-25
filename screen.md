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
            color: #d3d3d3; /* Светло-серый цвет текста */
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
            color: #FFA500; /* Оранжевый цвет для токена */
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
                    {
                        token: "{{ page.title | slice: 0, 4 | upcase }}",
                        title: "{{ page.title }}",
                        image: "{{ page.image }}"  // Добавляем картинку для каждого элемента
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
                    imageElement.src = currentItem.image || ''; // Обновляем картинку

                    // Плавно показываем новые элементы
                    setTimeout(() => {
                        tokenContainer.style.opacity = 1;
                        titleElement.style.opacity = 1;
                        imageElement.style.opacity = 1;
                    }, 100); // Появление через 100ms

                    // Следующий элемент
                    currentIndex = (currentIndex + 1) % items.length;
                }
            }

            showNextItem();
            setInterval(showNextItem, 9000); // Переход к следующему элементу каждые 9 секунд
        });
    </script>
</body>
