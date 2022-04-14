import p5 from "p5";

const P5 = new p5();
globalThis.P5 = P5;

const g_GameInfo = {
    version: 1,
    name: "",
    /** @type {string[]} */
    authors: [],
    copyright: "",
    dateCreated: "",
    dateModified: "",    
    description: "",
    width: 640,
    height: 480,
    fontSize: 16,
    /** @type {p5.Color} */
    bgColor: "#000000",
    skipIntro: false,
    startRoom: "",
    rooms: [],
    actors: [],
    images: [],
    sounds: [],
    animations: [],
}

let currentRoomDef = null
let currentActorDef = null

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
globalThis.SIZE = function(width, height) {
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


function initialize() {
    console.log("GameInfo:", g_GameInfo)
    
    P5.createCanvas(g_GameInfo.width, g_GameInfo.height);
    P5.background("#000000") 
    P5.stroke(0)
    P5.fill("#eeeeee")
    P5.textSize(g_GameInfo.fontSize);
    P5.textAlign(P5.CENTER, P5.CENTER);
    P5.text(g_GameInfo.name, 0, 0, g_GameInfo.width, g_GameInfo.height, "center", "center")
    P5.textSize(g_GameInfo.fontSize*0.75);
    P5.text("by " + g_GameInfo.authors.join(" & "), 0, g_GameInfo.fontSize, g_GameInfo.width, g_GameInfo.height)
    P5.textSize(g_GameInfo.fontSize);
}

setTimeout(initialize, 100);

module.exports = {
    hello: 'Hello World!',
    foo: 9000
}