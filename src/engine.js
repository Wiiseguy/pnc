const p5 = require("p5");
globalThis.p5 = p5;
const p5sound = require("p5/lib/addons/p5.sound");

const P5 = new p5(() => 1337);
globalThis.P5 = P5;

class CustomContext {
    /** @type {p5} */
    p5 = null;
    /** @type {p5.Renderer} */
    canvas = null;
    /** @type {p5.GameInfo} */
    gameInfo = null;
    constructor(c) {
        this.p5 = c.p5;
        this.canvas = c.canvas;
        this.gameInfo = c.gameInfo;
    }
}

class GameInfo {
    version = 1;
    name = "";
    /** @type {number[]} */
    authors = [];
    copyright = "";
    dateCreated = "";
    dateModified = "";
    description = "";
    width = 640;
    height = 480;
    fontSize = 16;
    /** @type {p5.Color} */
    bgColor = "#000000";
    skipIntro = false;
    startRoom = "";
    rooms = [];
    actors = [];
    images = [];
    sounds = [];
    animations = [];

    customInit = [];
    customDraw = [];

    constructor() {

    }
}

const g_GameInfo = new GameInfo();
let currentRoomDef = null;
let currentRoom = null;
let isMouseDown = false;


globalThis.NAME = function (name) {
    g_GameInfo.name = name;
}

globalThis.AUTHOR = function (name) {
    g_GameInfo.authors.push(name)
}

/**
 * Sets the size of the game screen
 * @param {number} width 
 * @param {number} height 
 */
globalThis.SIZE = function (width, height) {
    g_GameInfo.width = width
    g_GameInfo.height = height
}

globalThis.FONTSIZE = function (size) {
    g_GameInfo.fontSize = size
}

globalThis.BGCOLOR = function (hexString) {
    g_GameInfo.bgColor = P5.color(hexString)
}

globalThis.NOINTRO = function () {
    g_GameInfo.skipIntro = true
}

globalThis.STARTROOM = function (room) {
    g_GameInfo.startRoom = room
}

globalThis.ACTOR = function (name, def) {
    // If we're current handling room defs, add the actor to the current room
    if (currentRoomDef) {
        currentRoomDef.actors.push({
            name: name,
            ...def
        });
        console.log("[ACTOR]: ", name)

    }
    // Otherwise, add the actor to the global list
    else {
        g_GameInfo.actors.push({
            name: name,
            ...def
        });
        console.log("[GLOBAL ACTOR]: ", name)
    }
}

globalThis.IMAGE = function (name, fileName) {
    g_GameInfo.images.push({
        name: name,
        fileName: fileName,
        image: null
    });
}

globalThis.ANIMATION = function (name, img, speed, def) {
    g_GameInfo.animations.push({
        name: name,
        img: img,
        speed: speed,
        def: def
    });
}

globalThis.SOUND = function (name, fileName) {
    g_GameInfo.sounds.push({
        name: name,
        fileName: fileName,
        sound: null
    });
}

globalThis.ROOM = function (name, def) {
    g_GameInfo.rooms.push({
        name: name,
        roomInitFn: def,
        description: '',
        background: null,
        verbs: [],
        hotspots: [],
        actors: [],
        onEnter: null
    });
}

// Room functions
globalThis.BACKGROUND = function (imageName) {
    currentRoomDef.background = imageName;
}
globalThis.DESCRIPTION = function (desc) {
    currentRoomDef.description = desc;
}
globalThis.HOTSPOT = function (name, x1, y1, x2, y2) {
    currentRoomDef.hotspots.push({
        name: name,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    });
}
globalThis.VERB = function (verb, subject, action) {
    currentRoomDef.verbs.push({ verb, subject, action })
}
globalThis.ENTER = function (action) {
    currentRoomDef.onEnter = action;
}
// ACTOR() is defined earlier in this file

/**
 * 
 * @param {function(CustomContext)} fn 
 */
globalThis.CUSTOM_INIT = function (fn) {
    g_GameInfo.customInit.push(fn)
}

/**
 * 
 * @param {function(CustomContext)} fn 
 */
