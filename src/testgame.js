const PNC = require('./engine.js');

NAME("PNC Test Adventure")
AUTHOR("Chronic")
AUTHOR("Wiiseguy")
SIZE(640, 400)
FONTSIZE(32)
//DEBUG()
//NOINTRO()
BGCOLOR('#ff00ff')

//STARTROOM("Hallway_Left")
STARTROOM("Bedroom")

// Room - Bedroom
IMAGE("BedroomBG", require('url:./data/TestAdv/Bedroom/Bedroom.png'))
IMAGE("Box", require('url:./data/TestAdv/Bedroom/Box.png'))

// Room - Left Room
IMAGE("Hallway_LeftBG", require('url:./data/TestAdv/Hallway_Left/Hallway_LeftBG.png'))
IMAGE("TestActor", require('url:./data/TestAdv/Hallway_Left/TestActor.png'))
IMAGE("Shelf", require('url:./data/TestAdv/Hallway_Left/Shelf.png'))
IMAGE("Fidget", require('url:./data/TestAdv/Hallway_Left/Fidget.png'))

// Room - Right Room
IMAGE("Hallway_RightBG", require('url:./data/TestAdv/HallWay_Right/HallWay_RightBG.png'))
IMAGE("Painting", require('url:./data/TestAdv/HallWay_Right/Painting.png'))
IMAGE("WallSafe", require('url:./data/TestAdv/HallWay_Right/WallSafe.png'))

// Closet
IMAGE("ClosetBG", require('url:./data/TestAdv/Closet/ClosetBG.png'))

// Room - Kitchen
IMAGE("KitchenBG", require('url:./data/TestAdv/KitchenRoom/KitchenBG.png'))
IMAGE("FridgeDoorClosed", require('url:./data/TestAdv/KitchenRoom/FridgeDoorClosed.png'))
IMAGE("FridgeDoorOpen", require('url:./data/TestAdv/KitchenRoom/FridgeDoorOpen.png'))
IMAGE("Cheese", require('url:./data/TestAdv/KitchenRoom/Cheese.png'))

IMAGE("BatStrip", require('url:./data/bat_strip.png'))

// Sound effects and stuff
SOUND("TestActorScream", require("url:./data/TestAdv/Hallway_Left/scream.wav"))

SOUND("menu", require("url:./data/menu.wav"))
SOUND("kitchen", require("url:./data/62215.wav"))
SOUND("bg", require("url:./data/chill.mp3"), { volume: 0.3 }) // Credit: https://www.looperman.com/loops/detail/289801/lenoxbeatmaker-sativaskunk-free-146bpm-jazz-electric-guitar-loop

// Global vars
let hasCheese = false
let fridgeOpen = false


// Sprites
SPRITE("TestSprite", "TestActor", 10, 0, 29, 26.5)

// Animations
ANIMATION("AnimatedBats", "BatStrip", 200, [2, 1]) // 2 columns, 1 row (2 frames)

// TODO: Global ONCE() ?

ROOM("Bedroom", () => {
    /*
        Bedroom Puzzle
            None
    */
    BACKGROUND("BedroomBG")

    ACTOR("Box", {
        x: 478,
        y: 335,
        image: "Box"
    })


    HOTSPOT("gotoHallway_Right", 294, 114, 390, 307)

    ONCE(() => {
        //WAIT(1000)
        //SHOWTEXT("DRIP.")
        // WAIT(500)
        // SHOWTEXT("DRIP..")
        // WAIT(500)
        // SHOWTEXT("DRIP...")
        // WAIT(500)
        // SHOWTEXT("Can someone fix that faucet dripping please?!!")
        // WAIT(1000)
        // SHOWTEXT("i'M! TRYING! TO! SLEEP!")
        // WAIT(1000)
        // SHOWTEXT("DRIP....")
        SHOWTEXT("FINE! I'LL FIX IT MYSELF! UGH!")
    })

    CLICK("gotoHallway_Right", () => {
        GOTO("Hallway_Right")
    })
})

