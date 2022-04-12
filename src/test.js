import * as PNC from './engine';
import p5 from "p5";

NAME("James Bond's Amazing Adventure!")
AUTHOR("Chronic & Wiiseguy")
SIZE(640, 480)
FONTSIZE(32)
NOINTRO()

STARTROOM("JBintro")

IMAGE("iIntroWalkStrip", "anim-walks.jpg")

IMAGE("bg1", "bgRoom1.png")
IMAGE("ijamesGun", "jamesGun.png")
IMAGE("ijamesGun2", "jamesGun2.png")


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



const p5Instance = new p5(s => {
	let canvas;
	let x = 0;
	let y = 0;
	let c = 200;
	let m = false;

	console.log(s)

	s.setup = () => {
		canvas = s.createCanvas(640, 480);
		y = canvas.height / 2;

		canvas.mousePressed(doMouseP);
		canvas.mouseReleased(doMouseR);
		canvas.mouseWheel(doMouseWheel);
		s.background(0)
	};

	s.draw = () => {
		s.noStroke()

		if (m == true) {
			s.circle(s.mouseX, s.mouseY, c)
			s.fill(Math.random() * 255, Math.random() * 255, Math.random() * 255)
		}

	};

	function doMouseP() {
		m = true;
	}

	function doMouseR() {
		m = false;
	}

	function doMouseWheel(wheel) {
		c += wheel.deltaY / 20;
		c = s.constrain(c, 1, 1000);
	}

});




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
		SHOWTEXT("FUCK!!!")
	}
})
