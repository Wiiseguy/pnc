import p5 from "p5";
import P5, { Phrase } from "p5";
import "p5/lib/addons/p5.sound";


export interface IGameDescriptorActor {
    x: number;
    y: number;
    image: string;
}

interface IGameDescriptor {
    actors: IGameDescriptorActor[]
}

export class CustomContext {
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

export class GameObject {
    x: number = 0;
    y: number = 0;
    xSpeed: number = 0;
    ySpeed: number = 0;
    friction: number = 0;

    fade: number = 1;
    scale: number = 1;

    rotation: number = 0;
    rotateSpeed: number = 0;
    rotateFriction: number = 0;
}

export class GameSound {
    name = "";
    fileName = "";
    sound: p5.SoundFile = null;
    defaultVolume: number = 1;
    constructor(s) {
        this.sound = s.sound;
        this.name = s.name;
        this.fileName = s.fileName;
    }
}

export class GameActor extends GameObject {
    name: string;
    actions: GameAction[];
    initialX: number;
    initialY: number;
    imageName: string;
    image: P5.Image;
    visible: boolean;
    constructor(name: string, x: number, y: number, imageName: string, visible: boolean) {
        super();
        this.name = name;
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.imageName = imageName;
        this.actions = [];
        this.visible = visible ?? true;
    }
}

export class GameAction {
    name: string;
    action: (context: CustomContext) => void;
    constructor(name, action) {
        this.name = name;
        this.action = action;
    }
}

export class GameHotspot {
    name: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    actions: GameAction[];
    constructor(c) {
        this.name = c.name;
        this.x1 = c.x1;
        this.y1 = c.y1;
        this.x2 = c.x2;
        this.y2 = c.y2;
        this.actions = c.actions;
    }
}

export class GameRoom {
    name: string;
    hotspots: GameHotspot[];
    actors: GameActor[];
    constructor(c) {
        this.name = c.name;
        this.hotspots = c.hotspots;
        this.actors = c.actors;
    }
}

export class GameInfo {
    version = 1;
    name = "";
    authors: string[] = [];
    copyright = "";
    dateCreated = "";
    dateModified = "";
    description = "";
    width = 640;
    height = 480;
    fontSize = 16;
    bgColor: p5.Color;
    skipIntro = false;
    startRoom = "";
    rooms = [];
    actors: GameActor[] = [];
    images = [];
    sprites = [];
    sounds: GameSound[] = [];
    animations = [];

    customInit = [];
    customDraw = [];

    constructor() {
        
    }
}


export function make(g: IGameDescriptor) {
    console.log('hihihihi')
}