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
        user-select: none;
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
        font-size: 70px;
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
        pointer-events: auto;
    }
    .active {
        color: white;
    }
    .red { background-color: #E32636; }
    .yellow { background-color: #FCE300; }
    .green { background-color: #014421; }
</style>

<div class="button-container">
    <a href="https://www3.nhk.or.jp/nhkworld/en/shows/2032309/?cid=wohk-fb-org_vod_dig_466_dps-202502-001&fbclid=IwY2xjawIMbGpleHRuA2FlbQIxMAABHar-FnnqHdxTQcAsr00_Qqt-ex-Y-HynDXqFxROQAR1F1pAkm_5vdCMh6A_aem_NCTfat0nd5XCZRKgEU0yVw" class="button red" id="btn1">NHK</a>
    <a href="https://pillowpile-studio-mails.tilda.ws/mail-nr-one" class="button yellow" id="btn2">Pi-pa</a>
    <a href="https://liminal.indexmod.xyz" class="button green" id="btn3">Lim</a>
    <div class="button"></div>
    <div class="button"></div>
    <div class="button"></div>
    <div class="button"></div>
    <div class="button"></div>
    <div class="button"></div>
</div>

<script>
    let currentButton = 0;
    const buttons = document.querySelectorAll('.button');

    function activateButton(index) {
        buttons.forEach(button => button.classList.remove('active'));
        buttons.forEach(button => button.style.color = 'black');
        if (buttons[index].href) {
            buttons[index].classList.add('active');
            buttons[index].style.color = 'white';
        }
    }

    function move(direction) {
        let row = Math.floor(currentButton / 3);
        let col = currentButton % 3;

        if (direction === 'up' && row > 0) currentButton -= 3;
        if (direction === 'down' && row < 2) currentButton += 3;
        if (direction === 'left' && col > 0) currentButton -= 1;
        if (direction === 'right' && col < 2) currentButton += 1;

        activateButton(currentButton);
    }

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
            case 'NumpadEnter':
                if (buttons[currentButton].href) {
                    window.location.href = buttons[currentButton].href;
                }
                break;
        }
    });

    activateButton(currentButton);
</script>
