import * as _ from 'lodash';
import * as lp from 'locate-print';
import * as gcc from 'gcc';

import Random from './random';
import { Sound, initSound, setSoundSeed } from './sound';
import * as ui from './ui';
import * as debug from './debug';
import * as util from './util';
import * as leaderboard from './leaderboard';
export { Random, Sound, ui, debug };
export * from './util';

export enum Scene {
  title, started, ended
};

export let scene = Scene.started;
export let ticks = 0;
export let random: Random;
const titleCont = null;
const titleScale = 3;
const titleHue = 0;
let seedRandom: Random;
let isDebugEnabled = false;
let onSeedChangedFunc: Function;
let score = 0;
let scoreMultiplier = 0;
let titleFunc: Function;
let beginFunc: Function;
let updateFunc: Function;

export function init(initFunc: Function = null, _titleFunc: Function,
  _beginFunc: Function = null, _updateFunc: Function = null, tempo = 120) {
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
  initSound(tempo);
  seedRandom = new Random();
  random = new Random();
  if (initFunc != null) {
    initFunc();
  }
  if (isDebugEnabled) {
    begin();
  } else {
    title();
  }
  update();
}

export function enableDebug(_onSeedChangedFunc = null) {
  onSeedChangedFunc = _onSeedChangedFunc;
  debug.initSeedUi(setGenerationSeeds);
  debug.enableShowingErrors();
  isDebugEnabled = true;
}

function begin(seed: number = null) {
  scene = Scene.started;
  ui.clearJustPressed();
  if (seed == null) {
    seed = seedRandom.getInt(9999999);
  }
  clearGameStatus();
  scene = Scene.started;
  random.setSeed(seed);
  lp.cls();
  if (beginFunc != null) {
    beginFunc();
  }
}

export function end() {
  if (scene === Scene.ended || scene == Scene.title) {
    return;
  }
  ui.clearJustPressed();
  scene = Scene.ended;
  ticks = 0;
  leaderboard.set(score);
}

function clearGameStatus() {
  ticks = 0;
  score = 0;
  scoreMultiplier = 1;
}

function title() {
  scene = Scene.title;
  ticks = score === 0 ? 0 : 180;
  lp.cls();
}

export function setGenerationSeeds(seed: number) {
  setSoundSeed(seed);
  if (onSeedChangedFunc != null) {
    onSeedChangedFunc();
  }
}

export function addScore(v: number = 1) {
  if (scene === Scene.started) {
    score += v * scoreMultiplier;
  }
}

export function addScoreMultiplier(v: number = 1) {
  scoreMultiplier += v;
}

export function setScoreMultiplier(v: number = 1) {
  scoreMultiplier = v;
}

export function getDifficulty() {
  return util.getDifficulty();
}

function update() {
  requestAnimationFrame(update);
  ui.update();
  handleScene();
  if (updateFunc != null) {
    updateFunc();
  }
  drawSceneText();
  lp.update();
  ticks++;
  //gcc.capture(lp.fxCanvas);
}

function handleScene() {
  if (scene === Scene.title && ui.isJustPressed) {
    begin();
  }
  if (scene === Scene.ended &&
    (ticks >= 60 || (ticks >= 20 && ui.isJustPressed))) {
    title();
  }
}

function drawSceneText() {
  switch (scene) {
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

const leaderboardTypes = ['LAST', 'BEST', 'TOP'];
const rankStrings = ['ST', 'ND', 'RD'];

function drawTitle() {
  lp.cls();
  const tt = Math.floor(ticks / 180) % 4;
  const t = ticks % 180;
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
  _.forEach(leaderboard.scores, (s, i) => {
    const y = 4 + i;
    lp.color(7);
    if (s.playerId === leaderboard.playerId) {
      lp.color(s.rank == null ? 6 : 5);
      lp.locate(2, y);
      lp.print('YOU');
    }
    if (s.rank != null) {
      const rs =
        `${s.rank + 1}${(s.rank < 3) ? rankStrings[s.rank] : 'TH'}`;
      lp.locate(14, y);
      lp.print(rs);
    }
    const ss = String(s.score);
    lp.locate(37 - ss.length, y);
    lp.print(ss);
  });
}
