import p5 from 'p5'

export interface IGameDescriptorActor {
    x: number
    y: number
    image: string
}

interface IGameDescriptor {
    actors: IGameDescriptorActor[]
}

export class CustomContext {
    /** @type {p5} */
    p5 = null
    /** @type {p5.Renderer} */
    canvas = null
    /** @type {p5.GameInfo} */
    gameInfo = null
    constructor(c) {
        this.p5 = c.p5
        this.canvas = c.canvas
        this.gameInfo = c.gameInfo
    }
}

export class BoundingBox {
    x: number
    y: number
    width: number
    height: number
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    contains(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height
    }
}

export class GameObject {
    initialX: number = 0
    initialY: number = 0
    initialWidth: number = null
    initialHeight: number = null
    _x = 0
    _y = 0
    get x() {
        return this._x
    }
    get y() {
        return this._y
    }
    set x(value) {
        this._x = value
        this.boundingBox.x = value
    }
    set y(value) {
        this._y = value
        this.boundingBox.y = value
    }
    get height() {
        return this.boundingBox.height
    }
    get width() {
        return this.boundingBox.width
    }
    xSpeed: number = 0
    ySpeed: number = 0
    friction: number = 0
    gravity: number = 0

    fade: number = 1
    scale: number = 1
    offsetX: number = 0
    offsetY: number = 0

    rotation: number = 0
    rotateSpeed: number = 0
    rotateFriction: number = 0

    boundingBox: BoundingBox = new BoundingBox(0, 0, 0, 0)
}

export class GameSound {
    name = ''
    fileName = ''
    sound: p5.SoundFile = null
    defaultVolume: number = 1
    constructor(s) {
        this.sound = s.sound
        this.name = s.name
        this.fileName = s.fileName
    }
}

export class GameActor extends GameObject {
    name: string
    actions: GameAction[]
    imageName: string
    image: P5.Image
    visible: boolean
    alpha: number
    mousepointer: string
    behaviors = []
    constructor(name: string, x: number, y: number, imageName: string, visible: boolean, mousepointer?: string) {
        super()
        this.name = name
        this.initialX = x
        this.initialY = y
        this.x = x
        this.y = y
        this.imageName = imageName
        this.actions = []
        this.visible = visible ?? true
        this.mousepointer = mousepointer
    }
}

export class GameAction {
    name: string
    action: (context: CustomContext) => void
    constructor(name, action) {
        this.name = name
        this.action = action
    }
}

export class GameRoom {
    name: string
    hotspots: GameActor[]
    actors: GameActor[]
    constructor(c) {
        this.name = c.name
        this.hotspots = c.hotspots
        this.actors = c.actors
    }
}

export class GameInfo {
    version = 1
    name = ''
    authors: string[] = []
    copyright = ''
    dateCreated = ''
    dateModified = ''
    description = ''
    width = 640
    height = 480
    fontSize = 16
    bgColor: p5.Color
    skipIntro = false
    startRoom = ''
    rooms = []
    actors: GameActor[] = []
    images = []
    sprites = []
    sounds: GameSound[] = []
    animations = []
    behaviors = []

    customInit = []
    customDraw = []

    constructor() {}
}

export function make(g: IGameDescriptor) {
    console.log('hihihihi')
}
