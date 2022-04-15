import p5 from "p5";

const P5 = new p5(_ => { });
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

globalThis.IMAGE = function (name, file) {
    g_GameInfo.images.push({
        name: name,
        file: file
    });

    img = P5.loadImage(file, loadImage_Success(file), loadImage_Fail(file));
}


// IMAGE LOADING DEBUG
function loadImage_Success(file, Event) {
    console.log("[IMAGE] Loaded: ", file)
}

// IMAGE LOADING DEBUG
function loadImage_Fail(file, Event) {
    console.log("[IMAGE] Failed: ", file)
}

globalThis.ANIMATION = function (name, img, speed, def) {
    g_GameInfo.animations.push({
        name: name,
        img: img,
        speed: speed,
        def: def
    });
}

globalThis.SOUND = function (name, file) {
    g_GameInfo.sounds.push({
        name: name,
        file: file
    });
}

globalThis.ROOM = function (name, def) {
    g_GameInfo.rooms.push({
        name: name,
        def: def
    });
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
        // Call custom draw functions
        g_GameInfo.customDraw.forEach(fn => {
            fn(context)
        })
    }
}

setTimeout(initialize, 100);

module.exports = {
}