---
layout: none
title: Скринсейвер
permalink: marquee
---

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Бегущая строка</title>
    <style>
        @font-face {
            font-family: 'Helvetica';
            src: local('Helvetica'), url('/fonts/Helvetica.woff2') format('woff2');
        }

        body {
            background: black;
            color: white;
            font-family: 'Helvetica', sans-serif;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }

        .marquee {
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            position: absolute;
        }

        .marquee span {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 20s linear infinite;
        }

        @keyframes marquee {
            from { transform: translateX(100%); }
            to { transform: translateX(-100%); }
        }
    </style>
</head>
<body>
    <div class="marquee">
        <span>
            {% for page in site.pages %}
                {{ page.content | strip_html | truncatewords: 50 }} &nbsp;•&nbsp;
            {% endfor %}
        </span>
    </div>
</body>
</html>
