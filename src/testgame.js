const PNC = require('./engine.js');

NAME("PNC Test Adventure")
AUTHOR("Chronic")
AUTHOR("Wiiseguy")
SIZE(640, 400)
FONTSIZE(24)
BGCOLOR('#ff00ff')
//RENDER('3d')

//DEBUG()
//NOINTRO()


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
IMAGE("ClosetShadow", require('url:./data/TestAdv/Closet/ClosetShadow.png'))
IMAGE("Toolbox", require('url:./data/TestAdv/Closet/Toolbox.png'))


// Room - Kitchen
IMAGE("KitchenBG", require('url:./data/TestAdv/KitchenRoom/KitchenBG.png'))
IMAGE("FridgeDoorClosed", require('url:./data/TestAdv/KitchenRoom/FridgeDoorClosed.png'))
IMAGE("FridgeDoorOpen", require('url:./data/TestAdv/KitchenRoom/FridgeDoorOpen.png'))
IMAGE("Cheese", require('url:./data/TestAdv/KitchenRoom/Cheese.png'))

IMAGE("BatStrip", require('url:./data/TestAdv/SFX/bat_strip.png'))

// Sound effects and stuff
SOUND("TestActorScream", require("url:./data/TestAdv/SFX/scream.wav"))
SOUND("clue", require("url:./data/TestAdv/SFX/sfx-clue.wav"), { volume: 0.5})
SOUND("thud", require("url:./data/TestAdv/SFX/thud1.wav"))
SOUND("move", require("url:./data/TestAdv/SFX/thud2.wav"))
SOUND("menu", require("url:./data/TestAdv/SFX/menu.wav"))
SOUND("kitchen", require("url:./data/TestAdv/SFX/62215.wav"))
SOUND("bg", require("url:./data/TestAdv/SFX/chill.mp3"), { volume: 0.3 }) // Credit: https://www.looperman.com/loops/detail/289801/lenoxbeatmaker-sativaskunk-free-146bpm-jazz-electric-guitar-loop

// Mouse Pointers
IMAGE("cur_pointer", require('url:./data/TestAdv/cur_pointer.png'))
IMAGE("cur_walk", require('url:./data/TestAdv/cur_walk.png'))


// Global vars
let fridgeOpen = false
let closetLightsOn = false
let hasTestActorMoved = false
let gotCheese = false
let gotPipeWrench = false
let gotBox = false

// Sprites
SPRITE("TestSprite", "TestActor", 10, 0, 29, 26.5)

// Animations
ANIMATION("AnimatedBats", "BatStrip", 200, [3, 1]) // 2 columns, 1 row (2 frames)

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
        image: "Box",
        mousepointer: "cur_pointer"
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
        // SHOWTEXT("I'M! TRYING! TO! SLEEP!")
        // WAIT(1000)
        // SHOWTEXT("DRIP....")
        //SHOWTEXT("FINE! I'LL FIX IT MYSELF! UGH!")
    })

    CLICK("gotoHallway_Right", () => {
        GOTO("Hallway_Right")
    })

    CLICK("Box", () => {
        SHOWTEXT("Hmm, this box might come in handy.")
        HIDEACTOR("Box")
        gotBox = true
    })
})

