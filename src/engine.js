globalThis.NAME = function (name) {
    console.log("Set name to", name)
}

globalThis.AUTHOR = function (name) {
    console.log("Set author to", name)
}

/**
 * Sets the size of the game screen
 * @param {number} width 
 * @param {number} height 
 */
globalThis.SIZE = function(width, height) {
    console.log("Set screen size to", width, height)
}

globalThis.FONTSIZE = function (size) {
    console.log("Set font size to", size)
}

globalThis.NOINTRO = function () {
    console.log('Set skipintro to true')
}

globalThis.STARTROOM = function (room) {
    console.log('Set start room to', room)
}

globalThis.ACTOR = function (name, def) {
    console.log("Actor actor", name, def)
}

globalThis.IMAGE = function (name, file) {
    console.log("Added image", name, file)
}

globalThis.ANIMATION = function (name, img, speed, def) {
    console.log("Added animation", name, img, speed, def)
}

globalThis.SOUND = function (name, file) {
    console.log("Added sound", name, file)
}

globalThis.ROOM = function (name, def) {
    console.log("Added room definition", name)
}


module.exports = {
    hello: 'Hello World!',
    foo: 9000
}