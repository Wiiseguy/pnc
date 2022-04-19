const PNC = require('./engine.js');

NAME("PNC Test Adventure")
AUTHOR("Chronic")
AUTHOR("Wiiseguy")
SIZE(640, 400)
FONTSIZE(32)
DEBUG()
//NOINTRO()
BGCOLOR('#ff00ff')

STARTROOM("HallWay_Left")

// Room - Left Room
IMAGE("HallWay_LeftBG", require('url:./data/TestAdv/HallWay_Left/HallWay_LeftBG.png'))
IMAGE("TestActor", require('url:./data/TestAdv/HallWay_Left/TestActor.png'))
IMAGE("Shelf", require('url:./data/TestAdv/HallWay_Left/Shelf.png'))

// Room - Right Room
IMAGE("HallWay_RightBG", require('url:./data/TestAdv/HallWay_Right/HallWay_RightBG.png'))
IMAGE("Painting", require('url:./data/TestAdv/HallWay_Right/Painting.png'))
IMAGE("WallSafe", require('url:./data/TestAdv/HallWay_Right/WallSafe.png'))

// Room - Kitchen
IMAGE("KitchenBG", require('url:./data/TestAdv/KitchenRoom/KitchenBG.png'))
IMAGE("FridgeDoorClosed", require('url:./data/TestAdv/KitchenRoom/FridgeDoorClosed.png'))
IMAGE("FridgeDoorOpen", require('url:./data/TestAdv/KitchenRoom/FridgeDoorOpen.png'))
IMAGE("Cheese", require('url:./data/TestAdv/KitchenRoom/Cheese.png'))


// Sound effects and stuff
SOUND("TestActorScream", require("url:./data/TestAdv/HallWay_Left/scream.wav"))

SOUND("menu", require("url:./data/menu.wav"))
SOUND("kitchen", require("url:./data/62215.wav"))
SOUND("bg", require("url:./data/chill.mp3"), { volume: 0.2 }) // Credit: https://www.looperman.com/loops/detail/289801/lenoxbeatmaker-sativaskunk-free-146bpm-jazz-electric-guitar-loop

// Global vars
let hasCheese = false

// Animations
ANIMATION("iBatFlap", "iBatStrip", 200, [
    [0, 0, 24, 19],
    [25, 0, 49, 19],
])


/*
    HallWay_Left Puzzle
        TestActor is in the way of the closet door, A mouse needs to be lured out
        of the mousehole with cheese to scare TestActor out of the room.
*/
ROOM("HallWay_Left", () => {
    let hasTestActorMoved = false

    BACKGROUND("HallWay_LeftBG")

    HOTSPOT("gotoCloset", 347, 114, 442, 307)
    HOTSPOT("gotoHallWay_Right", 550, 0, 640, 400)
    HOTSPOT("mouseHole", 175, 290, 195, 310)

    ONCE(() => {
        LOOPSOUND("bg", { rate: 0.9 + Math.random() / 5 })
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

    ACTOR("Cheese", {
        x: 170,
        y: 310,
        image: "Cheese",
        visible: false
    })

    CLICK("TestActor", () => {
        //PLAYSOUND("kitchen", { rate: 0.5 + Math.random() })
        SHOWTEXT("They don't seem interested in talking to me.")
    })

    CLICK("mouseHole", () => {
        if (hasCheese) {
            SHOWTEXT("Maybe the little thing likes cheese.")
            SHOWACTOR("Cheese")
            WAIT(1000)
            SHOWACTOR("Mouse")
            WAIT(500)
            PLAYSOUND("TestActorScream")
            SHOWTEXT("AHH! A MOUSE!!")
            MOVEACTOR("TestActor", 700, 160, 1000, true, { easing: 'easeInElastic(1, .6)' })
            hasTestActorMoved = true
        }
        else {
            SHOWTEXT("I hear something moving around in there.")
        }
    })

    CLICK("gotoCloset", () => {
        if (hasTestActorMoved) {
            SHOWTEXT("COMING SOON (TM)")
        }
        else {
            SHOWTEXT("TestActor is in the way")
        }
    })

    CLICK("gotoHallWay_Right", () => {
        GOTO("HallWay_Right")
    })
})


/*
    HallWay_Right Puzzle
        Move painting, open safe with code from closet
*/
ROOM("HallWay_Right", () => {
    BACKGROUND("HallWay_RightBG")

    HOTSPOT("gotoHallway_Left", 0, 0, 80, 400)
    HOTSPOT("gotoKitchenRoom", 582, 139, 623, 382)

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

    VERB('use', "WallSafe", () => {
        SHOWTEXT("Its not safe any more.. ehehehe")
    })

    CLICK("Painting", () => {
        MOVEACTOR("Painting", 266, 185, 10, true, {easing: 'easeInQuart'})
        SHOWTEXT("Whoops!")
    })

    CLICK("gotoHallway_Left", () => {
        GOTO("HallWay_Left")
    })

    CLICK("gotoKitchenRoom", () => {
        GOTO("KitchenRoom")
    })
})


ROOM("KitchenRoom", () => {
    /*
        Kitchen Puzzle
            TBD
    */
    BACKGROUND("KitchenBG")

    HOTSPOT("gotoHallWay_Right", 14, 135, 54, 387)

    ACTOR("FridgeDoorClosed", {
        x: 101,
        y: 210,
        image: "FridgeDoorClosed"
    })

    ACTOR("FridgeDoorOpen", {
        x: 71,
        y: 210,
        image: "FridgeDoorOpen",
        visible: false
    })

    ACTOR("Cheese", {
        x: 126,
        y: 229,
        image: "Cheese",
        visible: false
    })

    CLICK("gotoHallWay_Right", () => {
        GOTO("HallWay_Right")
    })

    CLICK("FridgeDoorClosed", () => {
        HIDEACTOR("FridgeDoorClosed")
        SHOWACTOR("FridgeDoorOpen")
        if (!hasCheese) {
            SHOWACTOR("Cheese")
        }
    })

    CLICK("FridgeDoorOpen", () => {
        HIDEACTOR("FridgeDoorOpen")
        SHOWACTOR("FridgeDoorClosed")
        HIDEACTOR("Cheese")
    })

    VERB('use', "Cheese", () => {
        HIDEACTOR("Cheese")
        hasCheese = true
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

