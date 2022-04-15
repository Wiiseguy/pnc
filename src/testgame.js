const PNC = require('./engine.js');

NAME("James Bond's Amazing Adventure!")
AUTHOR("Chronic")
AUTHOR("Wiiseguy")
SIZE(640, 400)
FONTSIZE(32)
//NOINTRO()

STARTROOM("firstRoom")

//IMAGE("iIntroWalkStrip", "anim-walks.jpg")
IMAGE("bgCrossroads", require('url:./data/James/Crossroads/bgCrossroads.png'))
IMAGE("ijamesGun", require('url:./data/James/Crossroads/jamesGun.png'))
IMAGE("ijamesGun2", require('url:./data/James/Crossroads/jamesGun2.png'))

IMAGE("roomColor", require('url:./data/James/BondResidence/roomColor.png'))
// Spoken samples

// Music

// Sound effects and stuff
SOUND("menu", require("url:./data/menu.wav"))

// Global vars (just normal js vars)
var hasGateKey = false
var HGateLocked = true


// Animations
ANIMATION("iBatFlap", "iBatStrip", 200, [
    [0, 0, 24, 19],
    [25, 0, 49, 19],
])

ACTOR("someGlobalActor", {
    x: 0,
    y: 0,
    image: 'whoknows'
})

ROOM("firstRoom", () => {

    BACKGROUND("bgCrossroads")
    DESCRIPTION("Crossroads")

    HOTSPOT("sign1", 150, 60, 270, 130)
    HOTSPOT("sign2",290, 70, 420, 130)

    ACTOR("james", {
        x: 150,
        y: 165,
        image: "ijamesGun"
    })

    VERB('look', "sign1", () => {
        SHOWTEXT("The Bond Residence?")
        WAIT(1300)
        SHOWTEXT("I wonder where this path will take me!")

        PlayPong()
    })

    VERB('use', "sign1", () => {
        MOVEACTOR("james", -277, 165, 1000, true) // last param is wait
        GOTO("roomA")
    })

    ENTER(() => {
        LOOPSOUND("theme1")
        MOVEACTOR("james", 150, 165)
        CHANGEIMAGE("james", ijamesGun)
    })

    function PlayPong() {
        SHOWACTOR("pongBat")
        // etc.
        SHOWTEXT("YIPES!!!")
    }
})


ROOM("otherroom", () => {

    BACKGROUND("roomColor")
    DESCRIPTION("Crossroads")

    HOTSPOT("sign1", 150, 60, 270, 130)
    HOTSPOT("sign2",290, 70, 420, 130)

    ACTOR("james", {
        x: 150,
        y: 165,
        image: "ijamesGun2"
    })
})



// // Custom test
// let radius = 50;
// let isMouseDown = false;
// let lastKey = ''

// CUSTOM_INIT(ctx => {
//     let { p5, canvas } = ctx;

//     canvas.mousePressed(e => {
//         isMouseDown = true;
//     });
//     canvas.mouseReleased(e => {
//         isMouseDown = false;
//     });
//     canvas.mouseWheel(e => {
//         radius += e.deltaY / 20;
//         radius = p5.constrain(radius, 1, 1000);
//     });

//     document.addEventListener('keypress', e => {
//         console.log('Key pressed:', e);
//         lastKey = e.key;
//     })

//     p5.noStroke();
// })

// CUSTOM_DRAW(ctx => {
//     let { p5, canvas, gameInfo } = ctx;

//     if (p5.mouseX >= 0 && p5.mouseX <= canvas.width && p5.mouseY >= 0 && p5.mouseY <= canvas.height) {
//         if (isMouseDown) { 
//             if (gameInfo.images[0]) {
//                 p5.image(gameInfo.images[0].image, p5.mouseX - radius, p5.mouseY - radius, radius * 2, radius * 2);
//             }
//             p5.circle(p5.mouseX, p5.mouseY, radius)
//             p5.fill(Math.random() * 255, Math.random() * 255, Math.random() * 255)
//             p5.text(lastKey, p5.mouseX, p5.mouseY) // Press a key to change it!
//         }
//     }
//     else {
//         isMouseDown = false;
//     }
//})

