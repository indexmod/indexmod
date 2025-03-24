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
        font-size: 100px;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: none;
        background-color: black;
        text-decoration: none;
        color: black;
        cursor: pointer;
        outline: none;
    }
    .active {
        color: white;
    }
    .red { background-color: #E32636; }
    .yellow { background-color: #FCE300; }
    .green { background-color: #014421; }
</style>

<div class="button-container">
    <a href="https://www3.nhk.or.jp/nhkworld/en/shows/2032309/?cid=wohk-fb-org_vod_dig_466_dps-202502-001&fbclid=IwY2xjawIMbGpleHRuA2FlbQIxMAABHar-FnnqHdxTQcAsr00_Qqt-ex-Y-HynDXqFxROQAR1F1pAkm_5vdCMh6A_aem_NCTfat0nd5XCZRKgEU0yVw" class="button red" id="btn1">1</a>
    <a href="https://pillowpile-studio-mails.tilda.ws/mail-nr-one" class="button yellow" id="btn2">2</a>
    <a href="https://www.wikipedia.org" class="button green" id="btn3">3</a>
</div>

<script>
    let currentButton = 0;
    const buttons = document.querySelectorAll('.button');

    function activateButton(index) {
        buttons.forEach(button => button.classList.remove('active'));
        buttons.forEach(button => button.style.color = 'black');
        buttons[index].classList.add('active');
        buttons[index].style.color = 'white';
    }

    function move(direction) {
        if (direction === 'left' && currentButton > 0) currentButton -= 1;
        if (direction === 'right' && currentButton < buttons.length - 1) currentButton += 1;
        activateButton(currentButton);
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
            case 'Enter':
            case 'NumpadEnter':
                window.location.href = buttons[currentButton].href;
                break;
        }
    });

    activateButton(currentButton);
</script>
