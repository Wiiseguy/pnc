const { SoundFile } = require("p5");
const p5 = require("p5");
globalThis.p5 = p5;
const p5sound = require("p5/lib/addons/p5.sound");
const { GameInfo, CustomContext, GameHotspot, GameRoom, GameAction, GameActor, GameSound } = require("./engine.core");

const P5 = new p5(() => 1337);
globalThis.P5 = P5;


const gameInfo = new GameInfo();
let verbs = ['use']


let currentRoomDef = null;
/** @type {GameRoom} */
let currentRoom = null;
let currentVerb = verbs[0];
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
    let actor = new GameActor(name, def.x, def.y, def.image);

    // If we're current handling room defs, add the actor to the current room
    if (currentRoomDef) {
        currentRoomDef.actors.push(actor);
        console.log("[ACTOR]: ", name, def, actor)

    }
    // Otherwise, add the actor to the global list
    else {
        gameInfo.actors.push(actor);
        console.log("[GLOBAL ACTOR]: ", name, actor)
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

globalThis.SOUND = function (name, fileName, options) {
    options = {
        volume: 1,
        ...options
    };
    console.log(options)

    let sound = new GameSound({
        name: name,
        fileName: fileName,
        sound: null
    })
    sound.defaultVolume = options.volume;
    gameInfo.sounds.push(sound);
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
        onEnter: function () { }
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
    currentRoomDef.hotspots.push(new GameHotspot({
        name: name,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        actions: []
    }));
}
globalThis.VERB = function (verb, subject, action) {
    let actor = currentRoomDef.actors.find(actor => actor.name === subject);
    if (actor) {
        actor.actions.push(new GameAction(verb, action))
        return;
    }

    let hotspot = currentRoomDef.hotspots.find(hotspot => hotspot.name === subject);
    if (hotspot) {
        hotspot.actions.push(new GameAction(verb, action))
        return;
    }
    currentRoomDef.verbs.push({ verb, subject, action })
};
globalThis.CLICK = function (subject, action) {
    globalThis.VERB('*', subject, action)
}
globalThis.ENTER = function (action) {
    currentRoomDef.onEnter = action;
}
// ACTOR() is defined earlier in this file

function unimplemented() {
    console.warn("Unimplemented", ...arguments)
}

globalThis.SHOWTEXT = function () {
    unimplemented('SHOWTEXT', ...arguments)
}
globalThis.WAIT = function () {
    unimplemented('WAIT', ...arguments)
};
globalThis.GOTO = function (room) {
    let r = gameInfo.rooms.find(r => r.name == room)
    setRoom(r)
};
globalThis.SHOWACTOR = function (name) {
    let actor = getRoomActor(name);
    if (actor) actor.visible = true;
};
globalThis.HIDEACTOR = function (name) {
    let actor = getRoomActor(name);
    if (actor) actor.visible = false;
};
globalThis.MOVEACTOR = function () {
    unimplemented('MOVEACTOR', ...arguments)
};

globalThis.PLAYSOUND = function (name, options) {
    let sound = getSound(name);
    options = {
        volume: sound.defaultVolume ?? 1,
        rate: 1,
        delay: 0,
        start: 0,
        duration: undefined,
        ...options
    };
    
    sound.sound.setLoop(false)
    sound.sound.stop()
    sound.sound.play(options.delay, options.rate, options.volume, options.start, options.duration)
};

globalThis.STOPSOUND = function (name) {
    let sound = getSound(name);
    sound.sound.stop()
};
globalThis.LOOPSOUND = function (name, options) {
    let sound = getSound(name);
    options = {
        volume: sound.defaultVolume ?? 1,
        rate: 1,
        delay: 0,
        start: 0,
        duration: undefined,
        ...options
    };
    console.log(options, sound)
    sound.sound.pause()
    sound.sound.stop()
    sound.sound.loop(options.delay, options.rate, options.volume, options.start, options.duration)
};

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


function setRoom(room) {
    if (!room) {
        console.error('Room not found:', room)
        return;
    }
    currentRoom = room;
    currentRoom.onEnter();
}

function getImage(name) {
    let image = gameInfo.images.find(img => img.name === name);
    if (!image) throw new Error(`Image with name ${name} not found`);
    return image;
}

/** @type {SoundFile} */
function getSound(name) {
    let sound = gameInfo.sounds.find(s => s.name === name);
    if (!sound) throw new Error(`Sound with name ${name} not found`);
    return sound;
}

function getActionByNameOrWildcard(actions, name) {
    return actions?.find(a => a.name === name || a.name === '*')
}

function getRoomActor(name) {
    return currentRoom.actors.find(a => a.name === name)
}

function initializeActor(actor) {
    actor.image = getImage(actor.imageName);
}

function drawActor(actor) {
    if (!actor.visible) return;
    P5.image(actor.image.image, actor.x, actor.y)
}

function initialize() {
    console.log("GameInfo:", gameInfo)

    const canvas = P5.createCanvas(gameInfo.width, gameInfo.height);

    canvas.mousePressed(function (e) {
        if (P5.mouseButton != 'left') return;

        isMouseDown = true;

        let action = null;

        for (let a of currentRoom.actors) {
            if (!a.visible) continue; // Skip to next if actor is not visible
            if (P5.mouseX >= a.x && P5.mouseX <= a.x + a.image.image.width && P5.mouseY >= a.y && P5.mouseY <= a.y + a.image.image.height) {
                action = getActionByNameOrWildcard(a.actions, currentVerb);
                if (action) break; // Quit looking and break from for loop
            }
        }

        // If no actor actions were found, try hotspots
        if (!action) {
            for (let h of currentRoom.hotspots) {
                if (P5.mouseX >= h.x1 && P5.mouseX <= h.x2 && P5.mouseY >= h.y1 && P5.mouseY <= h.y2) {
                    action = getActionByNameOrWildcard(h.actions, currentVerb);
                    if (action) break; // Quit looking and break from for loop
                }
            }
        }

        if (action) {
            console.group("Action", action)
            action.action();
            console.groupEnd('Action')
        }
    });

    canvas.mouseReleased(e => {
        isMouseDown = false;
    });

    // Disable right click and handle verb change
    canvas.elt.addEventListener('contextmenu', e => {
        // Disables context menu from appearing
        e.preventDefault();

        // Change the current verb
        let currentVerbIndex = verbs.indexOf(currentVerb);
        let newCurrentVerbIndex = (currentVerbIndex + 1) % verbs.length;
        currentVerb = verbs[newCurrentVerbIndex];
        return false;
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
        if (r.background) {
            r.backgroundImage = getImage(r.background);
        }

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
        if (currentRoom.backgroundImage) {
            P5.image(currentRoom.backgroundImage.image, 0, 0)
        } else {
            P5.background(gameInfo.bgColor)
        }

        // Draw Hotspots (DEBUG)
        currentRoom.hotspots.forEach(h => {
            P5.push()
            P5.noStroke()

            P5.fill(0, 0, 200, 60)

            // If the hotspot has an action for the current verb, draw a yellow box
            if (h.actions.some(a => a.name === currentVerb || a.name === '*')) {
                P5.fill(200, 200, 0, 128)
            }
            // If the hotspot is highlighted by the cursor, draw a red box
            if (P5.mouseX >= h.x1 && P5.mouseX <= h.x2 && P5.mouseY >= h.y1 && P5.mouseY <= h.y2) {
                P5.fill(255, 0, 0, 128)
            }

            P5.rect(h.x1, h.y1, h.x2 - h.x1, h.y2 - h.y1)
            P5.fill(200)


            P5.textSize(16)
            P5.textAlign("right", "bottom")
            P5.text(h.name, h.x2, h.y2)
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


        // Temp, draw current verb, etc.
        P5.push();
        P5.noStroke();
        P5.fill(255, 0, 0)
        P5.textSize(24)
        P5.textAlign("left", "center")
        P5.text(currentVerb, 10, 2 + (gameInfo.fontSize / 2))
        P5.pop();
    }

    // Set Start Room, or fall back to first room
    let initialRoom = gameInfo.rooms.find(r => r.name == gameInfo.startRoom)
    if (!initialRoom) {
        initialRoom = gameInfo.rooms[0]
    }
    setRoom(initialRoom)

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