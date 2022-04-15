import * as PNC from './engine';

NAME("James Bond's Amazing Adventure!")
AUTHOR("Chronic")
AUTHOR("Wiiseguy")
SIZE(640, 480)
FONTSIZE(32)
NOINTRO()

STARTROOM("JBintro")

//IMAGE("iIntroWalkStrip", "anim-walks.jpg")
IMAGE("bgCrossroads", "/data/James/Crossroads/bgCrossroads.png")
//IMAGE("ijamesGun", "data/James/Crossroads/jamesGun.png")
//IMAGE("ijamesGun2", "data/James/Crossroads/jamesGun2.png")


// Spoken samples

// Music
SOUND("theme1", "martian.mid")
SOUND("jbTheme", "james-bond-theme.mid")

// Sound effects and stuff
SOUND("sndDoorOpen", "sfx-dooropens.wav")

// Global vars (just normal js vars)
var hasGateKey = false
var HGateLocked = true


// Animations
ANIMATION("iBatFlap", "iBatStrip", 200, [
    [0, 0, 24, 19],
    [25, 0, 49, 19],
])


ROOM("firstRoom", () => {

    BACKGROUND("bg1")
    DESCRIPTION("Crossroads")

    HOTSPOT("sign1", 150, 60, 270, 130)

    ACTOR("james", "ijamesGun", 150, 165)

    ACTOR("james2", {
        x: 200,
        y: 10,
        sprite: "ijamesGun",
        hidden: true
    })

    LOOK("sign1", () => {
        SHOWTEXT("The Bond Residence?")
        WAIT(1300)
        SHOWTEXT("I wonder where this path will take me!")

        PlayPong()
    })

    USE("sign1", () => {
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




// Custom test
let radius = 50;
let isMouseDown = false;
let lastKey = ''

CUSTOM_INIT(ctx => {
    let { p5, canvas } = ctx;

    canvas.mousePressed(e => {
        isMouseDown = true;
    });
    canvas.mouseReleased(e => {
        isMouseDown = false;
    });
    canvas.mouseWheel(e => {
        radius += e.deltaY / 20;
        radius = p5.constrain(radius, 1, 1000);
    });

    document.addEventListener('keypress', e => {
        console.log('Key pressed:', e);
        lastKey = e.key;
    })

    p5.noStroke();
})

CUSTOM_DRAW(ctx => {
    let { p5, canvas } = ctx;

    if (p5.mouseX >= 0 && p5.mouseX <= canvas.width && p5.mouseY >= 0 && p5.mouseY <= canvas.height) {
        if (isMouseDown) {
            p5.circle(p5.mouseX, p5.mouseY, radius)
            p5.fill(Math.random() * 255, Math.random() * 255, Math.random() * 255)
            p5.text(lastKey, p5.mouseX, p5.mouseY) // Press a key to change it!
        }
    }
    else {
        isMouseDown = false;
    }
})