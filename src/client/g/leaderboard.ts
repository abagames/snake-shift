import * as _ from 'lodash';
import * as LZString from 'lz-string';

export let scores: any[];
export let playerId: number;
const playerIdKey = 'snake-shift-player-id';
let lastScore = 0;
let key: string;

export function init() {
  try {
    const playerIdStorage = localStorage.getItem(playerIdKey);
    if (playerIdStorage == null) {
      window.fetch('/api/nextPlayerId').
        then(result => result.json()).
        then(json => {
          playerId = json.id;
          localStorage.setItem(playerIdKey, String(playerId));
        });
    } else {
      playerId = Number(playerIdStorage);
    }
  } catch (e) {
    console.error(e);
  }
}

export function get(isGettingLast = false, isGettingBest = false) {
  try {
    if (playerId == null) {
      scores = null;
      return;
    }
    let uri = '/api/score';
    if (isGettingLast) {
      uri += `?score=${lastScore}&count=9`;
    } else if (isGettingBest) {
      uri += `?playerId=${playerId}`;
    }
    window.fetch(uri).
      then(result => result.json()).
      then(json => {
        scores = json;
        if (isGettingLast) {
          scores.push({ score: lastScore, playerId });
          scores = _.sortBy(scores, s => -s.score);
        }
      });
  } catch (e) {
    scores = null;
    console.error(e);
  }
}

export function set(score: number) {
  try {
    lastScore = score;
    window.fetch(`/api/key?playerId=${playerId}`).
      then(result => result.json()).
      then(json => {
        key = json.key;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const encDataStr =
          LZString.compressToEncodedURIComponent(JSON.stringify({
            key,
            score: {
              playerId,
              score
            }
          }));
        window.fetch('/api/score', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            data: encDataStr
          })
        });
      });
  } catch (e) {
    console.error(e);
  }
}
