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

const gameInfo = new GameInfo();
let currentRoomDef = null;
let currentRoom = null;
let isMouseDown = false;


globalThis.NAME = function (name) {
    gameInfo.name = name;
}

globalThis.AUTHOR = function (name) {
    gameInfo.authors.push(name)
}

/**
 * Sets the size of the game screen
 * @param {number} width 
 * @param {number} height 
 */
globalThis.SIZE = function (width, height) {
    gameInfo.width = width
    gameInfo.height = height
}

globalThis.FONTSIZE = function (size) {
    gameInfo.fontSize = size
}

globalThis.BGCOLOR = function (hexString) {
    gameInfo.bgColor = P5.color(hexString)
}

globalThis.NOINTRO = function () {
    gameInfo.skipIntro = true
}

globalThis.STARTROOM = function (room) {
    gameInfo.startRoom = room
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
        gameInfo.actors.push({
            name: name,
            ...def
        });
        console.log("[GLOBAL ACTOR]: ", name)
    }
}

globalThis.IMAGE = function (name, fileName) {
    gameInfo.images.push({
        name: name,
        fileName: fileName,
        image: null
    });
}

globalThis.ANIMATION = function (name, img, speed, def) {
    gameInfo.animations.push({
        name: name,
        img: img,
        speed: speed,
        def: def
    });
}

globalThis.SOUND = function (name, fileName) {
    gameInfo.sounds.push({
        name: name,
        fileName: fileName,
        sound: null
    });
}

globalThis.ROOM = function (name, def) {
    gameInfo.rooms.push({
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
    gameInfo.customInit.push(fn)
}

/**
 * 
 * @param {function(CustomContext)} fn 
 */
globalThis.CUSTOM_DRAW = function (fn) {
    gameInfo.customDraw.push(fn)
}

function getImageByName(name) {
    let image = gameInfo.images.find(img => img.name === name);
    if (!image) throw new Error(`Image with name ${name} not found`);
    return image;
}

function initializeActor(actor) {
    actor.image = getImageByName(actor.image);
}

function drawActor(actor) {
    P5.image(actor.image.image, actor.x, actor.y)
}

function initialize() {
    console.log("GameInfo:", gameInfo)

    const canvas = P5.createCanvas(gameInfo.width, gameInfo.height);

    canvas.mousePressed(e => {
        isMouseDown = true;

        currentRoom.hotspots.forEach(h => {
            if (P5.mouseX >= h.x1 && P5.mouseX <= h.x2 && P5.mouseY >= h.y1 && P5.mouseY <= h.y2) {
                currentRoom = gameInfo.rooms[1];
            }
        })
    });

    canvas.mouseReleased(e => {
        isMouseDown = false;
    });

    const context = new CustomContext({
        p5: P5,
        gameInfo: gameInfo,
        canvas: canvas
    })

    // Initialize rooms
    gameInfo.rooms.forEach(r => {
        currentRoomDef = r;
        r.roomInitFn();
        r.backgroundImage = getImageByName(r.background);

        r.actors.forEach(initializeActor)

        console.log("Handled room: " + r.name, r)
    })

    gameInfo.actors.forEach(initializeActor)

    P5.background("#000000")
    P5.stroke(0)
    P5.fill("#eeeeee")
    P5.textSize(gameInfo.fontSize);
    P5.textAlign(P5.CENTER, P5.CENTER);

    // Draw the Game title and author(s) unless NOINTRO() is used.
    if (!gameInfo.skipIntro) {
        P5.text(gameInfo.name, 0, 0, gameInfo.width, gameInfo.height, "center", "center")
        P5.textSize(gameInfo.fontSize * 0.75);
        if (gameInfo.authors.length != 0) P5.text("by " + gameInfo.authors.join(" & "), 0, gameInfo.fontSize, gameInfo.width, gameInfo.height)
        P5.textSize(gameInfo.fontSize);
    }

    // Call custom init functions
    gameInfo.customInit.forEach(fn => {
        fn(context)
    })

    P5.draw = _ => {
        // Draw Background
        P5.image(currentRoom.backgroundImage.image, 0, 0)

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
        currentRoom.actors.forEach(drawActor)

        // Draw Global Actors
        gameInfo.actors.forEach(drawActor)

        // Call custom draw functions
        gameInfo.customDraw.forEach(fn => {
            fn(context)
        })
    }

    // Set Start Room, or fall back to first room
    currentRoom = gameInfo.rooms.find(r => r.name == gameInfo.startRoom)
    if (!currentRoom) {
        currentRoom = gameInfo.rooms[0]
    }

    // Initialization complete
    console.log("Initialized")
}

P5.preload = function () {
    console.log("Preload")

    // Preload images
    // by doing this inside p5's preload(), setup() won't be called until all assets are loaded
    gameInfo.images.forEach(img => {
        img.image = P5.loadImage(img.fileName);
    })

    // Preload sounds
    gameInfo.sounds.forEach(sound => {
        sound.sound = P5.loadSound(sound.fileName);
    })
}

P5.setup = function () {
    console.log("Setup")
    initialize();
}

module.exports = {
}