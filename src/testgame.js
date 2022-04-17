const PNC = require('./engine.js');

NAME("PNC Test Adventure")
AUTHOR("Chronic")
AUTHOR("Wiiseguy")
SIZE(640, 400)
FONTSIZE(32)
//NOINTRO()

STARTROOM("LeftRoom")

// Room - Left Room
IMAGE("LeftRoomBG", require('url:./data/TestAdv/LeftRoom/LeftRoomBG.png'))
IMAGE("TestActor", require('url:./data/TestAdv/LeftRoom/TestActor.png'))
IMAGE("Shelf", require('url:./data/TestAdv/LeftRoom/Shelf.png'))

// Room - Right Room
IMAGE("RightRoomBG", require('url:./data/TestAdv/RightRoom/RightRoomBG.png'))
IMAGE("Painting", require('url:./data/TestAdv/RightRoom/Painting.png'))
IMAGE("WallSafe", require('url:./data/TestAdv/RightRoom/WallSafe.png'))

// Sound effects and stuff
SOUND("menu", require("url:./data/menu.wav"))

// Global vars (just normal js vars)
var hasTestActorMoved = false
var hasCheese = false

// Animations
ANIMATION("iBatFlap", "iBatStrip", 200, [
    [0, 0, 24, 19],
    [25, 0, 49, 19],
])

// ACTOR("someGlobalActor", {
//     x: 490,
//     y: 320,
//     image: 'TestActor'
// })

/*
    Left Room Puzzle:
        TestActor is in the way of the closet door, A mouse needs to be lured out
        of the mousehole to scare TestActor out of the room.
*/

ROOM("LeftRoom", () => {
    BACKGROUND("LeftRoomBG")

    HOTSPOT("gotoCloset", 347, 114, 442, 307)
    HOTSPOT("gotoRightRoom",610, 0, 640, 400)
    HOTSPOT("mouseHole",175, 290, 195, 310)

    ENTER(() => {
        LOOPSOUND("theme1")
    })

    ACTOR("TestActor", {
        x: 370,
        y: 160,
        image: "TestActor"
    })

    ACTOR("Shelf", {
        x: 67,
        y: 219,
        image: "Shelf"
    })

    VERB('look', "TestActor", () => {
        SHOWTEXT("A TestActor")
    })

    VERB('look', "mouseHole", () => {
        SHOWTEXT("I think i hear something moving around in there")
        WAIT(1300)
        LookAtMouseHole()
    })

    VERB('use', "mouseHole", () => {
        if (hasCheese) {
            SHOWTEXT("Maybe the little thing likes cheese")
            WAIT(1000)
            SHOWACTOR("Cheese")
            WAIT(1000)
            SHOWACTOR("MouseSmall")
            WAIT(500)
            SHOWTEXT("AHH! A MOUSE!!")
            MOVEACTOR("TestActor", 700, 160, 1000, true) // last param is wait
        }
        else {
            SHOWTEXT("I don't think i should put my hand in here, it looks hungry.")
        }
    })

    VERB('use', "gotoRightRoom", () => {
        GOTO("RightRoom")
    })


    function LookAtMouseHole() {
        SHOWACTOR("MouseLarge")
        SHOWTEXT("Holy... That thing is huge!")
    }
})


ROOM("RightRoom", () => {
    BACKGROUND("RightRoomBG")

    ACTOR("WallSafe", {
        x: 285,
        y: 127,
        image: "WallSafe"
    })

    ACTOR("Painting", {
        x: 266,
        y: 95,
        image: "Painting"
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

