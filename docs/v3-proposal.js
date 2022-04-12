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


// Omitted alot of redundant things, you get the idea by now.





// Added this here to show how it supports intellisense (auto-complete)
// ... and to make this valid JS that you can put in any JS console (like in your browser, press F12)

function NAME(name) { console.log("Set name to", name) }
function AUTHOR(name) { console.log("Set author to", name)  }

/**
 * 
 * @param {number} width 
 * @param {number} height 
 */
function SIZE(width, height) { console.log("Set screen size to", width, height)  }

function FONTSIZE(size) {console.log("Set font size to", size)  }
function NOINTRO() { console.log('Set skipintro to true') }
function STARTROOM(room) {console.log('Set start room to', room) }
function ACTOR(name, def) { console.log("Actor actor", name, def)  }
function IMAGE(name, file) { console.log("Added image", name, file)  }
function ANIMATION(name, img, speed, def) {console.log("Added animation", name, img, speed, def)   }
function SOUND(name, file) { console.log("Added sound", name, file)  }
function ROOM(name, def) { console.log("Added room definition", name)   }