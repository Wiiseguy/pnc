const anime = require("animejs").default;
const { SoundFile } = require("p5");
const p5 = require("p5");
globalThis.p5 = p5;
const p5sound = require("p5/lib/addons/p5.sound");
const { GameInfo, CustomContext, GameRoom, GameAction, GameActor, GameSound, BoundingBox } = require("./engine.core");

const P5 = new p5(() => 1337);
globalThis.P5 = P5;

const D_PI = Math.PI / 180;


const gameInfo = new GameInfo();
let verbs = ['use']

let isDebug = !!localStorage.debug;
let currentRoomDef = null;
/** @type {GameRoom} */
let currentRoom = null;
let currentVerb = verbs[0];
let isMouseDown = false;

let actionQueue = [];
let isActionRunning = false;

let currentText = '';

let renderMode = '2d';
let font;

globalThis.NAME = function (name) {
    gameInfo.name = name;
}

globalThis.AUTHOR = function (name) {
    gameInfo.authors.push(name)
}

globalThis.DEBUG = function () {
    isDebug = true;
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

globalThis.RENDER = function (mode) {
    if (mode !== '2d' && mode !== '3d') {
        throw new Error('RENDER: Invalid mode. Must be either "2d" or "3d"');
    }
    renderMode = mode;
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
    let actor = new GameActor(name, def.x, def.y, def.image, def.visible);
    actor.rotation = def.rotation ?? 0;
    actor.scale = def.scale ?? 1;
    actor.rotateSpeed = def.rotateSpeed ?? 0;
    actor.gravity = def.gravity ?? 0;
    actor.friction = def.friction ?? 0;
    actor.xSpeed = def.xSpeed ?? 0;
    actor.ySpeed = def.ySpeed ?? 0;
    actor.alpha = def.alpha ?? 255;
    actor.initialWidth = def.width;
    actor.initialHeight = def.height;
    actor.mousepointer = def.mousepointer;

    // Handle behaviors
    let behaviors = [];
    if (def.behaviors) {
        Object.entries(def.behaviors).forEach(([behaviorName, options]) => {
            let behaviorDef = gameInfo.behaviors.find(behaviorDef => behaviorDef.name === behaviorName);
            if (!behaviorDef) {
                console.warn(`[ACTOR] Behavior ${behaviorName} not found`);
                return;
            }
            behaviors.push({ name: behaviorName, options: options, behavior: behaviorDef });
            if (behaviorDef.state) {
                Object.assign(actor, behaviorDef.state(), options)
            }
        });
    }
    actor.behaviors = behaviors;

    // If we're current handling room defs, add the actor to the current room
    if (currentRoomDef) {
        currentRoomDef.actors.push(actor);
    }
    // Otherwise, add the actor to the global list
    else {
        gameInfo.actors.push(actor);
    }
}

globalThis.IMAGE = function (name, fileName) {
    gameInfo.images.push({
        name,
        fileName,
        image: null
    });
}

globalThis.SPRITE = function (name, imageName, sx, sy, width, height) {
    gameInfo.sprites.push({
        name,
        imageName,
        sx, sy,
        width, height
    });
}

globalThis.ANIMATION = function (name, imageName, duration, frameData) {
    gameInfo.animations.push({
        name,
        imageName,
        duration,
        frameData
    });
}

globalThis.SOUND = function (name, fileName, options) {
    options = {
        volume: 1,
        ...options
    };

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
        onEnter: function () { },
        onEnterOnce: function () { },
        _doneEnterOnce: false
    });
}

globalThis.BEHAVIOR = function (name, behavior) {
    gameInfo.behaviors.push({
        name,
        ...behavior
    })
}

// Room functions
globalThis.BACKGROUND = function (imageName) {
    currentRoomDef.background = imageName;
}
globalThis.COLOR = function (...args) {
    currentRoomDef.bgColor = args;
}
globalThis.PREDRAW = function (fn) {
    currentRoomDef.onBeforeDraw = fn;
}
globalThis.DRAW = function (fn) {
    currentRoomDef.onDraw = fn;
}
globalThis.DESCRIPTION = function (desc) {
    currentRoomDef.description = desc;
}
globalThis.HOTSPOT = function (name, x1, y1, x2, y2) {
    let actor = new GameActor(name, x1, y1, null, true);
    actor.boundingBox = new BoundingBox(x1, y1, x2 - x1, y2 - y1);
    currentRoomDef.hotspots.push(actor);
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
    if (typeof action !== 'function') {
        console.warn('[ENTER] action must be a function, got:', action);
        return;
    }
    currentRoomDef.onEnter = action;
}
globalThis.ONCE = function (action) {
    currentRoomDef.onEnterOnce = action;
}
// ACTOR() is defined earlier in this file