/*
    Hallway_Left Puzzle
        TestActor is in the way of the closet door, A mouse needs to be lured out
        of the mousehole with cheese to scare TestActor out of the room.
*/
ROOM("Hallway_Left", () => {
    let hasTestActorMoved = false

    BACKGROUND("Hallway_LeftBG")

    HOTSPOT("gotoCloset", 347, 114, 442, 307)
    HOTSPOT("gotoHallway_Right", 550, 0, 640, 400)
    HOTSPOT("mouseHole", 175, 290, 195, 310)

    ONCE(() => {
        //LOOPSOUND("bg", { rate: 0.9 + Math.random() / 5 })
    })

    ACTOR("TestActor", {
        x: 370,
        y: 160,
        image: "TestActor"
    })

    ACTOR("Fidget", {
        x: 370,
        y: 20,
        image: "TestSprite",
        rotation: 0,
    })

    ACTOR("bats", {
        x: 470,
        y: 40,
        image: "AnimatedBats",
        rotation: 0,
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

    CLICK("Fidget", fidget => {
        fidget.rotateSpeed += 10;
        fidget.rotateFriction = 0.2;
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

            SHOWTEXT("🐭")
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
            GOTO("Closet")
        }
        else {
            SHOWTEXT("TestActor is in the way")
        }
    })

    CLICK("gotoHallway_Right", () => {
        GOTO("Hallway_Right")
    })
})


/*
    HallWay_Right Puzzle
        Move painting, open safe with code from closet
*/
ROOM("Hallway_Right", () => {
    BACKGROUND("Hallway_RightBG")

    HOTSPOT("gotoHallway_Left", 0, 0, 80, 400)
    HOTSPOT("gotoKitchenRoom", 582, 139, 623, 382)
    HOTSPOT("gotoBedroom", 391, 114, 487, 307)

    ACTOR("WallSafe", {
        x: 201,
        y: 127,
        image: "WallSafe"
    })

    ACTOR("Painting", {
        x: 189,
        y: 95,
        image: "Painting"
    })

    VERB('use', "WallSafe", () => {
        SHOWTEXT("It's not safe any more.. ehehehe.")
    })

    CLICK("Painting", painting => {

        if (!painting.fallen) {
            painting.fallen = true
            MOVEACTOR("Painting", painting.x + 10, painting.y, 100, true)
            MOVEACTOR("Painting", painting.initialX, painting.initialY, 100, true)
            MOVEACTOR("Painting", 189, 185, 800, true, { easing: 'easeInQuart' })
            SHOWTEXT("Whoops!")
        } else {
            painting.fallen = false
            MOVEACTOR("Painting", painting.initialX, painting.initialY, 800, true)
        }
    })

    CLICK("gotoHallway_Left", () => {
        GOTO("Hallway_Left")
    })

    CLICK("gotoKitchenRoom", () => {
        GOTO("KitchenRoom")
    })

    CLICK("gotoBedroom", () => {
        GOTO("Bedroom")
    })

    ENTER(_ => {
        if (fridgeOpen) {
            SHOWTEXT("You left the fridge wide open, you doofus!")
        }
    })
})


ROOM("Closet", () => {
    /*
        Closet Puzzle
            Light is off, pull string snapped, get box from bedroom to reach
    */
    BACKGROUND("ClosetBG")

    HOTSPOT("gotoHallway_Left", 190, 370, 452, 400)

    ACTOR("Box", {
        x: 300,
        y: 299,
        image: "Box",
        visible: false
    })

    CLICK("gotoHallway_Left", () => {
        GOTO("Hallway_Left")
    })
})


ROOM("KitchenRoom", () => {
    /*
        Kitchen Puzzle
            TBD
    */
    BACKGROUND("KitchenBG")

    HOTSPOT("gotoHallway_Right", 14, 135, 54, 387)

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

    CLICK("gotoHallway_Right", () => {
        GOTO("Hallway_Right")
    })

    CLICK("FridgeDoorClosed", () => {
        HIDEACTOR("FridgeDoorClosed")
        SHOWACTOR("FridgeDoorOpen")
        if (!hasCheese) {
            SHOWACTOR("Cheese")
        }
        fridgeOpen = true
    })

    CLICK("FridgeDoorOpen", () => {
        HIDEACTOR("FridgeDoorOpen")
        SHOWACTOR("FridgeDoorClosed")
        HIDEACTOR("Cheese")
        fridgeOpen = false
    })

    VERB('use', "Cheese", () => {
        HIDEACTOR("Cheese")
        hasCheese = true
    })

    ENTER(() => {
        //PLAYSOUND("kitchen")
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