/*
    Hallway_Left Puzzle
        TestActor is in the way of the closet door, A mouse needs to be lured out
        of the mousehole with cheese to scare TestActor out of the room.
*/
ROOM("Hallway_Left", () => {
    

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

    ACTOR("Fidget", {
        x: 370,
        y: 20,
        image: "TestSprite",
        rotation: 0,
        gravity: 0.5,
        friction: 0.05,
        behaviors: {
            drag: {
                // Drag options
                momentum: true
            },
            BouncyBall: {}
        }
    })

    ACTOR("bats", {
        x: 470,
        y: 40,
        image: "AnimatedBats",
        rotation: 0,
        behaviors: {
            drag: {}
        }
    })

    CLICK("bats", bats => {
        bats.rotateSpeed += 10;
        bats.rotateFriction = 0.2;
    })

    CLICK('Shelf', shelf => {
        GOTO('TestRoom')
    })

    CLICK("TestActor", () => {
        //PLAYSOUND("kitchen", { rate: 0.5 + Math.random() })
        SHOWTEXT("They don't seem interested in talking to me.")
    })

    CLICK("mouseHole", () => {
        if (hasTestActorMoved) {
            SHOWTEXT("I didn't see anything, but it scared TestActor away.")
            return;
        }
        if (gotCheese) {
            SHOWTEXT("Maybe the little thing likes cheese.")
            SHOWACTOR("Cheese")
            WAIT(1000)
            SHOWACTOR("Mouse")
            WAIT(500)

            SHOWTEXT("🐭") // Doesn't render in 3d mode
            PLAYSOUND("TestActorScream")
            SHOWTEXT("AHH! A MOUSE!!")
            MOVEACTOR("TestActor", 700, 160, 1000, true, { easing: 'easeInElastic(1, .6)' })
            hasTestActorMoved = true
        }
        else {
            SHOWTEXT("I hear something moving around in there. I hear something moving around in there. I hear something moving around in there.")
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
            PLAYSOUND('move')
            MOVEACTOR("Painting", painting.x + 10, painting.y, 100, true)
            MOVEACTOR("Painting", painting.initialX, painting.initialY, 100, true)
            MOVEACTOR("Painting", 189, 185, 800, true, { easing: 'easeInQuart' })
            PLAYSOUND('thud')
            SHOWTEXT("Whoops!")
            PLAYSOUND('clue')
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
    HOTSPOT("Light", 304, 0, 338, 60)

    ACTOR("Toolbox", {
        x: 269,
        y: 286,
        image: "Toolbox"
    })

    ACTOR("Box", {
        x: 340,
        y: 330,
        image: "Box",
        visible: false
    })

    ACTOR("ClosetShadow", {
        x: 203,
        y: 0,
        image: "ClosetShadow",
        alpha: 230
    })

    CLICK("gotoHallway_Left", () => {
        GOTO("Hallway_Left")
    })

    CLICK("Toolbox", () => {
        if (closetLightsOn) {
            if (!gotPipeWrench) {
                SHOWTEXT("Ahh.. the mighty pipe wrench!")
                gotPipeWrench = true;
            }
        }
        else {
            SHOWTEXT("There are a bunch of sharp things in there, I need to turn the light on first.")
        }
    })

    CLICK("Light", () => {
        if (gotBox) {
            if (!closetLightsOn) {
                SHOWTEXT("Maybe I can use this box to stand on.")
                SHOWACTOR("Box")
                WAIT(500)
                HIDEACTOR("ClosetShadow")
                closetLightsOn = true
            }
        }
        else {
            SHOWTEXT("I cannot reach the light, I need something to stand on.")
        }
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

    ACTOR("TestActor", {
        x: 540,
        y: 110,
        image: "TestActor",
        visible: false,
        behaviors: {
            Jitter: {}
        }
    })

    CLICK("gotoHallway_Right", () => {
        GOTO("Hallway_Right")
    })

    CLICK("FridgeDoorClosed", () => {
        PLAYSOUND('move', { volume: 0.5, rate: 1.2 })
        HIDEACTOR("FridgeDoorClosed")
        SHOWACTOR("FridgeDoorOpen")
        if (!gotCheese) {
            SHOWACTOR("Cheese")
        }
        fridgeOpen = true
    })

    CLICK("FridgeDoorOpen", () => {
        PLAYSOUND('thud', { volume: 0.25, rate: 0.5 })
        HIDEACTOR("FridgeDoorOpen")
        SHOWACTOR("FridgeDoorClosed")
        HIDEACTOR("Cheese")
        fridgeOpen = false
    })

    VERB('use', "Cheese", () => {
        SHOWTEXT("This puzzle is so cheesy..")
        HIDEACTOR("Cheese")
        gotCheese = true
    })

    ENTER(() => {
        //PLAYSOUND("kitchen")
        if (hasTestActorMoved) {
            SHOWACTOR("TestActor")
        }
    })
})

ROOM("TestRoom", (ctx) => {
    let { gameInfo, p5 } = ctx;
    let score = 0;

    COLOR("#aabbff")
    //COLOR(0,0,255)

    ACTOR('Back', {
        x: gameInfo.width - 100,
        y: 0,
        width: 100,
        height: 50
    })
    CLICK('Back', _ => {
        GOTO('Hallway_Left')
    })

    for (let i = 0; i < 10; i++) {
        ACTOR("Ball" + i, {
            x: Math.random() * gameInfo.width,
            y: Math.random() * gameInfo.height,
            image: "TestSprite",
            rotation: 0,
            //rotateSpeed: -1 + Math.random() * 2,
            xSpeed: p5.random(-3, 3),
            ySpeed: p5.random(-3, 3),
            behaviors: {
                BouncyBall: {
                    bounciness: 1
                }
            }
        })
    }

    // PREDRAW(ctx => {
    //     let { p5, canvas } = ctx;
    //     p5.noStroke();
    //     p5.fill(0, 255, 0)
    //     p5.rect(p5.mouseX, 0, 32, canvas.height)
    // })

    DRAW(ctx => {
        let { p5, canvas } = ctx;
        p5.noStroke();
        p5.fill(0, 0, 0, 255)
        p5.text(`Score: ${score}`, 0, 10, canvas.width, 32)

        
        p5.fill(0, 0, 0, 128)
        p5.text("Back", canvas.width-100, 10, 100, 32)
    })
    
})

BEHAVIOR('BouncyBall', {
    state() {
        return {
            bounciness: 0.5
        }
    },
    update(actor, p5, gameInfo) {
        if (actor.y + actor.height > gameInfo.height) {
            actor.y = gameInfo.height - actor.height - actor.bounciness + 1; // Honestly just trial and error..
            actor.ySpeed = -(actor.ySpeed * actor.bounciness);
        }
        if (actor.x + actor.width > gameInfo.width || actor.x < 0) {
            actor.x = p5.constrain(actor.x, 0, gameInfo.width - actor.width);
            actor.xSpeed = -(actor.xSpeed * actor.bounciness);
        }
        if(actor.y < 0) {
            actor.y = 0;
            actor.ySpeed = -(actor.ySpeed * actor.bounciness);
        }
    }
})

BEHAVIOR('Jitter', {
    update(actor, p5, gameInfo) {
        actor.offsetX = -2 + Math.random() * 4;
    }
})

BEHAVIOR('drag', {
    state() {
        return {
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
            prevX: 0,
            prevY: 0,
            steps: 0,
            momentum: false
        }
    },
    /**
     * 
     * @param {GameActor} actor 
     * @param {p5} p5 
     * @param {GameInfo} gameInfo 
     */
    update(actor, p5, gameInfo) {
        let wasDragging = actor.isDragging;
        if (p5.mouseIsPressed) {
            if (actor.boundingBox.contains(p5.mouseX, p5.mouseY) && !gameInfo._isDragging) {   // gameInfo check is to prevent other objects from being dragged              
                if (!actor.isDragging) {
                    actor.dragStartX = p5.mouseX - actor.x;
                    actor.dragStartY = p5.mouseY - actor.y;
                }
                actor.isDragging = true;
                gameInfo._isDragging = true;
            }
        } else {
            actor.isDragging = false;
            gameInfo._isDragging = false;
        }

        if (actor.isDragging) {
            actor.x = p5.mouseX - actor.dragStartX;
            actor.y = p5.mouseY - actor.dragStartY;
            actor.ySpeed = 0;
        }

        if (!actor.isDragging && wasDragging && actor.momentum) {
            actor.xSpeed = (actor.x - actor.prevX) * 0.5;
            actor.ySpeed = (actor.y - actor.prevY) * 0.5;
        }

        // Have to do it like this, because x-prevX (and y-prevY) was always 0 on stop dragging
        actor.steps++;
        if (actor.steps > 5) {
            actor.prevX = actor.x;
            actor.prevY = actor.y;
            actor.steps = 0;
        }
    }
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

