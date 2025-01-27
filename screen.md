---
layout: screen
title: Indexmod Screensaver
permalink: screen
exclude: true
image: /logo.png
---

<div class="content-wrapper">
        <div id="token" class="token-container">One sec...</div>
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
                    token: "{{ forloop.index }}",  // Порядковый номер
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
                    imageElement.src = currentItem.image || '/logo.png';

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