// ACTIONS
let startActionTimeout = null;
function _runNextAction() {
    if (actionQueue.length === 0) {
        isActionRunning = false;
        console.log("Ran all actions.")
        return;
    }

    let action = actionQueue.shift();
    console.log("Running action:", action.name, action.duration)
    action.fn();
    let duration = action.duration ?? 0;

    setTimeout(_runNextAction, duration);
}
function _runActions() {
    isActionRunning = true;
    console.log("Running actions:", actionQueue.map(a => a.name + ' (' + a.duration + 'ms)'))
    _runNextAction(0);
}
function runActions() {
    // Debounce
    clearTimeout(startActionTimeout); // Stop the previous timeout
    startActionTimeout = setTimeout(_runActions, 1) // Start a new timeout
}
function addAction(name, fn, duration) {
    actionQueue.push({
        name,
        fn,
        duration: duration ?? 0
    })
    if (!isActionRunning) {
        runActions();
    }
}
function unimplemented() {
    console.warn("Unimplemented", ...arguments)
}
globalThis.SHOWTEXT = function (text) {
    let duration = 1000 + text.length * 20;
    addAction('ShowText', () => {
        console.log("ShowText:", ...arguments)
        currentText = text;
    }, duration)
    addAction('HideText', () => {
        currentText = '';
    })
}
globalThis.HIDETEXT = function (text) {
    addAction('HideText', () => {
        currentText = '';
    })
}
globalThis.WAIT = function (ms) {
    addAction('Wait', () => {
        // Nothing
    }, ms)
};
globalThis.GOTO = function (room) {
    addAction('GotoRoom', () => {
        actionQueue.length = 0; // Remove everything queued up
        let r = gameInfo.rooms.find(r => r.name == room)
        setRoom(r)
    })
};
globalThis.SHOWACTOR = function (name) {
    addAction('ShowActor', () => {
        let actor = getRoomActor(name);
        if (actor) actor.visible = true;
    })
};
globalThis.HIDEACTOR = function (name) {
    addAction('HideActor', () => {
        let actor = getRoomActor(name);
        if (actor) actor.visible = false;
    })
};
globalThis.TOGGLEACTOR = function (name) {
    addAction('ToggleActor', () => {
        let actor = getRoomActor(name);
        if (actor) actor.visible = !actor.visible;
    })
};
globalThis.MOVEACTOR = function (name, x, y, duration, wait = false, options) {
    options = {
        easing: 'linear',
        ...options
    }
    addAction('MoveActor', () => {
        let actor = getRoomActor(name);
        if (actor) {
            anime({
                targets: actor,
                x: x,
                y: y,
                easing: options.easing,
                duration: duration,
            });
        }
    }, wait ? duration : 0)
};
globalThis.GETACTOR = function (name, fn) {
    addAction('GetActor', () => {
        let actor = getRoomActor(name);
        if (actor && fn) {
            fn(actor)
        }
    })
};
globalThis.PLAYSOUND = function (name, options) {
    addAction('PlaySound', () => {
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
    });
};

globalThis.STOPSOUND = function (name) {
    addAction('StopSound', () => {
        let sound = getSound(name);
        sound.sound.stop()
    })
};
globalThis.LOOPSOUND = function (name, options) {
    addAction('LoopSound', () => {
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
    });
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
    if (!currentRoom._doneEnterOnce) {
        currentRoom._doneEnterOnce = true;
        currentRoom.onEnterOnce();
    }
    localStorage.room = room.name;
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
    let result = currentRoom.actors.find(a => a.name === name)
    if (!result) console.warn(`Actor ${name} not found in room ${currentRoom.name}`)
    return result;
}

