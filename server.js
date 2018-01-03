"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const LZString = require("lz-string");
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
class Score {
}
const scoresFileName = '.data/scores.json';
let scores = [];
let nextPlayerId = 0;
let keys = {};
process.on('uncaughtException', (e) => {
    console.error('uncaughtException: ' + e);
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/api/score', (req, res) => {
    res.json(getScores(req.query));
});
app.post('/api/score', (req, res) => {
    setScore(req.body);
    res.send('');
    setSavingTimeout();
});
app.get('/api/nextPlayerId', (req, res) => {
    res.json(getNextPlayerId());
});
app.get('/api/key', (req, res) => {
    res.json(getKey(req.query));
});
loadScores();
const listener = app.listen(process.env.PORT, () => {
    console.log(`leaderboard server ready. port: ${listener.address().port}`);
});
let savingTimeout;
function setSavingTimeout() {
    if (savingTimeout != null) {
        clearTimeout(savingTimeout);
    }
    savingTimeout = setTimeout(save, 60 * 1000);
}
function save() {
    saveScores();
    clearTimeout(savingTimeout);
    savingTimeout = null;
}
function loadScores() {
    try {
        scores = JSON.parse(fs.readFileSync(scoresFileName, { encoding: 'utf8' }));
        nextPlayerId = _.maxBy(scores, s => s.playerId).playerId + 1;
    }
    catch (e) {
        console.error(`load scores failed: ${e}`);
    }
}
function saveScores() {
    try {
        ensureDirectoryExistence(scoresFileName);
        fs.writeFileSync(scoresFileName, JSON.stringify(scores), { encoding: 'utf8' });
    }
    catch (e) {
        console.error(`save scores failed: ${e}`);
    }
}
function ensureDirectoryExistence(filePath) {
    const dirName = path.dirname(filePath);
    if (fs.existsSync(dirName)) {
        return true;
    }
    ensureDirectoryExistence(dirName);
    fs.mkdirSync(dirName);
}
function getScores(query) {
    let count = 10;
    if (query.count != null) {
        count = Number(query.count);
    }
    let startIndex = 0;
    if (query.score != null) {
        const score = Number(query.score);
        const scoreIndex = _.sortedIndexBy(scores, { score }, s => -s.score);
        startIndex = scoreIndex - Math.floor(count / 2);
    }
    if (query.playerId != null) {
        const playerId = Number(query.playerId);
        const bestIndex = _.findIndex(scores, s => s.playerId === playerId);
        if (bestIndex >= 0) {
            startIndex = bestIndex - Math.floor(count / 2);
        }
    }
    if (startIndex < 0) {
        startIndex = 0;
    }
    if (count + startIndex > scores.length) {
        startIndex -= count + startIndex - scores.length;
        if (startIndex < 0) {
            startIndex = 0;
        }
    }
    if (count + startIndex > scores.length) {
        count = scores.length - startIndex;
    }
    return _.times(count, i => scores[i + startIndex]);
}
function setScore(body) {
    const data = JSON.parse(LZString.decompressFromEncodedURIComponent(body.data));
    const key = data.key;
    const score = data.score;
    const playerId = score.playerId;
    if (key == null || playerId == null || keys[playerId] !== key) {
        return;
    }
    const best = _.find(scores, s => s.playerId === playerId);
    if (best == null || score.score > best.score) {
        score.time = new Date().getTime();
        scores = insertScore(scores, score);
        scores = _.map(scores, (s, i) => {
            s.rank = i;
            return s;
        });
    }
}
function insertScore(_scores, score) {
    _scores = _.filter(_scores, s => s.playerId !== score.playerId);
    const insertIndex = _.sortedIndexBy(_scores, { score: score.score }, s => -s.score);
    _scores.splice(insertIndex, 0, score);
    return _scores;
}
function getNextPlayerId() {
    const result = nextPlayerId;
    nextPlayerId++;
    return { id: result };
}
function getKey(query) {
    if (query.playerId == null) {
        return { key: null };
    }
    const key = (Math.random() + 1).toString(36).substring(7);
    keys[query.playerId] = key;
    return { key };
}
