import * as _ from 'lodash';
import * as lp from 'locate-print';
import * as g from './g/index';

window.onload = () => {
  g.init(() => {
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

let snakeX = 0;
let snakeY = 0;
let snakeVx = 0;
let snakeVy = 0;
let snakePoss = [];
let itemX = 0;
let itemY = 0;
let itemScore = 100;
let isShowingInstruction = true;

function begin() {
  startSound.play();
  lp.cls();
  lp.color(7);
  lp.print(_.times(40, () => '#').join(''));
  _.times(18, () => {
    lp.print('#' + _.times(38, () => ' ').join('') + '#');
  });
  lp.print(_.times(40, () => '#').join(''));
  snakeX = 20;
  snakeY = 10;
  snakePoss = [];
  _.times(3, i => {
    const x = snakeX;
    const y = snakeY + 2 - i;
    snakePoss.push({ x, y });
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
  for (let i = 0; i < 100; i++) {
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

const ways = [[0, 0], [1, 0], [0, 0], [0, 1], [0, 0], [-1, 0], [0, 0], [0, -1], [0, 0]];
const aroundOffsets = [[1, 0], [0, 1], [-1, 0], [0, -1]];
let isPressing = false;

function update() {
  if (g.scene !== g.Scene.started) {
    return;
  }
  /*if (g.ticks === 120) {
    bgmSound.play();
  }*/
  let wc = 0;
  let emptyWay = -1;
  _.times(4, i => {
    const rx = snakeX + aroundOffsets[i][0];
    const ry = snakeY + aroundOffsets[i][1];
    const rs = lp.screen(rx, ry);
    if ((rs !== ' ' && rs !== '$') || ry < 1) {
      wc++;
    } else {
      emptyWay = i;
    }
  });
  if (wc >= 4) {
    end();
    return;
  }
  let isPressed = false;
  if (wc === 3) {
    snakeVx = aroundOffsets[emptyWay][0];
    snakeVy = aroundOffsets[emptyWay][1];
    isPressing = false;
  } else {
    snakeVx = ways[g.ui.stickAngle][0];
    snakeVy = ways[g.ui.stickAngle][1];
    isPressed = true;
  }
  if (snakeVx !== 0 || snakeVy !== 0) {
    if (!isPressing) {
      isPressing = true;
      for (let i = 0; i < 100; i++) {
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
  } else {
    isPressing = false;
  }
  g.ui.resetPressedCursorPos(0.1);
  itemScore = Math.floor(itemScore * 0.99);
  if (itemScore <= 0) {
    itemScore = 1;
  }
  const iss = ` ${itemScore} `;
  lp.locate(20 - Math.floor(iss.length / 2), 0);
  lp.print(iss);
}

function moveSnake() {
  const x = snakeX;
  const y = snakeY;
  const nx = x + snakeVx;
  const ny = y + snakeVy;
  let isMoving = true;
  let isGettingItem = false;
  const ns = lp.screen(nx, ny);
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
    const p = snakePoss[0];
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
  lp.print(`
##@ #  #  ##  #  @ ####
#   ## # #  # # #  #
### ## # #  # ##   ###
  # # ## #### # #  #
### @ ## #  @ #  # ######@
`);
  lp.locate(10, 7);
  lp.print(`
   ### #  # @  ###@ @###
   #   #  # #  #     #
   ### #### #  ###   #
     # #  # #  #     #
@##### #  @ #  #     #
    
`);
  var t = g.ticks % 60;
  lp.color(7);
  lp.locate(10, 16);
  if (t < 30) {
    lp.print('PRESS OR TAP TO START');
  }
}
let startSound: g.Sound;
let bgmSound: g.Sound;
let moveSound: g.Sound;
let itemSound: g.Sound;
let endSound: g.Sound;

function createSounds() {
  startSound = new g.Sound(false, false, 4, 1, 65, -20);
  startSound.createPartsBase()
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

function createSe(baseNote, cordLength, volume = 0) {
  const se = new g.Sound(true, false, cordLength, 8, baseNote, volume);
  se.createPartsBase();
  se.createPart();
  se.createPart(-2, 2);
  se.createPartsBase();
  se.createPart(-4, 4);
  return se;
}
