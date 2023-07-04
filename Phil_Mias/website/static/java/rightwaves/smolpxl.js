"use strict";

// TODO: make buttons background black?

const Smolpxl = {};

(function() {

/**
 * @typedef Point
 * @type {[number, number]}
 * @property {number} 0 - x coordinate
 * @property {number} 1 - y coordinate
 */

/**
 * @typedef Direction
 * @type {[number, number]}
 * @property {number} 0 - one of -1, 0 or 1 - the x coordinate
 * @property {number} 1 - one of -1, 0 or 1 - the y coordinate
 */

/**
 * @type {Object.<string, Direction>}
 */
const directions = {
    UP:    [ 0, -1],
    DOWN:  [ 0,  1],
    LEFT:  [-1,  0],
    RIGHT: [ 1,  0]
};

/**
 * @typedef Color
 * @type {[number, number, number]}
 * @property {number} 0 - red value (0-255)
 * @property {number} 1 - green value (0-255)
 * @property {number} 2 - blue value (0-255)
 */

/**
 * Some well-known colors.
 * @type {Object.<string, Color>}
 */
const colors = {
    BLACK: [0, 0, 0],
    BLUE: [0, 0, 255],
    LIGHT_BLUE: [128, 128, 255],
    LIGHT_GREY: [200, 200, 200],
    GREEN: [0, 255, 0],
    GREY: [128, 128, 128],
    RED: [255, 0, 0],
    WHITE: [255, 255, 255]
};

const backSvg = '<svg aria-label="left" class="leftimg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
const likeSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
const likedSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" style="fill:#ff0039;fill-opacity:1"/></svg>';
const shareSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
const codeSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>';

const upSvg = '<svg aria-label="up" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
const downSvg = '<svg aria-label="down" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>';
const leftSvg = backSvg;
const rightSvg = '<svg aria-label="right" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';

const minimiseSvg = '<svg aria-label="minimize" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minimize-2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
const maximiseSvg = '<svg aria-label="maximize" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';

// How many steps to catch up by if display is lagging
const MAX_EXTRA_STEPS = 10;
const SHAREON_CSS = 'https://cdn.jsdelivr.net/npm/shareon@1/dist/shareon.min.css';
const SHAREON_JS  = 'https://cdn.jsdelivr.net/npm/shareon@1/dist/noinit/shareon.min.js';

/**
 * @typedef KeyInputDef
 * @type {object}
 * @property {string} code - the character code name for a key
 * @property {string=} name - the display name we will use for the key
 */

/**
 * @typedef InputDef
 * @type {object}
 * @property {KeyInputDef} keys - which keys constitute this input
 */

/**
 * All the known button/key inputs we might receive.
 * @type {Object.<string, InputDef>}
 */
const INPUT = {
    BUTTON1: {
        keys: {code: " ", name: "Space"},
        touch: {name: "Fire"}
    },
    BUTTON2: {
        keys: {code: "z"},
        touch: {name: "Fire 2"}
    },
    MENU: {
        keys: {code: "Escape", name: "Esc"},
        touch: {name: "Menu"}
    },
    SELECT: {
        keys: {code: "Enter"},
        touch: {name: "Select"}
    },
    UP: {
        keys: {code: "ArrowUp", name: "Up"},
        touch: {name: "Up"}
    },
    DOWN: {
        keys: {code: "ArrowDown", name: "Down"},
        touch: {name: "Down"}
    },
    LEFT: {
        keys: {code: "ArrowLeft", name: "Left"},
        touch: {name: "Left"}
    },
    RIGHT: {
        keys: {code: "ArrowRight", name: "Right"},
        touch: {name: "Right"}
    }
};

const KEY_CODES = {};
for (var name in INPUT) {
    if (INPUT.hasOwnProperty(name)) {
        KEY_CODES[INPUT[name].keys.code] = name;
    }
}

const MOUSE_BUTTONS = ["LEFT_CLICK", "MIDDLE_CLICK", "RIGHT_CLICK"];

// Public functions

/**
 * Move a point.
 *
 * @param {Point} pos - the starting position.
 * @param {Direction} dir - the direction to move.
 * @param {number} steps - the number of steps to move.
 * @returns {Point} the point you reach if you take steps steps from pos in
 *                  direction dir.
 */
function coordMoved(pos, dir, steps) {
    if (steps == undefined) {
        steps = 1;
    }
    return [ pos[0] + dir[0] * steps, pos[1] + dir[1] * steps ];
}

/**
 * Shallow array equality.  Suitable for comparing Color or Point instances.
 *
 * @param {array} arr1 - the first array.
 * @param {array} arr2 - the second array.
 * @returns {boolean} true if arr1 and arr2 have equal elements.
 */
function equalArrays(arr1, arr2) {
    // Array equality where all array items are assumed to be primitive
    if (arr1.length !== arr2.length) {
        return false;
    }
    for(let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

/**
 * @param {number} min the minimum value.
 * @param {number} max the maximum value.
 * @returns {number} a randomly-chosen integer a where min <= a <= max.
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Decide whether two directions are opposite.
 *
 * @param {Direction} d1 the first direction.
 * @param {Direction} d2 the second direction.
 * @returns {boolean} true if d1 and d2 represent opposite directions.
 */
function areOpposite(d1, d2) {
    return (d1[0] === -d2[0] && d1[1] === -d2[1]);
}

function arrayIncludesArray(arrayOfArrays, searchForArray) {
    return arrayOfArrays.some(x => equalArrays(x, searchForArray));
}

/**
 * Convert a directional input into a direction.
 *
 * @param {string} inp - the name of the input.
 * @returns {Direction} the direction represented by the input supplied, or
 *                      undefined if inp is not a directional input.
 */
function inputToDirection(inp) {
    switch (inp) {
        case "UP": return directions.UP;
        case "DOWN": return directions.DOWN;
        case "LEFT": return directions.LEFT;
        case "RIGHT": return directions.RIGHT;
    }
}

/**
 * @typedef Rectangle
 * @type {object}
 * @property {number} x - x coordinate of the top left corner.
 * @property {number} y - y coordinate of the top left corner.
 * @property {number} w - width.
 * @property {number} h - height.
 */

/**
 * Decide whether a point is inside a rectangle.
 *
 * @param {Rectangle} rect - the rectangle.
 * @param {number} x - the x coordinate of the point.
 * @param {number} y - the y coordinate of the point.
 * @return {boolean} true if the point (x, y) is strictly inside rect (not
 *                   on the line).
 */
function insideRectangle(rect, x, y) {
    return (
        x > rect.x &&
        x < rect.x + rect.w &&
        y > rect.y &&
        y < rect.y + rect.h
    );
}

/**
 * Decide whether two rectangles overlap.
 *
 * @param {Rectangle} rect1 - the first rectangle.
 * @param {Rectangle} rect2 - the second rectangle.
 * @return {boolean} true if rect1 and rect2 overlap (not if they only touch).
 */
function rectanglesOverlap(rect1, rect2) {
    const br1x = rect1.x + rect1.w;
    const br1y = rect1.y + rect1.h;

    return (
        insideRectangle(rect2, rect1.x, rect1.y) ||
        insideRectangle(rect2, br1x,     rect1.y) ||
        insideRectangle(rect2, rect1.x, br1y)     ||
        insideRectangle(rect2, br1x,     br1y)
    );
}

// Private functions

function colorAsRgb(color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]';
}

function modifierPressed(evt) {
    return (
        (evt.altKey   && evt.key !== "Alt")  ||
        (evt.ctrlKey  && evt.key !== "Control") ||
        (evt.metaKey  && evt.key !== "Meta") ||
        (evt.shiftKey && evt.key !== "Shift")
    );
}

function sizeMessageText(canvas, overlayInside, maxSize) {
    const ms = maxSize ? maxSize : 0.5;
    let numChildren = overlayInside.element.children.length;
    if (numChildren === 0) {
        numChildren = 1;
    }
    let prop = 1.0 / numChildren;
    if (prop > maxSize) {
        prop = maxSize;
    }
    const fs = canvas.element.clientHeight * 0.65 * prop;
    const ch = canvas.element.clientHeight * 0.70 * prop;
    overlayInside.fontSize(fs);
    for (const child of overlayInside.children()) {
        child.height(ch);
        child.lineHeight(ch);
        child.fontSize(fs);
        const wrel = (
            child.element.clientWidth /
                (canvas.element.clientWidth * 0.9)
        );
        if (wrel > 1.0) {
            child.fontSize(fs/wrel);
        }
    }
}

function statsEvent(metric) {
    var req = new XMLHttpRequest();
    req.open("POST", "https://smolpxl.artificialworlds.net/s/event.php", true);
    req.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
    req.send(metric);
}

function svg_for_key(key) {
    if (key === "UP") {
        return upSvg;
    } else if (key === "DOWN") {
        return downSvg;
    } else if (key === "LEFT") {
        return leftSvg;
    } else if (key === "RIGHT") {
        return rightSvg;
    } else {
        return null;
    }
}


class RunningGame {
    constructor(gameInternals) {
        this._ = gameInternals;
        this.screen = new ReadOnlyScreen(
            this._, this._.prevPixels, this._.width, this._.height);
    }

    menuOff() {this._.menu.off();}
    menuOut() {this._.menu.out();}
    endGame() {this._.endGame();}
    startRecordingReplay() {this._.startRecordingReplay();}
    stopRecordingReplay() {this._.stopRecordingReplay();}
    startPlayingFullReplay() {this._.startPlayingFullReplay();}
    startPlayingGameOverReplay() {this._.startPlayingGameOverReplay();}
    stopPlayingReplay() {this._.stopPlayingReplay();}
    frameTimeMs() {return this._.frameTime;}

    input() {
        return this._.pendingInput.slice();
    }

    /**
     * Did we receive this input during the previous time step?
     * If so, return it.
     *
     * Example:
     *  function update(runningGame, model) {
     *      if (runningGame.receivedInput("BUTTON1")) {
     *          // Button 1 was pressed!
     *
     * @param {String} name
     * @returns {object} the first input we received that has the provided
     *                   name, or undefined if we did not receive such an
     *                   input.
     */
    receivedInput(name) {
        return this._.pendingInput.find(i => i.name === name);
    }
}

class Screen {
    constructor(gameInternals, pixels, width, height) {
        this._ = gameInternals;
        this.pixels = pixels;
        this.width = width;
        this.height = height;
        this.minX = 0;
        this.minY = 0;
    }
    get_pixels() {
        return this.pixels;
    }
    get_width() {
        return this.width;
    }
    get_height() {
        return this.height;
    }
    get maxX() { return this.width - 1; }
    get maxY() { return this.height - 1; }
    at(x, y) {
        if (
            this.pixels === null ||
            x < 0 || x >= this.width ||
            y < 0 || y >= this.height
        ) {
            return [undefined, undefined, undefined];
        }
        const off = ((y * this.width) + x) * 4;
        if (off < 0 || off >= this.pixels.length) {
            return [undefined, undefined, undefined];
        } else {
            return this.pixels.slice(off, off + 3);
        }
    }
    get xs() { return function*() {
        for (let i = 0; i < this.width; i++) {
            yield i;
        }
    }}
    get ys() { return function*() {
        for (let i = 0; i < this.height; i++) {
            yield i;
        }
    }}
    messageTopLeft(msg)      {this._.barMessage(msg, this._.dom.topLeft);}
    messageTopMiddle(msg)    {this._.barMessage(msg, this._.dom.topMiddle);}
    messageTopRight(msg)     {this._.barMessage(msg, this._.dom.topRight);}
    messageBottomLeft(msg)   {this._.barMessage(msg, this._.dom.bottomLeft);}
    messageBottomMiddle(msg) {this._.barMessage(msg, this._.dom.bottomMiddle);}
    messageBottomRight(msg)  {this._.barMessage(msg, this._.dom.bottomRight);}
    playbackFrame() {
        return this._.replays.playbackFrame();
    }
}

class ModifiableScreen extends Screen {
    constructor(gameInternals, pixels, width, height, canvasCtx) {
        super(gameInternals, pixels, width, height);
        this._dim = false;
        this._message = [];
        this._positionedText = [];
        this._canvasCtx = canvasCtx;
    }

    setBackgroundColor(color) {
        this._.backgroundColor = color;
    }

    setSize(width, height) {
        this._.width = width;
        this._.height = height;
    }

    /**
     * Draw a pixel-art image on the screen.
     *
     * For example, to draw a little circle:
     * screen.draw(20, 20, [
     *  "..##..",
     *  ".#..#.",
     *  "#....#",
     *  "#....#",
     *  ".#..#.",
     *  "..##.."
     * ]);
     *
     * @param {number} x - the x coordinate of where the the top-left of the
     *                     image will be drawn.
     * @param {number} y - the y coordinate of where the the top-left of the
     *                     image will be drawn.
     * @param {array} pixels - an array of Strings, creating a grid of
     *                characters to draw.  The meaning of each character is
     *                specified by color_spec.
     * @param {object=} color_spec - if provided, specifies which colors to use
     *                  for each character.  If not provided, defaults
     *                  to:
     *                  {
     *                      '.': null,
     *                      '#': Smolpxl.colors.BLACK
     *                  }
     */
    draw(x, y, pixels, color_spec) {
        if (!color_spec) {
            color_spec = {
                '.': null,
                '#': colors.BLACK
            };
        }
        let yoff = 0;
        let xoff;
        for (const ln of pixels) {
            xoff = 0;
            for (const ch of ln) {
                if (color_spec[ch]) {
                    this.set(x + xoff, y + yoff, color_spec[ch])
                }
                xoff++;
            }
            yoff++;
        }
    }
    rect(x, y, w, h, color) {
        x = Math.round(x);
        y = Math.round(y);
        w = Math.round(w);
        h = Math.round(h);
        // TODO: we can make this faster by editing pixels directly here
        for (let yi = y; yi < y + h; yi++) {
            for (let xi = x; xi < x + w; xi++) {
                this.set(xi, yi, color);
            }
        }
    }
    set(x, y, color) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        const off = ((y * this.width) + x) * 4;
        this.pixels[off] = color[0];
        this.pixels[off + 1] = color[1];
        this.pixels[off + 2] = color[2];
        this.pixels[off + 3] = 255;
    }
    setFrom(screen) {
        if (!screen) {
            return;
        }
        // TODO: slow?
        for (let i = 0; i < screen.pixels.length; i++) {
            this.pixels[i] = screen.pixels[i];
        }
    }
    dim() {
        this._dim = true;
    }
    message(text) {
        this._message = text;
    }
    addText(spec) {
        this._positionedText.push(spec);
    }
    textWidth(heightPx, text) {
        const fontVariant = window.getComputedStyle(
            this._.dom.mainDiv.element)["font-variant"];
        const fontFamily = window.getComputedStyle(
            this._.dom.mainDiv.element)["font-family"];
        this._canvasCtx.font = `${fontVariant} ${heightPx}px ${fontFamily}`;
        const mt = this._canvasCtx.measureText(this._.replaceInput(text))
        return mt.width;
    }
}

class ReadOnlyScreen extends Screen {
    constructor(gameInternals, pixels, width, height) {
        super(gameInternals, pixels, width, height);
    }
    cloneModifiable() {
        let ret;
        if (this.pixels === null) {
            ret = [];
            ret.length = this.width * this.height * 4;
        } else {
            ret = this.pixels.slice();
        }
        return new ModifiableScreen(this._, ret, this.width, this.height);
    }
}

class Menu {
    constructor(items, dom, stopAnimation, startAnimation) {
        this.dom = dom;
        this.stopAnimation = stopAnimation;
        this.startAnimation = startAnimation;
        this.items = items || [{"text": "Continue", "fn": () => this.off()}];
        this.pos = [];
    }

    off() {
        this.pos = [];
        this.dom.menu.style("display", "none");
        this.startAnimation();
    }

    render() {
        if (!this.isVisible()) {
            this.off();
        }
        let items = this.items;
        let pos = this.pos.slice();
        while (pos.length > 1) {
            items = items[pos[0]].items;
            pos.splice(0, 1);
        }
        for (let i = 0; i < items.length; i++) {
            const text = items[i].text;
            const onclick = items[i].fn;
            let button = this.dom.menuInside.element.children[i];
            if (button === undefined) {
                button = document.createElement("button");
                this.dom.menuInside.element.appendChild(button);
            }
            if (button.innerText !== text) {
                button.innerText = text;
            }
            if (onclick === undefined) {
                button.onclick = () => menuIn(rightwaves_game, i);
            } else {
                button.onclick = () => {onclick(); this.render();}
            }
        }
        while (this.dom.menuInside.element.children.length > items.length) {
            this.dom.menuInside.element.lastChild.remove()
        }
        sizeMessageText(this.dom.canvas, this.dom.menuInside, 0.15);
    }

    isVisible() {
        return (this.pos.length !== 0);
    }

    moveIn(i) {
        this.pos.splice(-1, 1, i, 0);
        this.render();
        this.dom.menuInside.element.firstChild.focus();
        this.dom.menuInside.element.firstChild.scrollTo();
    }

    moveUp(evt) {
        const cur = document.activeElement;
        if (cur.parentElement === this.dom.menuInside.element) {
            const prev = cur.previousSibling;
            if (prev) {
                prev.focus();
                prev.scrollTo();
            } else {
                this.dom.menuInside.element.lastChild.focus();
                this.dom.menuInside.element.lastChild.scrollTo();
            }
        } else {
            this.dom.menuInside.element.firstChild.focus();
            this.dom.menuInside.element.firstChild.scrollTo();
        }
        evt.preventDefault();
    }

    moveDown(evt) {
        const cur = document.activeElement;
        if (cur.parentElement === this.dom.menuInside.element) {
            const next = cur.nextSibling;
            if (next) {
                next.focus();
                next.scrollTo();
            } else {
                this.dom.menuInside.element.firstChild.focus();
                this.dom.menuInside.element.firstChild.scrollTo();
            }
        } else {
            this.dom.menuInside.element.lastChild.focus();
            this.dom.menuInside.element.lastChild.scrollTo();
        }
        evt.preventDefault();
    }

    select(evt) {
        // TODO: document.activeElement is undermined by clicking a keyboard
        //       button.  Find another way to track which menu item is
        //       selected, probably using onFocus events on the items.
        const cur = document.activeElement;
        if (cur.parentElement === this.dom.menuInside.element) {
            cur.click();
            evt.preventDefault();
        }
    }

    moveOut() {
        this.pos.pop();
        this.render();
    }

    on() {
        this.pos = [0];
        this.stopAnimation();
        this.dom.menu.style("display", "block");
        this.render();
        this.dom.menuInside.element.firstChild.focus();
        this.dom.menuInside.element.firstChild.scrollTo();
    }

    onKeyDown(evt, key) {
        switch (key) {
            case "UP":     return this.moveUp(evt);
            case "DOWN":   return this.moveDown(evt);
            case "SELECT": return this.select(evt);
            case "MENU":   return this.moveOut();
        }
    }
}


class MiniDom {
    constructor(element) {
        this.element = element;
    }

    add(spec) {
        if (!spec.hasOwnProperty("_tag")) {
            if (!spec.hasOwnProperty("_text")) {
                throw Error(
                    `Elements spec '${JSON.stringify(spec)}' must have ` +
                    "either 'tag_' or 'text_' attributes, or both."
                );
            } else {
                this.element.innerHTML += spec["_text"];
                return;
            }
        }
        const id = spec["id"];
        const tag = spec["_tag"];
        const child_element = document.createElement(tag);
        for (const prop in spec) {
            if (prop[0] === "_") {
                continue;
            }
            child_element.setAttribute(prop, spec[prop]);
        }
        this.element.appendChild(child_element);
        const child = new MiniDom(child_element);
        if (spec.hasOwnProperty("_text")) {
            child_element.innerText = spec["_text"];
        }
        if (spec.hasOwnProperty("_children")) {
            for (const child_spec of spec["_children"]) {
                child.add(child_spec);
            }
        }
        if (id) {
            this[id] = child;
        }
        return child;
    }

    addFirst(spec) {
        let node = this.add(spec);
        this.element.insertBefore(node.element, this.element.firstChild);
    }

    *children() {
        for (const el of this.element.children) {
            yield new MiniDom(el);
        }
    }

    style(property, value) {
        if (this.element.style[property] !== value) {
            this.element.style[property] = value;
        }
    }

    text(text) {
        if (this.element.innerText !== text) {
            this.element.innerText = text;
        }
    }

    backgroundColor(color) {
        this.style("backgroundColor", colorAsRgb(color));
    }

    color(color) {this.style("color", colorAsRgb(color));}
    fontSize(pixels) {this.style("fontSize", pixels + "px");}
    lineHeight(pixels) {this.style("lineHeight", pixels + "px");}
    width(pixels) {this.style("width", pixels + "px");}
    height(pixels) {this.style("height", pixels + "px");}
    _top(pixels) {this.style("top", pixels + "px");}
    left(pixels) {this.style("left", pixels + "px");}
}

class SmolpxlDom {
    constructor(container_element) {
        let container = new MiniDom(container_element);
        // TODO: use classes instead of ids, to allow multiple games
        //       on one page.
        container.add(
            { "_tag": "div", "id": "mainDiv", "_children": [
                { "_tag": "div", "id": "topBar", "class": "bar", "_children": [
                    { "_tag": "span", "id": "topLeft" },
                    { "_tag": "span", "id": "topMiddle" },
                    { "_tag": "span", "id": "topRight" },
                ]},
                { "_tag": "div", "id": "menu", "class": "overlay",
                    "_children": [
                        { "_tag": "div", "id": "menuInside",
                            "class": "overlayInside" }
                    ]
                },
                { "_tag": "div", "id": "message", "class": "overlay",
                    "_children": [
                        { "_tag": "div", "id": "messageInside",
                            "class": "overlayInside" }
                    ]
                },
                { "_tag": "canvas", "id": "canvas",
                    "width": "256", "height": "192" },
                { "_tag": "div", "id": "bottomBar", "class": "bar",
                    "_children": [
                        { "_tag": "span", "id": "bottomLeft" },
                        { "_tag": "span", "id": "bottomMiddle" },
                        { "_tag": "span", "id": "bottomRight" },
                    ]
                }
            ]}
        );
        container.add(
            { "_tag": "div", "id": "mainDivSpacer" }
        );

        this.container = container;
        this.mainDiv = container.mainDiv;
        this.canvas = this.mainDiv.canvas;
        this.topBar = this.mainDiv.topBar;
        this.topLeft = this.topBar.topLeft;
        this.topMiddle = this.topBar.topMiddle;
        this.topRight = this.topBar.topRight;
        this.bottomBar = this.mainDiv.bottomBar;
        this.bottomLeft = this.bottomBar.bottomLeft;
        this.bottomMiddle = this.bottomBar.bottomMiddle;
        this.bottomRight = this.bottomBar.bottomRight;
        this.menu = this.mainDiv.menu;
        this.menuInside = this.menu.menuInside;
        this.message = this.mainDiv.message;
        this.messageInside = this.message.messageInside;
        this.controlsBar = null;
        this.smolpxlBar = null;
    }
}

class Replays {
    constructor() {
        let fullReplaySeconds = 20;
        this.enabled = false;
        this.settings = {
            fps: 10,
            gameOverSeconds: 5,
            fullReplaySeconds: fullReplaySeconds
        };
        this.recording = {
            on: false,
            frames: []
        };
        this.playback = {
            on: true,
            frameNum: 0,
            seconds: fullReplaySeconds
        }
    }

    enable(defaultReplay, fps, gameOverSeconds, fullReplaySeconds) {
        this.enabled = true;
        this.settings.fps = fps;
        if (defaultReplay) {
            this.recording.frames = defaultReplay;
        }
        if (gameOverSeconds) {
            this.settings.gameOverSeconds = gameOverSeconds;
        }
        if (fullReplaySeconds) {
            this.settings.fullReplaySeconds = fullReplaySeconds;
        }
    }

    setFps(fps) {
        this.settings.fps = fps;
    }

    recordFrame(model) {
        if (!this.enabled) {
            return;
        }
        const frames = this.recording.frames;
        frames.push(JSON.stringify(model));
        if (
            frames.length >
                this.settings.fullReplaySeconds * this.settings.fps
        ) {
            frames.shift();
        }
    }

    firstFrame() {
        let ret = (
            this.recording.frames.length
                - 1
                - (this.playback.seconds * this.settings.fps)
        );
        if (ret < 0) {
            ret = 0;
        }
        return ret;
    }

    tickPlayback() {
        if (!this.enabled) {
            return;
        }
        this.playback.frameNum++;
        if (this.playback.frameNum >= this.recording.frames.length) {
            this.playback.frameNum = this.firstFrame();
        }
    }

    startRecording() {
        if (!this.enabled) {
            return;
        }
        this.recording.frames = [];
        this.recording.on = true;
        this.playback.on = false;
    }

    stopRecording() {
        if (!this.enabled) {
            return;
        }
        this.recording.on = false;
    }

    startPlaying(seconds) {
        if (!this.enabled) {
            return;
        }
        this.recording.on = false;
        this.playback.on = true;
        this.playback.seconds = seconds;
        this.playback.frameNum = this.firstFrame();
    }

    startPlayingFull() {
        this.startPlaying(this.settings.fullReplaySeconds);
    }

    startPlayingGameOver() {
        this.startPlaying(this.settings.gameOverSeconds);
    }

    stopPlaying() {
        this.playback.on = false;
    }

    playbackFrame() {
        let f = this.playback.frameNum;
        let frames = this.recording.frames;
        if (f >= 0 && f < frames.length) {
            return JSON.parse(frames[f]);
        } else {
            return null;
        }
    }
}

class GameInternals {
    constructor() {
        this.name = null;
        this.model = null;
        this.view = null;
        this.update = null;
        this.titleView = null;
        this.dom = null;
        this.menu = {items: null};
        this.animationFrameId = null;
        this.lastStepTimestamp = null;
        this.gameStarting = false;
        this.backgroundColor = colors.BLACK;
        this.borderColor = colors.LIGHT_GREY;
        this.fps = 10;
        this.frameTime = 100;  // 10 FPS
        this.inputMode = "keys";
        this.mode = "title";
        this.replays = new Replays();
        this.pauseOnBlur = true;
        this.pendingInput = [];
        this.prevPixels = null;
        this.width = 256;
        this.height = 192;
        this.title = null;
        this.titleMessage = null;
        this.sendPopularityStats = false;
        this.swallowRightClicks = false;
        this.showControls = null;
        this.showSmolpxlBar = false;
        this.sourceCodeUrl = null;
    }

    enableReplays(defaultReplay, gameOverSeconds, fullReplaySeconds) {
        this.replays.enable(
            defaultReplay, this.fps, gameOverSeconds, fullReplaySeconds);
    }
    startRecordingReplay() {this.replays.startRecording();}
    stopRecordingReplay() {this.replays.stopRecording();}
    startPlayingFullReplay() {this.replays.startPlayingFull();}
    startPlayingGameOverReplay() {this.replays.startPlayingGameOver();}
    stopPlayingReplay() {this.replays.stopPlaying();}

    frame(timestamp) {
        this.animationFrameId = window.requestAnimationFrame(
            (timestamp) => this.frame(timestamp));

        if (timestamp === undefined) {
            return;
        }

        try {
            let modelChanged = false;
            if (!this.lastStepTimestamp) {
                this.lastStepTimestamp = timestamp - this.frameTime - 1;
                modelChanged = true;
            }
            let extraSteps = 0;
            while (timestamp - this.lastStepTimestamp >= this.frameTime) {
                modelChanged = this.step() || modelChanged;
                this.lastStepTimestamp += this.frameTime;
                if (++extraSteps === MAX_EXTRA_STEPS) {
                    this.lastStepTimestamp = timestamp;
                }
            }
            if (modelChanged || this.gameStarting) {
                this.render();
                this.gameStarting = false;
            }
        } catch(e) {
            this.stopAnimation();
            throw e;
        }
    }

    startAnimation() {
        this.lastStepTimestamp = null;
        this.frame();
    }

    stopAnimation() {
        window.cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    step() {
        if (this.replays.playback.on) {
            this.replays.tickPlayback();
        }

        if (this.menu.isVisible()) {
            return false;
        } else if (this.mode !== "game") {
            if (this.replays.playback.on) {
                return true;
            } else {
                return false;
            }
        }

        const newModel = this.update(new RunningGame(this), this.model);

        this.pendingInput.length = 0;

        const modelChanged = (newModel !== undefined);
        if (modelChanged) {
            this.model = newModel;
        }

        if (this.replays.recording.on) {
            this.replays.recordFrame(newModel);
        }

        return (modelChanged || this.replays.playback.on);
    }

    setInputMode(inputMode) {
        if (this.inputMode === inputMode) {
            return;
        }
        this.inputMode = inputMode;
        for (const button of document.getElementsByClassName("button")) {
            const key = button.dataset.key;
            const svg = svg_for_key(key);
            if (svg) {
                button.firstChild.innerHtml = svg;
            } else {
                button.firstChild.innerText = this.replaceInput(`<${key}>`);
            }
        }
    }

    setFps(framesPerSecond) {
        this.fps = framesPerSecond;
        this.frameTime = 1000 / framesPerSecond;
        this.replays.setFps(framesPerSecond);
    }

    inputName(name) {
        const info = INPUT[name][this.inputMode];
        return info.name ? info.name : info.code;
    }

    replaceInput(msg) {
        let ret = msg;
        for (const name in INPUT) {
            ret = ret.replace(`<${name}>`, this.inputName(name));
        }

        // TODO: different messages when in touch mode
        ret = ret.replace("<LEFT_CLICK>", "Left click");
        ret = ret.replace("<MIDDLE_CLICK>", "Middle click");
        ret = ret.replace("<RIGHT_CLICK>", "Right click");
        return ret;
    }

    barMessage(msg, div) {
        const changed = (div.element.display !== "block");
        const txt = this.replaceInput(msg);
        if (div.element.innerText !== txt) {
            div.element.innerText = txt;
        }
        div.style("display", "block");
        if (changed) {
            this.onResize();
        }
    }

    sizeMessageText(overlayInside, maxSize) {
        sizeMessageText(this.dom.canvas, overlayInside, maxSize);
    }

    renderMessageText(msg) {
        for (let i = 0; i < msg.length; i++) {
            const text = this.replaceInput(msg[i]);
            let div = this.dom.messageInside.element.children[i];
            if (div === undefined) {
                div = document.createElement("div");
                this.dom.messageInside.element.appendChild(div);
            }
            if (div.innerText !== text) {
                div.innerText = text;
            }
        }
        while (this.dom.messageInside.element.children.length > msg.length) {
            this.dom.messageInside.element.lastChild.remove()
        }
    }

    renderMessage(screen) {
        if (screen._dim || screen._message) {
            this.dom.message.style("display", "block");
            if (screen._dim) {
                this.dom.message.style("backgroundColor", "rgb(0, 0, 0, 0.7)");
            } else {
                this.dom.message.style("backgroundColor", "");
            }
            if (screen._message) {
                this.renderMessageText(screen._message);
                this.sizeMessageText(this.dom.messageInside);
            } else {
                this.dom.messageInside.element.innerText = "";
            }
        } else {
            this.dom.message.style("display", "none");
        }
    }

    renderPositionedText(screen) {
        if (!screen._positionedText || screen._positionedText.length === 0) {
            if (this.dom.mainDiv.positionedTexts) {
                this.dom.mainDiv.positionedTexts.element.innerText = "";
            }
            return;
        }
        const originLeft = this.dom.canvas.element.offsetLeft;
        const originTop = this.dom.canvas.element.offsetTop;
        const pixelWidth = this.dom.canvas.element.clientWidth / this.width;
        const pixelHeight = this.dom.canvas.element.clientHeight / this.height;

        if (!this.dom.mainDiv.positionedTexts) {
            this.dom.mainDiv.add(
                { id: "positionedTexts", _tag: "div" }
            );
        }
        const txts = this.dom.mainDiv.positionedTexts;
        const txtsChildren = Array.from(txts.children());
        let i = 0;
        for (; i < screen._positionedText.length; i++) {
            const pt = screen._positionedText[i];
            let child = txtsChildren[i];
            if (!child) {
                child = txts.add(
                    {
                        _tag: "div",
                        "class": "positionedText",
                    }
                );
            }
            child.text(this.replaceInput(pt.text));
            child.left(originLeft + pt.x * pixelWidth);
            child._top(originTop + pt.y * pixelHeight);
            child.fontSize(pt.h * pixelHeight);
            child.color(pt.color);
            if (pt.outlineColor) {
                const col = colorAsRgb(pt.outlineColor);
                child.style(
                    "text-shadow",
                    `-1px -1px 0 ${col}, 1px -1px 0 ${col}, ` +
                    `-1px 1px 0 ${col}, 1px 1px 0 ${col}`);
            }
        }
    }

    renderTitle(screen) {
        let model = this.model;
        let realModel;
        if (this.replays.enabled) {
            realModel = this.model;
            model = this.replays.playbackFrame();
            if (!model) {
                model = this.model;
            }
        }
        if (this.titleView) {
            this.titleView(screen, model, realModel);
        } else {
            this.view(screen, model, realModel);
            screen.dim();
        }
        let title = this.title;
        if (title === null) {
            title = "Smolpxl Game";
        }
        let titleMessage = this.titleMessage;
        if (titleMessage === null) {
            titleMessage = [
                "",
                title,
                "",
                "<SELECT> to start",
                "",
                "<MENU> to pause",
                ""
            ];
        }
        screen.message(titleMessage);
    }

    drawToCanvas(canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.fillStyle = colorAsRgb(this.backgroundColor);
        canvasCtx.fillRect(0, 0, this.width, this.height);
        const imageData = canvasCtx.getImageData(
            0, 0, this.width, this.height);
        let imgPixels = imageData.data;

        const screen = new ModifiableScreen(
            this, imgPixels, this.width, this.height, canvasCtx);

        if (this.mode === "title") {
            this.renderTitle(screen);
        } else if (this.mode === "game") {
            this.view(screen, this.model);
        }

        canvasCtx.putImageData(imageData, 0, 0);
        this.prevPixels = imgPixels;

        return screen;
    }

    render() {
        if (this.menu.isVisible()) {
            return;
        }

        if (document.title !== this.title) {
            document.title = this.title;
        }
        this.dom.mainDiv.backgroundColor(this.backgroundColor);
        this.dom.container.backgroundColor(this.borderColor);
        if (this.dom.smolpxlBar) {
            this.dom.smolpxlBar.backgroundColor(this.borderColor);
        }

        const oldBackgroundColor = this.backgroundColor.slice();
        const oldWidth = this.width;
        const oldHeight = this.height;

        let screen = this.drawToCanvas(this.dom.canvas.element);

        // If something fundamental changed, redraw.  TODO: slow if done often
        if (
            !Smolpxl.equalArrays(this.backgroundColor, oldBackgroundColor) ||
            this.width !== oldWidth ||
            this.height !== oldHeight
        ) {
            screen = this.drawToCanvas(
                this.dom.canvas.element, this.width, this.height);
        }

        this.renderMessage(screen);
        this.renderPositionedText(screen);
    }

    like() {
        if (this.dom.smolpxlBar) {
            const likeButton = (
                this.dom.smolpxlBar.smolpxlBarLike.element.children[0]);
            likeButton.children[1].remove();
            likeButton.innerHTML += likedSvg;
        }
        if (this.sendPopularityStats) {
            statsEvent(`${this.name}.liked`);
        }
    }

    share() {
        this.onBlur();
        this.dom.mainDiv.add(
            {"_tag": "div", "class": "shareonBorder", "id": "shareonBorder"});
        this.dom.mainDiv.add(
            {
                "_tag": "div",
                "class": "shareonBox",
                "id": "shareonBox",
                "_children": [
                    {"_tag": "h2", "_text": "Share"},
                    {
                        "_tag": "div",
                        "class": "shareon",
                        "id": "shareon",
                        "_children": [
                            {"_tag": "a", "class": "mastodon"},
                            {"_tag": "a", "class": "twitter"},
                            {"_tag": "a", "class": "reddit"},
                            {"_tag": "a", "class": "linkedin"},
                            {"_tag": "a", "class": "facebook"}
                        ]
                    },
                    {
                        "_tag": "div",
                        "class": "shareonLink",
                        "id": "shareonLink",
                        "_children": [
                            {"_tag": "span", "_text": "Link:"},
                            {
                                "_tag": "input",
                                "id": "shareonInput",
                                "value": document.location.href
                            }
                        ]
                    },
                    {"_tag": "div", "id": "shareonCopied"}
                ]
            }
        );

        const border = this.dom.mainDiv.shareonBorder;
        const box = this.dom.mainDiv.shareonBox;
        const input = box.shareonLink.shareonInput;
        const copied = box.shareonCopied;

        const onkeydown = (evt) => {
            if (evt.key === "Escape") {
                removeShare();
            }
        }

        const removeShare = () => {
            border.element.remove();
            box.element.remove();
            document.removeEventListener("keydown", onkeydown);
        }
        document.addEventListener("keydown", onkeydown);

        border.element.addEventListener(
            "click",
            () => {
                border.element.remove();
                box.element.remove();
            }
        );

        input.element.addEventListener(
            "click",
            (evt) => {
                evt.target.select();
                document.execCommand("copy");
                copied.element.innerText = "...Copied";
                setTimeout(() => {copied.element.innerText = "";}, 2000)
            }
        );

        // Load the shareon code and CSS to display the sharing buttons
        const link = document.createElement("link");
        link.onload = () => {
            const script = document.createElement("script");
            script.src = SHAREON_JS;
            script.onload = () => shareon();
            document.head.appendChild(script);
        };
        link.rel = "stylesheet";
        link.type = "text/css";
        link.media = "all";
        link.href = SHAREON_CSS;
        document.head.appendChild(link);
    }

    showControlsLeft(controls) {
        if (!this.showControls) {
            this.showControls = {};
        }
        this.showControls["left"] = controls;
    }

    showControlsMiddle(controls) {
        if (!this.showControls) {
            this.showControls = {};
        }
        this.showControls["middle"] = controls;
    }

    showControlsRight(controls) {
        if (!this.showControls) {
            this.showControls = {};
        }
        this.showControls["right"] = controls;
    }

    addControlsBar() {
        this.dom.controlsBar = this.dom.mainDiv.add({
            "_tag": "div", "id": "controlsBar", "_children": [
                { "_tag": "div", "id": "controlsBarLeft"},
                { "_tag": "div", "id": "controlsBarMiddle"},
                { "_tag": "div", "id": "controlsBarRight"}
            ]
        });

        // Prevent clicks/taps on the button bar doing anything like selecting
        this.dom.controlsBar.element.addEventListener(
            "pointerdown", (evt) => evt.preventDefault());

        const minmaxbutton = this.dom.controlsBar.add({
            "_tag": "a",
            "class": "minmax",
            "href": "#",
            "_children": [{"_text": minimiseSvg}]
        });
        minmaxbutton.element.addEventListener("click", (evt) => {
            let clslst = this.dom.controlsBar.element.classList;
            if (clslst.contains("minimised")) {
                clslst.remove("minimised");
                minmaxbutton.element.innerHTML = minimiseSvg;
            } else {
                clslst.add("minimised");
                minmaxbutton.element.innerHTML = maximiseSvg;
            }
            this.onResize();
        });

        const sections = [
            [
                this.showControls["left"],
                this.dom.controlsBar.controlsBarLeft
            ],
            [
                this.showControls["middle"],
                this.dom.controlsBar.controlsBarMiddle
            ],
            [
                this.showControls["right"],
                this.dom.controlsBar.controlsBarRight
            ]
        ];
        for (const [controls, bar] of sections) {
            if (controls) {
                for (const control of controls) {
                    if (control === "ARROWS") {
                        this.createArrowKeys(bar);
                    } else {
                        this.createKeyButton(control, bar, " single");
                    }
                }
            }
        }

    }

    createArrowKeys(parentDom) {
        const container = parentDom.add({
            "_tag": "div",
            "class": "arrowbuttons",
        });
        this.createKeyButton("LEFT", container, " left");
        this.createKeyButton("UP", container, " up");
        this.createKeyButton("DOWN", container, " down");
        this.createKeyButton("RIGHT", container, " right");
    }

    createKeyButton(control, parentDom, tags) {
        let key;
        if (typeof control === 'object') {
            key = control.control;
            INPUT[key].touch.name = control.name;
        } else {
            key = control;
        }
        const svg = svg_for_key(key);
        let child;
        if (svg) {
            child = { "_text": svg };
        } else {
            child = {
                "_tag": "span",
                "_text": this.replaceInput(`<${key}>`)
            };
        }
        const button = parentDom.add({
                "_tag": "div", // TODO: or tag=button on iPhone Safari?
                "id": "controlsBar_" + key,
                "class": "button" + tags,
                "_children": [
                    {
                        "_tag": "span",
                        "_children": [child]
                    }
                ]
            }
        );
        button.element.setAttribute("data-key", key);
        let pressed = (evt) => {
            if ((evt.buttons & 1) == 0 ||
                button.element.classList.contains("pressed")
            ) {
                return;
            }
            evt.preventDefault();
            button.element.classList.add("pressed");
            this.onInputDown(
                new KeyboardEvent("keydown", {key: INPUT[key].keys.code})
            );
        };
        let released = (evt) => {
            if (!button.element.classList.contains("pressed")
            ) {
                return;
            }
            evt.preventDefault();
            button.element.classList.remove("pressed");
            this.onInputUp(
                new KeyboardEvent("keyup", {key: INPUT[key].keys.code})
            );
        };
        button.element.addEventListener('pointerdown', pressed);
        button.element.addEventListener('pointerup', released);
        button.element.addEventListener('pointerover', pressed);
        button.element.addEventListener('pointerout', released);
        button.element.addEventListener('mousedown', pressed);
        button.element.addEventListener('mouseup', released);
        button.element.addEventListener('mouseover', pressed);
        button.element.addEventListener('mouseout', released);
        button.element.addEventListener('touchstart', (evt) => {
            this.setInputMode("touch");
            pressed(evt);
        });
        button.element.addEventListener('touchend', released);
    }

    addSmolpxlBar() {
        this.dom.mainDiv.addFirst({
            "_tag": "div", "id": "smolpxlBar",
            "_children": [
                {
                    "_tag": "a",
                    "href": "https://smolpxl.artificialworlds.net/",
                    "_children": [
                        { "_tag": "span", "_children": [
                            {"_text": backSvg},
                            {"_tag": "span", "_text": "Smolpxl"}
                        ]},
                    ]
                },
                {
                    "_tag": "a",
                    "id": "smolpxlBarLike",
                    "href": "#",
                    "_children": [
                        { "_tag": "span", "_children": [
                            {"_tag": "span", "_text": "Like"},
                            {"_text": likeSvg}
                        ]},
                    ]
                },
                {
                    "_tag": "a",
                    "id": "smolpxlBarShare",
                    "href": "#",
                    "_children": [
                        { "_tag": "span", "_children": [
                            {"_tag": "span", "_text": "Share"},
                            {"_text": shareSvg}
                        ]},
                    ]
                }
            ]
        });
        this.dom.smolpxlBar = this.dom.mainDiv.smolpxlBar;

        if (this.sourceCodeUrl) {
            this.dom.smolpxlBar.add(
                {
                    "_tag": "a",
                    "href": this.sourceCodeUrl,
                    "target": "_blank",
                    "_children": [
                        { "_tag": "span", "_children": [
                            {"_tag": "span", "_text": "Code"},
                            {"_text": codeSvg}
                        ]},
                    ]
                }
            );
        }

        this.dom.smolpxlBar.smolpxlBarLike.element.addEventListener(
            'click', () => this.like());

        this.dom.smolpxlBar.smolpxlBarShare.element.addEventListener(
            'click', () => this.share());
    }

    onLoad() {
        this.dom = new SmolpxlDom(document.body);

        this.dom.canvas.element.addEventListener(
            'touchstart', (evt) => this.onTouchStart(evt));
        this.dom.canvas.element.addEventListener(
            'touchend', (evt) => this.onTouchEnd(evt));
        this.dom.canvas.element.addEventListener(
            'mousedown', (evt) => this.onMouseDown(evt));
        this.dom.canvas.element.addEventListener(
            'mouseup', (evt) => this.onMouseUp(evt));

        if (this.swallowRightClicks) {
            this.dom.canvas.element.addEventListener(
                "contextmenu", evt => evt.preventDefault());
        }

        if (this.showControls) {
            this.addControlsBar();
        }

        if (this.showSmolpxlBar) {
            this.addSmolpxlBar();
        }

        this.menu = new Menu(
            this.menu.items,
            this.dom,
            () => this.stopAnimation(),
            () => this.startAnimation()
        );
        this.onResize();
        this.frame();
    }

    onResize() {
        // I really really tried to do this with CSS
        // TODO: use containing DOM element sizes instead of window sizes
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const cw = this.width;
        const ch = this.height;
        const controlsBarHeight = (
            this.dom.controlsBar
                ?  this.dom.controlsBar.element.clientHeight
                : 0
        );
        const smolpxlBarHeight = (
            this.dom.smolpxlBar
                ?  this.dom.smolpxlBar.element.clientHeight
                : 0
        );
        const bars = (
            this.dom.topBar.element.clientHeight +
            this.dom.bottomBar.element.clientHeight +
            controlsBarHeight +
            smolpxlBarHeight
        );

        // Assume we will have margins at top and bottom
        let w = ww;
        let h = ww * (ch / cw);
        if (h + bars > wh) {
            // Too tall: we will have margins at left and right
            h = wh - bars;
            w = h * (cw / ch);
        }
        this.dom.canvas.width(w);
        this.dom.canvas.height(h);
        this.dom.menuInside.width(canvas.clientWidth);
        this.dom.menuInside.height(canvas.clientHeight + 1);
        this.dom.menu.height(canvas.clientHeight + 1);
        this.dom.messageInside.width(canvas.clientWidth);
        this.dom.messageInside.height(canvas.clientHeight + 1);
        this.dom.message.height(canvas.clientHeight + 1);
        this.dom.topBar.width(w);
        this.dom.bottomBar.width(w);

        this.sizeMessageText(this.dom.messageInside);
        this.sizeMessageText(this.dom.menuInside, 0.15);
    }

    onBlur() {
        if (this.pauseOnBlur) {
            this.menu.on();
        }
    }

    onKeyDown(evt) {
        this.setInputMode("keys");
        this.onInputDown(evt);
    }

    onKeyUp(evt) {
        this.setInputMode("keys");
        this.onInputUp(evt);
    }

    onInputDown(evt) {
        if (modifierPressed(evt)) {
            return;
        }
        const key = KEY_CODES[evt.key];
        if (this.menu.isVisible()) {
            return this.menu.onKeyDown(evt, key);
        } else if (key === "MENU") {
            return this.menu.on();
        } else if (this.mode === "title" && key === "SELECT") {
            this.startGame();
        } else if (key !== undefined) {
            evt.preventDefault();
            this.pendingInput.push({name: key});
        }
    }

    onInputUp(evt) {
        if (modifierPressed(evt)) {
            return;
        }
        const key = KEY_CODES[evt.key];
        if (key !== undefined) {
            evt.preventDefault();
            this.pendingInput.push({name: "RELEASE_" + key});
        }
    }

    canvas2GameX(offsetX) {
        return Math.floor(
            this.width * offsetX / this.dom.canvas.element.clientWidth);
    }

    canvas2GameY(offsetY) {
        return Math.floor(
            this.height * offsetY / this.dom.canvas.element.clientHeight);
    }

    onTouchStart(evt) {
        this.setInputMode("touch");
        if (this.menu.isVisible()) {
            return;
        }
        if (this.mode === "title") {
            this.startGame();
        } else {
            this.pendingInput.push({
                name: "LEFT_CLICK",
                x: this.canvas2GameX(
                    evt.changedTouches[0].clientX
                    - this.dom.canvas.element.offsetLeft
                ),
                y: this.canvas2GameY(
                    evt.changedTouches[0].clientY
                    - this.dom.canvas.element.offsetTop
                )
            });
        }
        evt.preventDefault();
    }

    onTouchEnd(evt) {
        if (this.menu.isVisible()) {
            return;
        }
        this.pendingInput.push({
            name: "RELEASE_LEFT_CLICK",
            x: this.canvas2GameX(
                evt.changedTouches[0].clientX
                - this.dom.canvas.element.offsetLeft
            ),
            y: this.canvas2GameY(
                evt.changedTouches[0].clientY
                - this.dom.canvas.element.offsetTop
            )
        });
        evt.preventDefault();
    }

    onMouseDown(evt) {
        if (this.menu.isVisible()) {
            return;
        }
        const button = MOUSE_BUTTONS[evt.button];
        if (this.mode === "title" && button === "LEFT_CLICK") {
            this.startGame();
        } else if (button !== undefined) {
            this.pendingInput.push({
                name: button,
                x: this.canvas2GameX(evt.offsetX),
                y: this.canvas2GameY(evt.offsetY)
            });
        }
        evt.preventDefault();
    }

    onMouseUp(evt) {
        if (this.menu.isVisible()) {
            return;
        }
        const button = MOUSE_BUTTONS[evt.button];
        if (button !== undefined) {
            this.pendingInput.push({
                name: "RELEASE_" + button,
                x: this.canvas2GameX(evt.offsetX),
                y: this.canvas2GameY(evt.offsetY)
            });
        }
        evt.preventDefault();
    }

    startGame() {
        this.mode = "game";
        this.gameStarting = true;
        this.pendingInput.length = 0;
        this.stopPlayingReplay();
        this.startRecordingReplay();
        if (this.sendPopularityStats) {
            statsEvent(`${this.name}.played`);
        }
    }

    endGame() {
        this.mode = "title";
        this.stopRecordingReplay();
        this.startPlayingFullReplay();
    }

    start(name, model, view, update) {
        this.name = name;
        this.model = model;
        this.view = view;
        this.update = update;
        window.addEventListener('load', () => this.onLoad());
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('blur', () => this.onBlur());
        document.addEventListener('keydown', (evt) => this.onKeyDown(evt));
        document.addEventListener('keyup', (evt) => this.onKeyUp(evt));
        document.addEventListener('touchstart', (evt) => {
            this.setInputMode("touch");
        });

        if (document.readyState === "complete") {
            this.onLoad();
        }

        if (this.skipTitleScreen) {
            this.startGame();
        }
    }
}

class Game {
    constructor() {
        this._ = new GameInternals();
    }

    skipTitleScreen() {this._.skipTitleScreen = true;}
    dontPauseOnBlur() {this._.pauseOnBlur = false;}
    sendPopularityStats() {this._.sendPopularityStats = true;}
    setTitleMessage(msg) {this._.titleMessage = msg;}
    setBackgroundColor(color) {this._.backgroundColor = color.slice();}
    setBorderColor(color) {this._.borderColor = color.slice();}
    setCustomTitleView(titleView) {this._.titleView;}
    setMenu(items) {this._.menu.items = items;}
    setTitle(title) {this._.title = title;}
    enableReplays(defaultReplay, gameOverSeconds, fullReplaySeconds) {
        this._.enableReplays(
            defaultReplay, gameOverSeconds, fullReplaySeconds);
    }
    setFps(framesPerSecond) {this._.setFps(framesPerSecond);}
    swallowRightClicks() {this._.swallowRightClicks = true;}
    showControlsLeft(controls) {this._.showControlsLeft(controls);}
    showControlsMiddle(controls) {this._.showControlsMiddle(controls);}
    showControlsRight(controls) {this._.showControlsRight(controls);}
    showSmolpxlBar() {this._.showSmolpxlBar = true;}
    setSourceCodeUrl(url) {this._.sourceCodeUrl = url;}
    menuOff() {this._.menu.off();}
    menuOut() {this._.menu.out();}
    endGame() {this._.endGame();}
    startRecordingReplay() {this._.startRecordingReplay();}
    stopRecordingReplay() {this._.stopRecordingReplay();}
    startPlayingFullReplay() {this._.startPlayingFullReplay();}
    startPlayingGameOverReplay() {this._.startPlayingGameOverReplay();}
    stopPlayingReplay() {this._.stopPlayingReplay();}

    setSize(width, height) {
        this._.width = width;
        this._.height = height;
    }

    start(name, model, view, update) {
        this._.start(name, model, view, update);
    }
}

Smolpxl.Game = Game;

Smolpxl.colors = colors;
Smolpxl.directions = directions;

Smolpxl.areOpposite = areOpposite;
Smolpxl.arrayIncludesArray = arrayIncludesArray;
Smolpxl.coordMoved = coordMoved;
Smolpxl.equalArrays = equalArrays;
Smolpxl.inputToDirection = inputToDirection;
Smolpxl.insideRectangle = insideRectangle;
Smolpxl.randomInt = randomInt;
Smolpxl.rectanglesOverlap = rectanglesOverlap;

}());
