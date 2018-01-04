/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var lp = __webpack_require__(3);
var gcc = __webpack_require__(6);
var random_1 = __webpack_require__(7);
exports.Random = random_1.default;
var sound_1 = __webpack_require__(4);
exports.Sound = sound_1.Sound;
var ui = __webpack_require__(9);
exports.ui = ui;
var debug = __webpack_require__(10);
exports.debug = debug;
var util = __webpack_require__(2);
var leaderboard = __webpack_require__(11);
__export(__webpack_require__(2));
var Scene;
(function (Scene) {
    Scene[Scene["title"] = 0] = "title";
    Scene[Scene["started"] = 1] = "started";
    Scene[Scene["ended"] = 2] = "ended";
})(Scene = exports.Scene || (exports.Scene = {}));
;
exports.scene = Scene.started;
exports.ticks = 0;
var titleCont = null;
var titleScale = 3;
var titleHue = 0;
var seedRandom;
var isDebugEnabled = false;
var onSeedChangedFunc;
var score = 0;
var scoreMultiplier = 0;
var titleFunc;
var beginFunc;
var updateFunc;
function init(initFunc, _titleFunc, _beginFunc, _updateFunc, tempo) {
    if (initFunc === void 0) { initFunc = null; }
    if (_beginFunc === void 0) { _beginFunc = null; }
    if (_updateFunc === void 0) { _updateFunc = null; }
    if (tempo === void 0) { tempo = 120; }
    titleFunc = _titleFunc;
    beginFunc = _beginFunc;
    updateFunc = _updateFunc;
    leaderboard.init();
    gcc.setOptions({
        scale: 0.5,
        durationSec: 5
    });
    lp.init();
    ui.init(lp.fxCanvas, new util.Vector(640, 480));
    ui.useCursorAsStick();
    ui.useStickKeyAsButton();
    sound_1.initSound(tempo);
    seedRandom = new random_1.default();
    exports.random = new random_1.default();
    if (initFunc != null) {
        initFunc();
    }
    if (isDebugEnabled) {
        begin();
    }
    else {
        title();
    }
    update();
}
exports.init = init;
function enableDebug(_onSeedChangedFunc) {
    if (_onSeedChangedFunc === void 0) { _onSeedChangedFunc = null; }
    onSeedChangedFunc = _onSeedChangedFunc;
    debug.initSeedUi(setGenerationSeeds);
    debug.enableShowingErrors();
    isDebugEnabled = true;
}
exports.enableDebug = enableDebug;
function begin(seed) {
    if (seed === void 0) { seed = null; }
    exports.scene = Scene.started;
    ui.clearJustPressed();
    if (seed == null) {
        seed = seedRandom.getInt(9999999);
    }
    clearGameStatus();
    exports.scene = Scene.started;
    exports.random.setSeed(seed);
    lp.cls();
    if (beginFunc != null) {
        beginFunc();
    }
}
function end() {
    if (exports.scene === Scene.ended || exports.scene == Scene.title) {
        return;
    }
    ui.clearJustPressed();
    exports.scene = Scene.ended;
    exports.ticks = 0;
    leaderboard.set(score);
}
exports.end = end;
function clearGameStatus() {
    exports.ticks = 0;
    score = 0;
    scoreMultiplier = 1;
}
function title() {
    exports.scene = Scene.title;
    exports.ticks = score === 0 ? 0 : 180;
    lp.cls();
}
function setGenerationSeeds(seed) {
    sound_1.setSoundSeed(seed);
    if (onSeedChangedFunc != null) {
        onSeedChangedFunc();
    }
}
exports.setGenerationSeeds = setGenerationSeeds;
function addScore(v) {
    if (v === void 0) { v = 1; }
    if (exports.scene === Scene.started) {
        score += v * scoreMultiplier;
    }
}
exports.addScore = addScore;
function addScoreMultiplier(v) {
    if (v === void 0) { v = 1; }
    scoreMultiplier += v;
}
exports.addScoreMultiplier = addScoreMultiplier;
function setScoreMultiplier(v) {
    if (v === void 0) { v = 1; }
    scoreMultiplier = v;
}
exports.setScoreMultiplier = setScoreMultiplier;
function getDifficulty() {
    return util.getDifficulty();
}
exports.getDifficulty = getDifficulty;
function update() {
    requestAnimationFrame(update);
    ui.update();
    handleScene();
    if (updateFunc != null) {
        updateFunc();
    }
    drawSceneText();
    lp.update();
    exports.ticks++;
    //gcc.capture(lp.fxCanvas);
}
function handleScene() {
    if (exports.scene === Scene.title && ui.isJustPressed) {
        begin();
    }
    if (exports.scene === Scene.ended &&
        (exports.ticks >= 60 || (exports.ticks >= 20 && ui.isJustPressed))) {
        title();
    }
}
function drawSceneText() {
    switch (exports.scene) {
        case Scene.title:
            drawTitle();
            if (score > 0) {
                drawScore();
            }
            break;
        case Scene.ended:
            lp.color(0, 7);
            lp.locate(15, 9);
            lp.print("GAME OVER");
            drawScore();
            break;
        case Scene.started:
            drawScore();
            break;
    }
}
function drawScore() {
    lp.color(7);
    lp.locate(0, 0);
    lp.print('SCORE ' + score);
}
var leaderboardTypes = ['LAST', 'BEST', 'TOP'];
var rankStrings = ['ST', 'ND', 'RD'];
function drawTitle() {
    lp.cls();
    var tt = Math.floor(exports.ticks / 180) % 4;
    var t = exports.ticks % 180;
    if (t === 0) {
        switch (tt) {
            case 0:
                break;
            case 1:
                leaderboard.get(true);
                break;
            case 2:
                leaderboard.get(false, true);
                break;
            case 3:
                leaderboard.get();
                break;
        }
    }
    if (leaderboard.scores == null || tt === 0) {
        titleFunc();
        return;
    }
    lp.color(7);
    lp.locate(18, 2);
    lp.print(leaderboardTypes[tt - 1]);
    _.forEach(leaderboard.scores, function (s, i) {
        var y = 4 + i;
        lp.color(7);
        if (s.playerId === leaderboard.playerId) {
            lp.color(s.rank == null ? 6 : 5);
            lp.locate(2, y);
            lp.print('YOU');
        }
        if (s.rank != null) {
            var rs = "" + (s.rank + 1) + ((s.rank < 3) ? rankStrings[s.rank] : 'TH');
            lp.locate(14, y);
            lp.print(rs);
        }
        var ss = String(s.score);
        lp.locate(37 - ss.length, y);
        lp.print(ss);
    });
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var g = __webpack_require__(1);
function isIn(v, low, high) {
    return v >= low && v <= high;
}
exports.isIn = isIn;
function wrap(v, low, high) {
    var w = high - low;
    var o = v - low;
    if (o >= 0) {
        return o % w + low;
    }
    else {
        var wv = w + o % w + low;
        if (wv >= high) {
            wv -= w;
        }
        return wv;
    }
}
exports.wrap = wrap;
function constrain(v, low, high) {
    if (v < low) {
        return low;
    }
    else if (v > high) {
        return high;
    }
    return v;
}
exports.constrain = constrain;
function getDifficulty() {
    return g.scene === g.Scene.title ? 1 : g.ticks * (1 / 60 / 20) + 1;
}
exports.getDifficulty = getDifficulty;
function getClassName(obj) {
    return ('' + obj.constructor).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
}
exports.getClassName = getClassName;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        this.x = 0;
        this.y = 0;
        this.set(x, y);
    }
    Vector.prototype.set = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        if (x == null) {
            this.x = this.y = 0;
            return;
        }
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
            return;
        }
        if (y == null) {
            this.x = this.y = x;
            return;
        }
        this.x = x;
        this.y = y;
    };
    Vector.prototype.magSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector.prototype.mag = function () {
        return Math.sqrt(this.magSq());
    };
    Vector.prototype.distancteTo = function (to) {
        var ox = this.x - to.x;
        var oy = this.y - to.y;
        return Math.sqrt(ox * ox + oy * oy);
    };
    Vector.prototype.getAngle = function (to) {
        if (to === void 0) { to = null; }
        return to == null ? Math.atan2(this.y, this.x) : Math.atan2(to.y - this.y, to.x - this.x);
    };
    Vector.prototype.addAngle = function (angle, value) {
        this.x += Math.cos(angle) * value;
        this.y += Math.sin(angle) * value;
    };
    Vector.prototype.constrain = function (lowX, highX, lowY, highY) {
        this.x = constrain(this.x, lowX, highX);
        this.y = constrain(this.y, lowY, highY);
    };
    Vector.prototype.swapXy = function () {
        var t = this.x;
        this.x = this.y;
        this.y = t;
    };
    return Vector;
}());
exports.Vector = Vector;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = lp;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tone = __webpack_require__(8);
var g = __webpack_require__(1);
var random;
var isEmptySoundPlayed = false;
function initSound(bpm) {
    if (bpm === void 0) { bpm = 120; }
    random = new g.Random();
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
}
exports.initSound = initSound;
function setSoundSeed(seed) {
    random.setSeed(seed);
}
exports.setSoundSeed = setSoundSeed;
function playEmptySound() {
    if (isEmptySoundPlayed) {
        return;
    }
    var context = Tone.context;
    var buffer = context.createBuffer(1, 1, context.sampleRate);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    if (context.resume) {
        context.resume();
    }
    isEmptySoundPlayed = true;
}
exports.playEmptySound = playEmptySound;
var Sound = /** @class */ (function () {
    function Sound(isSe, isLooping, cordLength, speed, baseNote, volume) {
        if (isSe === void 0) { isSe = false; }
        if (isLooping === void 0) { isLooping = false; }
        if (cordLength === void 0) { cordLength = 8; }
        if (speed === void 0) { speed = 1; }
        if (baseNote === void 0) { baseNote = 60; }
        if (volume === void 0) { volume = 0; }
        this.isSe = isSe;
        this.isLooping = isLooping;
        this.cordLength = cordLength;
        this.speed = speed;
        this.baseNote = baseNote;
        this.chords = [
            [0, 4, 7],
            [0, 3, 7],
            [0, 4, 7, 10],
            [0, 4, 7, 11],
            [0, 3, 7, 10],
        ];
        // I C:0, II D:2, III E:4, IV F: 5, V G:7, VI A:9, VII B:11
        this.progressions = [
            [[0, 0], [7, 0], [9, 1], [4, 1]],
            [[5, 0], [0, 0], [5, 0], [7, 0]],
            [[5, 3], [7, 2], [4, 4], [9, 1]],
            [[9, 1], [2, 1], [7, 0], [0, 0]],
            [[9, 1], [5, 0], [7, 0], [0, 0]]
        ];
        this.volumeNode = new Tone.Volume(volume).toMaster();
        this.initParts();
    }
    Sound.prototype.initParts = function () {
        var baseProgression = random.select(this.progressions);
        this.progression = [];
        for (var i = 0; i < baseProgression.length; i++) {
            var bp = baseProgression[i];
            var p = [
                bp[0],
                random.get() < 0.7 ? bp[1] : random.getInt(this.chords.length)
            ];
            this.progression.push(p);
        }
        this.parts = [];
        this.duration = baseProgression.length * this.cordLength / this.speed;
    };
    Sound.prototype.createPartsBase = function (restRatio, min, max) {
        if (restRatio === void 0) { restRatio = 0.5; }
        if (min === void 0) { min = -1; }
        if (max === void 0) { max = 1; }
        var velocityRatio = 1;
        var n;
        var nv = random.get(-0.5, 0.5);
        if (this.isSe) {
            min *= 2;
            max *= 2;
            velocityRatio = 2;
            n = random.get(-1, 2);
        }
        else {
            n = random.get();
        }
        this.durations = [];
        this.noteRatios = [];
        for (var i = 0; i < this.progression.length; i++) {
            for (var j = 0; j < this.cordLength; j++) {
                if (i === 2 && !this.isSe) {
                    this.durations.push(this.durations[j]);
                    this.noteRatios.push(this.noteRatios[j]);
                    n = this.noteRatios[j];
                    continue;
                }
                if (random.get() < restRatio) {
                    this.durations.push(false);
                    this.noteRatios.push(null);
                    continue;
                }
                this.durations.push(true);
                this.noteRatios.push(n);
                nv += random.get(-0.25, 0.25);
                n += nv * velocityRatio;
                if (random.get() < 0.2 || n <= min || n >= max) {
                    n -= nv * 2;
                    nv *= -1;
                }
            }
        }
        for (var i = 0; i < this.progression.length; i++) {
            for (var j = 0; j < this.cordLength; j++) {
                var idx = i * this.cordLength + j;
                if (this.durations[idx] === false) {
                    continue;
                }
                var l = 1;
                for (var k = 1; k < this.cordLength - j; k++) {
                    if (this.durations[idx + k] === false && random.get() < 0.7) {
                        l++;
                    }
                }
                this.durations[idx] = "0:0:" + l / this.speed;
            }
        }
    };
    Sound.prototype.createPart = function (offset, randomWidth, cordResolution) {
        if (offset === void 0) { offset = 0; }
        if (randomWidth === void 0) { randomWidth = 0; }
        if (cordResolution === void 0) { cordResolution = 100; }
        var notes = [];
        for (var i = 0; i < this.progression.length; i++) {
            var d = this.progression[i][0];
            var cn = this.progression[i][1];
            var chord = this.chords[cn];
            for (var j = 0; j < this.cordLength; j++) {
                var idx = i * this.cordLength + j;
                if (this.durations[idx] === false) {
                    continue;
                }
                var n = this.noteRatios[idx];
                n = Math.floor(n * cordResolution) / cordResolution;
                var b = Math.floor(n);
                var cn_1 = Math.floor((n - Math.floor(n)) * chord.length);
                cn_1 += offset + random.getInt(-randomWidth, randomWidth + 1);
                while (cn_1 >= chord.length) {
                    cn_1 -= chord.length;
                    b++;
                }
                while (cn_1 < 0) {
                    cn_1 += chord.length;
                    b--;
                }
                b *= 12;
                var dur = this.durations[idx];
                var note = this.midiNoteNumberToFrequency(this.baseNote + b + chord[cn_1]);
                if (note > 10 && note < 2000) {
                    notes.push({
                        time: "0:0:" + idx / this.speed,
                        note: note,
                        dur: dur
                    });
                }
            }
        }
        var s = new Tone.Synth({
            oscillator: {
                type: 'square5'
            }
        });
        var synth = s.chain(this.volumeNode);
        var part = new Tone.Part(function (time, event) {
            synth.triggerAttackRelease(event.note, event.dur, time + 0.05);
        }, notes);
        part.loop = this.isLooping;
        if (this.isLooping) {
            part.loopEnd = "0:0:" + this.duration;
        }
        this.parts.push(part);
    };
    Sound.prototype.play = function () {
        this.stop();
        for (var i = 0; i < this.parts.length; i++) {
            var p = this.parts[i];
            p.start('+0.05');
        }
    };
    Sound.prototype.stop = function () {
        for (var i = 0; i < this.parts.length; i++) {
            var p = this.parts[i];
            p.stop();
        }
    };
    Sound.prototype.midiNoteNumberToFrequency = function (d) {
        var a = 440;
        return a * Math.pow(2, (d - 69) / 12);
    };
    return Sound;
}());
exports.Sound = Sound;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var lp = __webpack_require__(3);
var g = __webpack_require__(1);
window.onload = function () {
    g.init(function () {
        g.ui.useStickKeyAsButton();
        g.setGenerationSeeds(550887);
        createSounds();
        /*g.enableDebug(() => {
          bgmSound.stop();
          createSounds();
          bgmSound.play();
        });*/
    }, title, begin, update);
};
var snakeX = 0;
var snakeY = 0;
var snakeVx = 0;
var snakeVy = 0;
var snakePoss = [];
var itemX = 0;
var itemY = 0;
var itemScore = 100;
var isShowingInstruction = true;
function begin() {
    startSound.play();
    lp.cls();
    lp.color(7);
    lp.print(_.times(40, function () { return '#'; }).join(''));
    _.times(18, function () {
        lp.print('#' + _.times(38, function () { return ' '; }).join('') + '#');
    });
    lp.print(_.times(40, function () { return '#'; }).join(''));
    snakeX = 20;
    snakeY = 10;
    snakePoss = [];
    _.times(3, function (i) {
        var x = snakeX;
        var y = snakeY + 2 - i;
        snakePoss.push({ x: x, y: y });
        lp.locate(x, y);
        lp.print(i === 2 ? '@' : 'H');
    });
    isPressing = true;
    if (isShowingInstruction) {
        lp.locate(2, 2);
        lp.print('PRESS OR SWIPE');
        lp.locate(4, 3);
        lp.print('UP/LEFT/RIGHT/DOWN TO MOVE');
    }
    addItem();
}
function addItem() {
    for (var i = 0; i < 100; i++) {
        itemX = g.random.getInt(1, 40);
        itemY = g.random.getInt(1, 20);
        if (lp.screen(itemX, itemY) === ' ') {
            break;
        }
    }
    lp.color(0, 4);
    lp.locate(itemX, itemY);
    lp.print('$');
    itemScore += 100;
}
var ways = [[0, 0], [1, 0], [0, 0], [0, 1], [0, 0], [-1, 0], [0, 0], [0, -1], [0, 0]];
var aroundOffsets = [[1, 0], [0, 1], [-1, 0], [0, -1]];
var isPressing = false;
function update() {
    if (g.scene !== g.Scene.started) {
        return;
    }
    /*if (g.ticks === 120) {
      bgmSound.play();
    }*/
    var wc = 0;
    var emptyWay = -1;
    _.times(4, function (i) {
        var rx = snakeX + aroundOffsets[i][0];
        var ry = snakeY + aroundOffsets[i][1];
        var rs = lp.screen(rx, ry);
        if ((rs !== ' ' && rs !== '$') || ry < 1) {
            wc++;
        }
        else {
            emptyWay = i;
        }
    });
    if (wc >= 4) {
        end();
        return;
    }
    var isPressed = false;
    if (wc === 3) {
        snakeVx = aroundOffsets[emptyWay][0];
        snakeVy = aroundOffsets[emptyWay][1];
        isPressing = false;
    }
    else {
        snakeVx = ways[g.ui.stickAngle][0];
        snakeVy = ways[g.ui.stickAngle][1];
        isPressed = true;
    }
    if (snakeVx !== 0 || snakeVy !== 0) {
        if (!isPressing) {
            isPressing = true;
            for (var i = 0; i < 100; i++) {
                if (moveSnake() === false) {
                    if (isPressed && i > 0) {
                        moveSound.play();
                        g.ui.resetPressedCursorPos();
                    }
                    break;
                }
            }
            if (isShowingInstruction) {
                lp.color(7);
                lp.locate(2, 2);
                lp.print('              ');
                lp.locate(4, 3);
                lp.print('                          ');
                isShowingInstruction = false;
            }
        }
    }
    else {
        isPressing = false;
    }
    g.ui.resetPressedCursorPos(0.1);
    itemScore = Math.floor(itemScore * 0.99);
    if (itemScore <= 0) {
        itemScore = 1;
    }
    var iss = " " + itemScore + " ";
    lp.locate(20 - Math.floor(iss.length / 2), 0);
    lp.print(iss);
}
function moveSnake() {
    var x = snakeX;
    var y = snakeY;
    var nx = x + snakeVx;
    var ny = y + snakeVy;
    var isMoving = true;
    var isGettingItem = false;
    var ns = lp.screen(nx, ny);
    if ((ns !== ' ' && ns !== '$') || ny < 1) {
        return false;
    }
    if ((snakeVx !== 0 && nx === itemX) || (snakeVy !== 0 && ny === itemY)) {
        if (lp.screen(nx, ny) === '$') {
            itemSound.play();
            g.addScore(itemScore);
            addItem();
            isGettingItem = true;
        }
        isMoving = false;
    }
    lp.color(7);
    if (!isGettingItem) {
        var p = snakePoss[0];
        lp.locate(p.x, p.y);
        lp.print(' ');
        snakePoss.shift();
    }
    lp.locate(x, y);
    lp.print('H');
    snakePoss.push({ x: nx, y: ny });
    lp.locate(nx, ny);
    lp.print('@');
    snakeX = nx;
    snakeY = ny;
    return isMoving;
}
function end() {
    //bgmSound.stop();
    endSound.play();
    g.end();
}
function title() {
    lp.color(7);
    lp.locate(3, 1);
    lp.print("\n##@ #  #  ##  #  @ ####\n#   ## # #  # # #  #\n### ## # #  # ##   ###\n  # # ## #### # #  #\n### @ ## #  @ #  # ######@\n");
    lp.locate(10, 7);
    lp.print("\n   ### #  # @  ###@ @###\n   #   #  # #  #     #\n   ### #### #  ###   #\n     # #  # #  #     #\n@##### #  @ #  #     #\n    \n");
    var t = g.ticks % 60;
    lp.color(7);
    lp.locate(10, 16);
    if (t < 30) {
        lp.print('PRESS OR TAP TO START');
    }
}
var startSound;
var bgmSound;
var moveSound;
var itemSound;
var endSound;
function createSounds() {
    startSound = new g.Sound(false, false, 4, 1, 65, -20);
    startSound.createPartsBase();
    startSound.createPart();
    startSound.createPart(-1, 1);
    startSound.createPartsBase(0, 0, 1);
    startSound.createPart(-3, 0, 2);
    startSound.createPartsBase(0.25, 0, 1);
    startSound.createPart(-4);
    bgmSound = new g.Sound(false, true, 16, 1, 50, -20);
    bgmSound.createPartsBase(0.25, 0, 1);
    bgmSound.createPart();
    bgmSound.createPart(-2);
    moveSound = createSe(60, 2, -20);
    itemSound = createSe(70, 3, -35);
    endSound = createSe(60, 8, -10);
}
function createSe(baseNote, cordLength, volume) {
    if (volume === void 0) { volume = 0; }
    var se = new g.Sound(true, false, cordLength, 8, baseNote, volume);
    se.createPartsBase();
    se.createPart();
    se.createPart(-2, 2);
    se.createPartsBase();
    se.createPart(-4, 4);
    return se;
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = gcc;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Random = /** @class */ (function () {
    function Random() {
        this.setSeed();
    }
    Random.prototype.get = function (fromOrTo, to) {
        if (fromOrTo === void 0) { fromOrTo = 1; }
        if (to === void 0) { to = null; }
        if (to == null) {
            to = fromOrTo;
            fromOrTo = 0;
        }
        return this.getToMaxInt() / 0x7fffffff * (to - fromOrTo) + fromOrTo;
    };
    Random.prototype.getInt = function (fromOrTo, to) {
        if (fromOrTo === void 0) { fromOrTo = 1; }
        if (to === void 0) { to = null; }
        return Math.floor(this.get(fromOrTo, to));
    };
    Random.prototype.getPm = function () {
        return this.getInt(2) * 2 - 1;
    };
    Random.prototype.select = function (values) {
        return values[this.getInt(values.length)];
    };
    Random.prototype.setSeed = function (v) {
        if (v === void 0) { v = -0x7fffffff; }
        if (v === -0x7fffffff) {
            v = Math.floor(Math.random() * 0x7fffffff);
        }
        this.x = v = 1812433253 * (v ^ (v >> 30));
        this.y = v = 1812433253 * (v ^ (v >> 30)) + 1;
        this.z = v = 1812433253 * (v ^ (v >> 30)) + 2;
        this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
        return this;
    };
    Random.prototype.getToMaxInt = function () {
        var t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
        return this.w;
    };
    return Random;
}());
exports.default = Random;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = Tone;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var g = __webpack_require__(1);
var util_1 = __webpack_require__(2);
var sound_1 = __webpack_require__(4);
exports.isPressed = false;
exports.isJustPressed = false;
exports.isCursorDown = false;
var canvas;
var pixelSize;
var isInitialized = false;
var isUsingStickKeysAsButton = false;
var isUsingCursotAsStick = false;
var isKeyPressing = _.times(256, function () { return false; });
var stickKeys = [[39, 68, 102], [40, 83, 101, 98], [37, 65, 100], [38, 87, 104]];
var stickXys = [[1, 0], [0, 1], [-1, 0], [0, -1]];
var buttonKeys = [90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 17, 16, 18, 32, 13];
function init(_canvas, _pixelSize) {
    canvas = _canvas;
    pixelSize = _pixelSize;
    document.onmousedown = function (e) {
        onCursorDown(e.pageX, e.pageY);
    };
    document.ontouchstart = function (e) {
        e.preventDefault();
        sound_1.playEmptySound();
        onCursorDown(e.touches[0].pageX, e.touches[0].pageY);
    };
    document.onmousemove = function (e) {
        onCursorMove(e.pageX, e.pageY);
    };
    document.ontouchmove = function (e) {
        e.preventDefault();
        onCursorMove(e.touches[0].pageX, e.touches[0].pageY);
    };
    document.onmouseup = function (e) {
        onCursorUp(e);
    };
    document.ontouchend = function (e) {
        e.preventDefault();
        onCursorUp(e);
    };
    document.onkeydown = function (e) {
        isKeyPressing[e.keyCode] = true;
    };
    document.onkeyup = function (e) {
        isKeyPressing[e.keyCode] = false;
    };
    exports.cursorPos = new util_1.Vector();
    exports.pressedCursorPos = new util_1.Vector();
    exports.stick = new util_1.Vector();
    isInitialized = true;
}
exports.init = init;
function useStickKeyAsButton(_isUsingStickKeysAsButton) {
    if (_isUsingStickKeysAsButton === void 0) { _isUsingStickKeysAsButton = true; }
    isUsingStickKeysAsButton = _isUsingStickKeysAsButton;
}
exports.useStickKeyAsButton = useStickKeyAsButton;
function useCursorAsStick(_isUsingCursotAsStick) {
    if (_isUsingCursotAsStick === void 0) { _isUsingCursotAsStick = true; }
    isUsingCursotAsStick = _isUsingCursotAsStick;
}
exports.useCursorAsStick = useCursorAsStick;
function clearJustPressed() {
    exports.isJustPressed = false;
    exports.isPressed = true;
}
exports.clearJustPressed = clearJustPressed;
function resetPressedCursorPos(ratio) {
    if (ratio === void 0) { ratio = 1; }
    exports.pressedCursorPos.x += (exports.cursorPos.x - exports.pressedCursorPos.x) * ratio;
    exports.pressedCursorPos.y += (exports.cursorPos.y - exports.pressedCursorPos.y) * ratio;
}
exports.resetPressedCursorPos = resetPressedCursorPos;
function update() {
    if (!isInitialized) {
        return;
    }
    var pp = exports.isPressed;
    exports.isPressed = exports.isCursorDown;
    exports.stick.set();
    _.forEach(stickKeys, function (ks, i) {
        _.forEach(ks, function (k) {
            if (isKeyPressing[k]) {
                exports.stick.x += stickXys[i][0];
                exports.stick.y += stickXys[i][1];
                if (isUsingStickKeysAsButton) {
                    exports.isPressed = true;
                }
                return false;
            }
        });
    });
    exports.stickAngle = 0;
    if (exports.stick.magSq() > 0) {
        exports.stickAngle = g.wrap(Math.round(exports.stick.getAngle() / (Math.PI / 2) * 2), 0, 8);
        exports.stick.set();
        exports.stick.addAngle(exports.stickAngle * (Math.PI / 2), 1);
        exports.stickAngle++;
    }
    if (isUsingCursotAsStick && exports.isCursorDown) {
        if (exports.cursorPos.distancteTo(exports.pressedCursorPos) > 32) {
            var sa = Math.atan2(exports.cursorPos.y - exports.pressedCursorPos.y, exports.cursorPos.x - exports.pressedCursorPos.x);
            exports.stickAngle = g.wrap(Math.round(sa / (Math.PI / 2) * 2), 0, 8);
            exports.stick.set();
            exports.stick.addAngle(exports.stickAngle * (Math.PI / 2), 1);
            exports.stickAngle++;
        }
        else {
            exports.pressedCursorPos;
        }
    }
    _.forEach(buttonKeys, function (k) {
        if (isKeyPressing[k]) {
            exports.isPressed = true;
            return false;
        }
    });
    exports.isJustPressed = (!pp && exports.isPressed);
}
exports.update = update;
function onCursorDown(x, y) {
    calcCursorPos(x, y, exports.cursorPos);
    exports.pressedCursorPos.set(exports.cursorPos);
    exports.isCursorDown = true;
}
function onCursorMove(x, y) {
    calcCursorPos(x, y, exports.cursorPos);
}
function calcCursorPos(x, y, v) {
    v.x = ((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * pixelSize.x;
    v.y = ((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * pixelSize.y;
}
function onCursorUp(e) {
    exports.isCursorDown = false;
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function initSeedUi(onSeedChanged) {
    var p = document.createElement('p');
    p.innerHTML = "<button id=\"change\">change</button>\n    seed: <input type=\"number\" id=\"seed\" value=\"0\" style=\"width:80px\"></input>\n    <button id=\"set\">set</button>";
    p.style.textAlign = 'left';
    document.getElementsByTagName('body')[0].appendChild(p);
    var changeElm = document.getElementById('change');
    var seedElm = document.getElementById('seed');
    var setElm = document.getElementById('set');
    changeElm.onclick = function () {
        seedElm.value = Math.floor(Math.random() * 9999999).toString();
        onSeedChanging();
    };
    setElm.onclick = onSeedChanging;
    function onSeedChanging() {
        onSeedChanged(Number(seedElm.value));
    }
}
exports.initSeedUi = initSeedUi;
function enableShowingErrors() {
    var pre = document.createElement('pre');
    pre.style.textAlign = 'left';
    document.getElementsByTagName('body')[0].appendChild(pre);
    window.addEventListener('error', function (error) {
        var message = [error.filename, '@', error.lineno, ':\n', error.message].join('');
        pre.textContent += '\n' + message;
        return false;
    });
}
exports.enableShowingErrors = enableShowingErrors;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var LZString = __webpack_require__(12);
var playerIdKey = 'snake-shift-player-id';
var lastScore = 0;
var key;
var isEnableLeaderboard = true;
function init() {
    if (!isEnableLeaderboard) {
        return;
    }
    try {
        var playerIdStorage = localStorage.getItem(playerIdKey);
        if (playerIdStorage == null) {
            window.fetch('/api/nextPlayerId').
                then(function (result) { return result.json(); }).
                then(function (json) {
                exports.playerId = json.id;
                localStorage.setItem(playerIdKey, String(exports.playerId));
            });
        }
        else {
            exports.playerId = Number(playerIdStorage);
        }
    }
    catch (e) {
        console.error(e);
    }
}
exports.init = init;
function get(isGettingLast, isGettingBest) {
    if (isGettingLast === void 0) { isGettingLast = false; }
    if (isGettingBest === void 0) { isGettingBest = false; }
    if (!isEnableLeaderboard) {
        return;
    }
    try {
        if (exports.playerId == null) {
            exports.scores = null;
            return;
        }
        var uri = '/api/score';
        if (isGettingLast) {
            uri += "?score=" + lastScore + "&count=9";
        }
        else if (isGettingBest) {
            uri += "?playerId=" + exports.playerId;
        }
        window.fetch(uri).
            then(function (result) { return result.json(); }).
            then(function (json) {
            exports.scores = json;
            if (isGettingLast) {
                exports.scores.push({ score: lastScore, playerId: exports.playerId });
                exports.scores = _.sortBy(exports.scores, function (s) { return -s.score; });
            }
        });
    }
    catch (e) {
        exports.scores = null;
        console.error(e);
    }
}
exports.get = get;
function set(score) {
    if (!isEnableLeaderboard) {
        return;
    }
    try {
        lastScore = score;
        window.fetch("/api/key?playerId=" + exports.playerId).
            then(function (result) { return result.json(); }).
            then(function (json) {
            key = json.key;
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            var encDataStr = LZString.compressToEncodedURIComponent(JSON.stringify({
                key: key,
                score: {
                    playerId: exports.playerId,
                    score: score
                }
            }));
            window.fetch('/api/score', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    data: encDataStr
                })
            });
        });
    }
    catch (e) {
        console.error(e);
    }
}
exports.set = set;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = LZString;

/***/ })
/******/ ]);