---
permalink: menu
exclude: true
---

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #222;
        color: white;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .button-container {
        display: grid;
        grid-template-columns: repeat(3, 200px);
        grid-template-rows: repeat(3, 100px);
        gap: 10px;
        justify-items: center;
    }
    .button {
        width: 200px;
        height: 100px;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 10px;
        border: none;
        background-color: transparent;
        text-decoration: none;
        color: white;
        cursor: pointer;
        outline: none;
    }
    .button:hover {
        opacity: 0.8;
    }
    .blue { background-color: #3498db; }
    .green { background-color: #2ecc71; }
    .red { background-color: #e74c3c; }
    .yellow { background-color: #f1c40f; }
    .purple { background-color: #9b59b6; }
    .orange { background-color: #e67e22; }
    .pink { background-color: #f39c12; }
    .teal { background-color: #1abc9c; }
    .brown { background-color: #8e44ad; }

    /* Стиль для активной кнопки */
    .active {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
    }
</style>

<div class="button-container">
    <a href="https://www3.nhk.or.jp/nhkworld/en/shows/2032309/?cid=wohk-fb-org_vod_dig_466_dps-202502-001&fbclid=IwY2xjawIMbGpleHRuA2FlbQIxMAABHar-FnnqHdxTQcAsr00_Qqt-ex-Y-HynDXqFxROQAR1F1pAkm_5vdCMh6A_aem_NCTfat0nd5XCZRKgEU0yVw" class="button blue" id="btn1">NHK</a>
    <a href="https://www.example.com" class="button green" id="btn2">2</a>
    <a href="https://www.wikipedia.org" class="button red" id="btn3">3</a>
    <a href="https://www.github.com" class="button yellow" id="btn4">4</a>
    <a href="https://www.stackoverflow.com" class="button purple" id="btn5">5</a>
    <a href="https://www.reddit.com" class="button orange" id="btn6">6</a>
    <a href="https://www.amazon.com" class="button pink" id="btn7">7</a>
    <a href="https://www.twitter.com" class="button teal" id="btn8">8</a>
    <a href="https://www.youtube.com" class="button brown" id="btn9">9</a>
</div>

<script>
    let currentButton = 0;
    const buttons = document.querySelectorAll('.button');

    // Функция для активации текущей кнопки
    function activateButton(index) {
        buttons.forEach(button => button.classList.remove('active'));
        buttons[index].classList.add('active');
    }

    // Навигация с помощью стрелок
    function move(direction) {
        if (direction === 'up' && currentButton >= 3) currentButton -= 3;
        if (direction === 'down' && currentButton <= 5) currentButton += 3;
        if (direction === 'left' && currentButton % 3 !== 0) currentButton -= 1;
        if (direction === 'right' && currentButton % 3 !== 2) currentButton += 1;
        activateButton(currentButton);
    }

    // Обработка клавиш на пульте
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
            case 'Enter':
                window.location.href = buttons[currentButton].href; // Переход по ссылке при нажатии Enter
                break;
        }
    });

    // Изначально активируем первую кнопку
    activateButton(currentButton);
</script>
