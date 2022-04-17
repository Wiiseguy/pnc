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


export class GameActor {
    initialX: number;
    initialY: number;
    x: number;
    y: number;
    image: P5.Image;
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