function initializeActor(actor) {
    if (actor.imageName) {
        actor.image = getImage(actor.imageName);
        actor.boundingBox = new BoundingBox(actor.x, actor.y, actor.image.width, actor.image.height);
    } else {
        if (actor.initialWidth == null) throw new Error('If no image is specified, initialWidth must be specified');
        if (actor.initialHeight == null) throw new Error('If no image is specified, initialHeight must be specified');
        actor.boundingBox = new BoundingBox(actor.x, actor.y, actor.initialWidth, actor.initialHeight);
    }
}

function applyFriction(obj, friction, propName) {
    if (obj[propName] > 0) {
        obj[propName] -= friction;
        if (obj[propName] < 0) obj[propName] = 0;
    } else if (obj[propName] < 0) {
        obj[propName] += friction;
        if (obj[propName] > 0) obj[propName] = 0;
    }
}

/**
 * 
 * @param {GameActor} actor 
 * @returns 
 */
function drawActor(actor) {
    if (!actor.visible) return;
    // Update props
    actor.x += actor.xSpeed;
    actor.y += actor.ySpeed;
    actor.ySpeed += actor.gravity;
    actor.rotation += actor.rotateSpeed;
    applyFriction(actor, actor.rotateFriction, 'rotateSpeed')
    applyFriction(actor, actor.friction, 'xSpeed')

    // Draw
    if (actor.image) {
        let centerX = actor.image.width / 2;
        let centerY = actor.image.height / 2;
        P5.push();
        P5.translate(actor.x + centerX, actor.y + centerY)
        P5.translate(actor.offsetX, actor.offsetY)
        P5.rotate(actor.rotation * D_PI)
        P5.translate(-centerX, -centerY)
        let sx = actor.image.sx;
        let sy = actor.image.sy;
        if (actor.image.animate) {
            let frame = actor.image.frameData[actor.image.animationState.frame];
            sx = frame.x;
            sy = frame.y;

            if (P5.millis() > actor.image.animationState.lastTime) {
                actor.image.animationState.frame++;
                if (actor.image.animationState.frame >= actor.image.animationState.totalFrames) {
                    actor.image.animationState.frame = 0;
                }
                actor.image.animationState.lastTime = P5.millis() + frame.duration;
            }
        }
        P5.tint(255, actor.alpha)
        P5.image(actor.image.image, 0, 0, actor.image.width, actor.image.height, sx, sy, actor.image.width, actor.image.height)
        P5.pop();
    }

    // Handle behaviors
    actor.behaviors.forEach(b => {
        if (b.behavior.update) b.behavior.update(actor, P5, gameInfo);
        if (b.behavior.draw) b.behavior.draw(actor, P5, gameInfo);
    });
}

function onMousePress(e) {
    if (isActionRunning) {
        console.log("Blocked click, because isActionRunning == true");
        return;
    }
    if (P5.mouseButton != 'left') return;

    isMouseDown = true;

    let action = null;
    let target = null;

    for (let i = currentRoom.actors.length - 1; i >= 0; i--) {
        let a = currentRoom.actors[i];
        if (!a.visible) continue; // Skip to next if actor is not visible
        if (a.boundingBox.contains(P5.mouseX, P5.mouseY)) {
            action = getActionByNameOrWildcard(a.actions, currentVerb);
            if (action) {
                target = a;
                break; // Quit looking and break from for loop
            }
        }
    }

    // If no actor actions were found, try hotspots
    if (!action) {
        for (let i = currentRoom.hotspots.length - 1; i >= 0; i--) {
            let h = currentRoom.hotspots[i];
            if (h.boundingBox.contains(P5.mouseX, P5.mouseY)) {
                action = getActionByNameOrWildcard(h.actions, currentVerb);
                if (action) {
                    target = h;
                    break; // Quit looking and break from for loop
                }
            }
        }
    }

    if (action) {
        console.group("Action", action)
        action.action(target);
        console.groupEnd('Action')
    }
}

function onMouseRelease(e) {
    isMouseDown = false;
}

function onRightClick(e) {
    // Disables context menu from appearing
    e.preventDefault();

    // Change the current verb
    let currentVerbIndex = verbs.indexOf(currentVerb);
    let newCurrentVerbIndex = (currentVerbIndex + 1) % verbs.length;
    currentVerb = verbs[newCurrentVerbIndex];
    return false;
}

