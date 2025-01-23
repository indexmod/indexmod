---
layout: none
title: Скринсейвер
permalink: screen
exclude: true
---

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Бегущая строка</title>
    <style>
        body {
            background: black;
            color: white;
            font-family: Arial, sans-serif;
            margin: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            height: 100vh;
            width: 100vw;
        }

        .marquee {
            white-space: nowrap;
            font-size: 300px;
            font-weight: bold;
            text-transform: uppercase;
            position: absolute;
            left: 100vw;
            animation: marquee 90s linear infinite;
        }

        @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-200vw); }
        }
    </style>
</head>
<body>
    <div class="marquee">
        {% for page in site.pages %}
            {{ page.title | upcase }} &nbsp;•&nbsp;
        {% endfor %}
    </div>
</body>