globalThis.CUSTOM_DRAW = function (fn) {
    g_GameInfo.customDraw.push(fn)
}

function initialize() {
    console.log("GameInfo:", g_GameInfo)

    const canvas = P5.createCanvas(g_GameInfo.width, g_GameInfo.height);

    canvas.mousePressed(e => {
        isMouseDown = true;

        currentRoom.hotspots.forEach(h => {
            if (P5.mouseX >= h.x1 && P5.mouseX <= h.x2 && P5.mouseY >= h.y1 && P5.mouseY <= h.y2) {
                currentRoom = g_GameInfo.rooms[1];
            }
        })
    });

    canvas.mouseReleased(e => {
        isMouseDown = false;
    });

    const context = new CustomContext({
        p5: P5,
        gameInfo: g_GameInfo,
        canvas
    })

    // Initialize rooms
    g_GameInfo.rooms.forEach(r => {
        currentRoomDef = r;
        r.roomInitFn();
        r.backgroundImage = g_GameInfo.images.find(i => i.name == r.background).image

        r.actors.forEach(a => {
            a.image = g_GameInfo.images.find(i => i.name == a.image).image
        })

        console.log("Handled room: " + r.name, r)
    })

    g_GameInfo.actors.forEach(ga => {
        ga.image = g_GameInfo.images.find(i => i.name == ga.image).image
    })

    P5.background("#000000")
    P5.stroke(0)
    P5.fill("#eeeeee")
    P5.textSize(g_GameInfo.fontSize);
    P5.textAlign(P5.CENTER, P5.CENTER);

    // Draw the Game title and author(s) unless NOINTRO() is used.
    if (!g_GameInfo.skipIntro) {
        P5.text(g_GameInfo.name, 0, 0, g_GameInfo.width, g_GameInfo.height, "center", "center")
        P5.textSize(g_GameInfo.fontSize * 0.75);
        if (g_GameInfo.authors != "") P5.text("by " + g_GameInfo.authors.join(" & "), 0, g_GameInfo.fontSize, g_GameInfo.width, g_GameInfo.height)
        P5.textSize(g_GameInfo.fontSize);
    }

    // Call custom init functions
    g_GameInfo.customInit.forEach(fn => {
        fn(context)
    })

    P5.draw = _ => {
        // Draw Background
        P5.image(currentRoom.backgroundImage, 0, 0)

        // Draw Hotspots (DEBUG)
        currentRoom.hotspots.forEach(h => {
            P5.push()
            P5.noStroke()
            P5.fill((P5.mouseX >= h.x1 && P5.mouseX <= h.x2 && P5.mouseY >= h.y1 && P5.mouseY <= h.y2) * 255, 0, 0, 128)
            P5.rect(h.x1, h.y1, h.x2 - h.x1, h.y2 - h.y1)
            P5.fill(200)
            P5.textSize(16)
            P5.textAlign("right","bottom")
            P5.text(h.name,h.x2,h.y2)
            P5.pop()
        })

        // Draw Current Room Actors
        currentRoom.actors.forEach(a => {
            P5.image(a.image, a.x, a.y)
        })

        // Draw Global Actors
        g_GameInfo.actors.forEach(a => {
            P5.image(a.image, a.x, a.y)
        })

        // Call custom draw functions
        g_GameInfo.customDraw.forEach(fn => {
            fn(context)
        })
    }

    // Set Start Room, or fall back to first room
    currentRoom = g_GameInfo.rooms.find(r => r.name == g_GameInfo.startRoom)
    if (!currentRoom) {
        currentRoom = g_GameInfo.rooms[0]
    }

    // Initialization complete
    console.log("Initialized")
}

P5.preload = function () {
    console.log("Preload")

    // Preload images
    // by doing this inside p5's preload(), setup() won't be called until all assets are loaded
    g_GameInfo.images.forEach(img => {
        img.image = P5.loadImage(img.fileName);
    })

    // Preload sounds
    g_GameInfo.sounds.forEach(sound => {
        sound.sound = P5.loadSound(sound.fileName);
    })
}

P5.setup = function () {
    console.log("Setup")
    initialize();
}

module.exports = {
}