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
    g_GameInfo.actors.push({
        name: name,
        def: def
    });
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
        def: def,
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
globalThis.HOTSPOT = function (name, x, y, width, height) {
    currentRoomDef.hotspots.push({
        name: name,
        x: x,
        y: y,        
        width: width,
        height: height
    });
}
globalThis.VERB = function (verb, subject, action) {
    currentRoomDef.verbs.push({verb, subject, action})
}
globalThis.ENTER = function (action) {
    currentRoomDef.onEnter = action;
}

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

    const context = new CustomContext({
        p5: P5,
        gameInfo: g_GameInfo,
        canvas
    })

    // Initialize rooms
    g_GameInfo.rooms.forEach(r => {
        currentRoomDef = r;
        r.def();
        console.log("Handled room: " + r.name, r)
    })

    P5.background("#000000")
    P5.stroke(0)
    P5.fill("#eeeeee")
    P5.textSize(g_GameInfo.fontSize);
    P5.textAlign(P5.CENTER, P5.CENTER);

    // @Chronic DELME: Draw all images and play all sounds (test only)
    g_GameInfo.images.forEach(img => {
        P5.image(img.image, 0, 0);
    });
    g_GameInfo.sounds.forEach(s => {
        s.sound.play();
    })

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
        // Call custom draw functions
        g_GameInfo.customDraw.forEach(fn => {
            fn(context)
        })
    }


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