function onKeyPress(e) {
    console.log(e);

    if (e.code == 'KeyD') {
        isDebug = !isDebug;
        if (isDebug) {
            localStorage.debug = true;
        } else {
            delete localStorage.debug;
        }
        console.log("Debug mode:", isDebug);
    }
    if (e.code === 'KeyR') {
        delete localStorage.room
        location.reload();
    }
}

function initialize() {
    console.log("GameInfo:", gameInfo)

    let p5RenderMode = renderMode === '3d' ? P5.WEBGL : P5.P2D;
    const canvas = P5.createCanvas(gameInfo.width, gameInfo.height, p5RenderMode);    

    if (renderMode === '3d') {
        P5.textFont(font);
    }

    // Bind DOM events
    P5.keyPressed = onKeyPress;
    canvas.mousePressed(onMousePress);
    canvas.mouseReleased(onMouseRelease);
    // Disable right click and handle verb change
    canvas.elt.addEventListener('contextmenu', onRightClick);

    const context = new CustomContext({
        p5: P5,
        gameInfo: gameInfo,
        canvas: canvas
    })

    // Initialize sprites
    gameInfo.sprites.forEach(spr => {
        let img = gameInfo.images.find(i => i.name == spr.imageName);
        gameInfo.images.push({
            ...img,
            ...spr
        })
    })

    // Initialize animations
    gameInfo.animations.forEach(a => {
        let img = gameInfo.images.find(i => i.name == a.imageName);
        let frameData = [];
        let width = img.width;
        let height = img.height;
        if (typeof a.frameData[0] === 'number') {
            let cols = a.frameData[0];
            let rows = a.frameData[1];
            width = img.width / cols;
            height = img.height / rows;
            for (let ih = 0; ih < rows; ih++) {
                for (let iw = 0; iw < cols; iw++) {
                    frameData.push({
                        x: iw * width,
                        y: ih * height,
                        width: width,
                        height: height,
                        duration: a.duration
                    })
                }
            }
        }

        gameInfo.images.push({
            ...img,
            ...a,
            animate: true,
            frameData,
            width,
            height,
            animationState: {
                ...img.animationState,
                totalFrames: frameData.length,
            }
        })
    })

    // Initialize rooms
    gameInfo.rooms.forEach(r => {
        currentRoomDef = r;
        r.roomInitFn(context);
        if (r.background) {
            r.backgroundImage = getImage(r.background);
        }

        r.actors.forEach(initializeActor)
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
        if (renderMode === '3d') {
            P5.translate(-gameInfo.width / 2, -gameInfo.height / 2);
        }        
        
        // Draw Background
        if (currentRoom.bgColor) {
            P5.background(currentRoom.bgColor);
        } else {
            P5.background(gameInfo.bgColor)
        }
        if (currentRoom.backgroundImage) {
            P5.image(currentRoom.backgroundImage.image, 0, 0)
        }
        if (currentRoom.onBeforeDraw) {
            P5.push();
            currentRoom.onBeforeDraw(context, currentRoom);
            P5.pop();
        }

        // Determine cursor
        let hovering = false;
        let hoveringObject = null;
        [...currentRoom.actors, ...currentRoom.hotspots].forEach(h => {
            if (!h.visible) return;
            if (h.actions.some(a => a.name === currentVerb || a.name === '*') && h.boundingBox.contains(P5.mouseX, P5.mouseY)) {
                hovering = true;
                hoveringObject = h;
            }          
        })
        if (isActionRunning) {
            P5.cursor('none');
            //P5.cursor('wait'); // Show spinning cursor
        }
        else if (hovering && !isActionRunning) {
            console.log(hoveringObject.mousepointer)
        }
        else {
            P5.cursor(require('url:./data/TestAdv/cur_pointer.png')) 
        }        

        if (isDebug) {
            // Draw Actor hotspots
            currentRoom.actors.forEach(h => {
                P5.push()
                P5.noStroke()

                P5.fill(0, 0, 200, 60)

                // If the actor has an action for the current verb, draw a yellow box
                if (h.actions.some(a => a.name === currentVerb || a.name === '*')) {
                    P5.fill(200, 200, 0, 128)
                }
                // If the actor is highlighted by the cursor, draw a red box
                if (h.boundingBox.contains(P5.mouseX, P5.mouseY)) {
                    P5.fill(255, 0, 0, 128)
                }

                P5.rect(h.boundingBox.x - 2, h.boundingBox.y - 2, h.boundingBox.width + 4, h.boundingBox.height + 4)
                P5.fill(200)
                P5.pop()
            })
            // Draw Hotspots
            currentRoom.hotspots.forEach(h => {
                P5.push()
                P5.noStroke()

                P5.fill(0, 0, 200, 60)

                // If the hotspot has an action for the current verb, draw a yellow box
                if (h.actions.some(a => a.name === currentVerb || a.name === '*')) {
                    P5.fill(200, 200, 0, 80)
                }
                // If the hotspot is highlighted by the cursor, draw a red box
                if (h.boundingBox.contains(P5.mouseX, P5.mouseY)) {
                    P5.fill(255, 200, 0, 128)
                }

                P5.rect(h.boundingBox.x, h.boundingBox.y, h.boundingBox.width, h.boundingBox.height)
                P5.fill(200)


                P5.textSize(16)
                P5.textAlign("right", "bottom")
                P5.text(h.name, h.x2, h.y2)
                P5.pop()
            })
        }

        // Draw Current Room Actors
        currentRoom.actors.forEach(drawActor)

        // Draw Global Actors
        gameInfo.actors.forEach(drawActor)

        // Call custom draw functions
        gameInfo.customDraw.forEach(fn => {
            fn(context)
        })

        // Call current room's custom draw function
        if (currentRoom.onDraw) {
            P5.push();
            currentRoom.onDraw(context, currentRoom);
            P5.pop();
        }

        // Draw current text
        if (currentText) {
            P5.push();
            P5.noStroke();
            P5.fill(0, 0, 0, 180)
            P5.rect(0, gameInfo.height - gameInfo.fontSize*4, gameInfo.width, gameInfo.fontSize*4);
            P5.fill(255, 255, 255)
            P5.text(currentText, gameInfo.fontSize, gameInfo.height - gameInfo.fontSize*4, gameInfo.width-(gameInfo.fontSize*2), gameInfo.fontSize*4, "center", "bottom");
            P5.pop();
        }

        // Temp, draw current verb, etc.
        if (isDebug) {
            P5.push();
            P5.noStroke();
            P5.fill(255, 0, 0)
            P5.textSize(24)
            P5.textAlign("left", "top")
            P5.text(currentVerb, 10, 2 + (gameInfo.fontSize / 2))

            actionQueue.forEach((action, i) => {
                P5.text(`${action.name} (${action.duration ?? 0}ms)`, 10, 30 + (gameInfo.fontSize / 2) + (i * gameInfo.fontSize))
            })
            P5.pop();
        }
    }

    // Set Start Room, or fall back to first room
    let initialRoom = null;
    if (isDebug) {
        initialRoom = gameInfo.rooms.find(r => r.name == localStorage.room);
    }
    if (!initialRoom) {
        initialRoom = gameInfo.rooms.find(r => r.name == gameInfo.startRoom)        
    }
    if (!initialRoom) {
        console.warn(`Start room '${gameInfo.startRoom}' not found. Falling back to first room.`)
        initialRoom = gameInfo.rooms[0]
    }

    setRoom(initialRoom)

    // Initialization complete
    console.log("Initialized")
}

P5.preload = function () {
    console.log("Preload")

    if (renderMode === '3d') {
        font = P5.loadFont(require('url:./data/Swansea.ttf'));
    }
    

    // Preload images
    // by doing this inside p5's preload(), setup() won't be called until all assets are loaded
    gameInfo.images.forEach(img => {
        img.image = P5.loadImage(img.fileName, image => {
            img.sx = img.sx ?? 0;
            img.sy = img.sy ?? 0;
            img.width = img.image.width;
            img.height = img.image.height;
            img.animate = false;
            img.frameData = [];
            img.animationState = {
                frame: 0,
                lastTime: 0,
                totalFrames: 1
            };
        });
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