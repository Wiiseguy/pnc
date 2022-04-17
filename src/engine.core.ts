import P5 from "p5";
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

interface IInteractive {
    actions: GameAction[];
}


export class GameActor implements IInteractive {
    name: string;
    actions: GameAction[];
    initialX: number;
    initialY: number;
    x: number;
    y: number;
    imageName: string;
    image: P5.Image;
    constructor(name: string, x: number, y: number, imageName: string) {
        this.name = name;
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.imageName = imageName;
        this.actions = [];
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

export class GameHotspot implements IInteractive {
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
    /** @type {string[]} */
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
    actors: GameActor[];
    images = [];
    sounds = [];
    animations = [];

    customInit = [];
    customDraw = [];

    constructor() {
        this.actors = [];        
    }
}


export function make(g: IGameDescriptor) {
    console.log('hihihihi')
}