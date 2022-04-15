const test = require("aqa")

const nop = function () { };

global.p5 = function () {
    this.createCanvas = nop;
    this.background = nop;
    this.stroke = nop;
    this.fill = nop;
    this.textSize = nop;
    this.textAlign = nop;
    this.image = nop;
    this.loadImage = nop;
    this.loadSound = nop;
    this.text = nop;
    
};

//const PNC = require("../engine.js")

test('Test', t => {
    t.is(1, 1);
})