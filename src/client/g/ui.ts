import * as _ from 'lodash';
import * as g from './index';
import { Vector } from './util';
import { playEmptySound } from './sound';

export let cursorPos: Vector;
export let pressedCursorPos: Vector;
export let isPressed = false;
export let isJustPressed = false;
export let stick: Vector;
export let stickAngle: number;
export let isCursorDown = false;
let canvas: HTMLCanvasElement;
let pixelSize: Vector;
let isInitialized = false;
let isUsingStickKeysAsButton = false;
let isUsingCursotAsStick = false;
const isKeyPressing = _.times(256, () => false);
const stickKeys = [[39, 68, 102], [40, 83, 101, 98], [37, 65, 100], [38, 87, 104]];
const stickXys = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const buttonKeys = [90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 17, 16, 18, 32, 13];

export function init(_canvas: HTMLCanvasElement, _pixelSize: Vector) {
  canvas = _canvas;
  pixelSize = _pixelSize;
  document.onmousedown = (e) => {
    onCursorDown(e.pageX, e.pageY);
  };
  document.ontouchstart = (e) => {
    e.preventDefault();
    playEmptySound();
    onCursorDown(e.touches[0].pageX, e.touches[0].pageY);
  };
  document.onmousemove = (e) => {
    onCursorMove(e.pageX, e.pageY);
  };
  document.ontouchmove = (e) => {
    e.preventDefault();
    onCursorMove(e.touches[0].pageX, e.touches[0].pageY);
  };
  document.onmouseup = (e) => {
    onCursorUp(e);
  };
  document.ontouchend = (e) => {
    e.preventDefault();
    onCursorUp(e);
  };
  document.onkeydown = (e) => {
    isKeyPressing[e.keyCode] = true;
  };
  document.onkeyup = (e) => {
    isKeyPressing[e.keyCode] = false;
  };
  cursorPos = new Vector();
  pressedCursorPos = new Vector();
  stick = new Vector();
  isInitialized = true;
}

export function useStickKeyAsButton(_isUsingStickKeysAsButton = true) {
  isUsingStickKeysAsButton = _isUsingStickKeysAsButton;
}

export function useCursorAsStick(_isUsingCursotAsStick = true) {
  isUsingCursotAsStick = _isUsingCursotAsStick;
}

export function clearJustPressed() {
  isJustPressed = false;
  isPressed = true;
}

export function resetPressedCursorPos(ratio = 1) {
  pressedCursorPos.x += (cursorPos.x - pressedCursorPos.x) * ratio;
  pressedCursorPos.y += (cursorPos.y - pressedCursorPos.y) * ratio;
}

export function update() {
  if (!isInitialized) {
    return;
  }
  const pp = isPressed;
  isPressed = isCursorDown;
  stick.set();
  _.forEach(stickKeys, (ks, i) => {
    _.forEach(ks, k => {
      if (isKeyPressing[k]) {
        stick.x += stickXys[i][0];
        stick.y += stickXys[i][1];
        if (isUsingStickKeysAsButton) {
          isPressed = true;
        }
        return false;
      }
    });
  });
  stickAngle = 0;
  if (stick.magSq() > 0) {
    stickAngle = g.wrap(Math.round(stick.getAngle() / (Math.PI / 2) * 2), 0, 8);
    stick.set();
    stick.addAngle(stickAngle * (Math.PI / 2), 1);
    stickAngle++;
  }
  if (isUsingCursotAsStick && isCursorDown) {
    if (cursorPos.distancteTo(pressedCursorPos) > 32) {
      const sa = Math.atan2(cursorPos.y - pressedCursorPos.y, cursorPos.x - pressedCursorPos.x);
      stickAngle = g.wrap(Math.round(sa / (Math.PI / 2) * 2), 0, 8);
      stick.set();
      stick.addAngle(stickAngle * (Math.PI / 2), 1);
      stickAngle++;
    } else {
      pressedCursorPos
    }
  }
  _.forEach(buttonKeys, k => {
    if (isKeyPressing[k]) {
      isPressed = true;
      return false;
    }
  });
  isJustPressed = (!pp && isPressed);
}

function onCursorDown(x, y) {
  calcCursorPos(x, y, cursorPos);
  pressedCursorPos.set(cursorPos);
  isCursorDown = true;
}

function onCursorMove(x, y) {
  calcCursorPos(x, y, cursorPos);
}

function calcCursorPos(x, y, v) {
  v.x = ((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * pixelSize.x;
  v.y = ((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * pixelSize.y;
}

function onCursorUp(e) {
  isCursorDown = false;
}
