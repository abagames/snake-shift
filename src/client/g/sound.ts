import * as Tone from 'tone';
import * as g from './index';

let random: g.Random;
let isEmptySoundPlayed = false;

export function initSound(bpm = 120) {
  random = new g.Random();
  Tone.Transport.bpm.value = bpm;
  Tone.Transport.start();
}

export function setSoundSeed(seed: number) {
  random.setSeed(seed);
}

export function playEmptySound() {
  if (isEmptySoundPlayed) {
    return;
  }
  const context = Tone.context;
  const buffer = context.createBuffer(1, 1, context.sampleRate);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
  if (context.resume) {
    context.resume();
  }
  isEmptySoundPlayed = true;
}

export class Sound {
  volumeNode;

  constructor
    (public isSe = false, public isLooping = false,
    public cordLength = 8, public speed = 1, public baseNote = 60,
    volume = 0) {
    this.volumeNode = new Tone.Volume(volume).toMaster();
    this.initParts();
  }

  chords = [
    [0, 4, 7], // M
    [0, 3, 7], // m
    [0, 4, 7, 10], // 7
    [0, 4, 7, 11], // M7
    [0, 3, 7, 10], // m7
  ];

  // I C:0, II D:2, III E:4, IV F: 5, V G:7, VI A:9, VII B:11
  progressions = [
    [[0, 0], [7, 0], [9, 1], [4, 1]],
    [[5, 0], [0, 0], [5, 0], [7, 0]],
    [[5, 3], [7, 2], [4, 4], [9, 1]],
    [[9, 1], [2, 1], [7, 0], [0, 0]],
    [[9, 1], [5, 0], [7, 0], [0, 0]]
  ];

  progression: any[];
  parts: any[];
  durations: any[];
  noteRatios: number[];
  duration: number;

  initParts() {
    const baseProgression = random.select(this.progressions);
    this.progression = [];
    for (let i = 0; i < baseProgression.length; i++) {
      const bp = baseProgression[i];
      const p = [
        bp[0],
        random.get() < 0.7 ? bp[1] : random.getInt(this.chords.length)
      ];
      this.progression.push(p);
    }
    this.parts = [];
    this.duration = baseProgression.length * this.cordLength / this.speed;
  }

  createPartsBase(restRatio = 0.5, min = -1, max = 1) {
    let velocityRatio = 1;
    let n;
    let nv = random.get(-0.5, 0.5);
    if (this.isSe) {
      min *= 2;
      max *= 2;
      velocityRatio = 2;
      n = random.get(-1, 2);
    } else {
      n = random.get();
    }
    this.durations = [];
    this.noteRatios = [];
    for (let i = 0; i < this.progression.length; i++) {
      for (let j = 0; j < this.cordLength; j++) {
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
    for (let i = 0; i < this.progression.length; i++) {
      for (let j = 0; j < this.cordLength; j++) {
        const idx = i * this.cordLength + j;
        if (this.durations[idx] === false) {
          continue;
        }
        let l = 1;
        for (let k = 1; k < this.cordLength - j; k++) {
          if (this.durations[idx + k] === false && random.get() < 0.7) {
            l++;
          }
        }
        this.durations[idx] = `0:0:${l / this.speed}`;
      }
    }
  }

  createPart(offset = 0, randomWidth = 0, cordResolution = 100) {
    let notes = [];
    for (let i = 0; i < this.progression.length; i++) {
      let d = this.progression[i][0];
      let cn = this.progression[i][1];
      let chord = this.chords[cn];
      for (let j = 0; j < this.cordLength; j++) {
        const idx = i * this.cordLength + j;
        if (this.durations[idx] === false) {
          continue;
        }
        let n = this.noteRatios[idx];
        n = Math.floor(n * cordResolution) / cordResolution;
        let b = Math.floor(n);
        let cn = Math.floor((n - Math.floor(n)) * chord.length);
        cn += offset + random.getInt(-randomWidth, randomWidth + 1);
        while (cn >= chord.length) {
          cn -= chord.length;
          b++;
        }
        while (cn < 0) {
          cn += chord.length;
          b--;
        }
        b *= 12;
        let dur = this.durations[idx];
        const note = this.midiNoteNumberToFrequency(this.baseNote + b + chord[cn]);
        if (note > 10 && note < 2000) {
          notes.push({
            time: `0:0:${idx / this.speed}`,
            note,
            dur
          });
        }
      }
    }
    const s = new Tone.Synth({
      oscillator: {
        type: 'square5'
      }
    });
    const synth = s.chain(this.volumeNode);
    const part = new Tone.Part((time, event) => {
      synth.triggerAttackRelease(event.note, event.dur, time + 0.05);
    }, notes);
    part.loop = this.isLooping;
    if (this.isLooping) {
      part.loopEnd = `0:0:${this.duration}`;
    }
    this.parts.push(part)
  }

  play() {
    this.stop();
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      p.start('+0.05');
    }
  }

  stop() {
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      p.stop();
    }
  }

  midiNoteNumberToFrequency(d) {
    const a = 440;
    return a * Math.pow(2, (d - 69) / 12);
  }
}
