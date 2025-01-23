---
layout: none
title: Скринсейвер
permalink: screen
exclude: true
---

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Скринсейвер</title>
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
        }

        .content-container {
            font-size: 160px;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .fade-in {
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
</head>
<body>
    <div id="content" class="content-container">ЗАГРУЗКА...</div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const contentContainer = document.getElementById("content");
            let tokens = [
                {% for page in site.pages %}
                    {% assign words = page.title | replace: ',', '' | replace: '.', '' | replace: '(', '' | replace: ')', '' | replace: '-', '' | replace: '–', '' | replace: '_', '' | replace: '/', '' | replace: '&', '' | strip | split: " " %}
                    {% assign token = words[0] | replace: '[^a-zA-Z]', '' | slice: 0,3 | upcase %}

                    {% for word in words offset:1 %}
                        {% assign clean_word = word | replace: '[^a-zA-Z]', '' %}
                        {% assign letter = clean_word | slice: 0,1 | upcase %}
                        {% assign token = token | append: letter %}
                    {% endfor %}

                    "{{ token | strip }}",
                {% endfor %}
            ];

            let currentIndex = 0;

            function showNextToken() {
                if (tokens.length > 0) {
                    contentContainer.innerHTML = tokens[currentIndex];
                    contentContainer.classList.add("fade-in");

                    setTimeout(() => contentContainer.classList.remove("fade-in"), 1000);

                    currentIndex = (currentIndex + 1) % tokens.length;
                }
            }

            showNextToken();
            setInterval(showNextToken, 5000);
        });
    </script>
</body>
