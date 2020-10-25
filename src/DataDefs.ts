import * as R from 'ramda'
import * as S from './LayerA_Names'
import {tetraParams as t} from './TetraKeyDefs'

let settingsObject = {value: 0}
const MOD_SOURCES = [
    "Off",
    "Sequence Track 1",
    "Sequence Track 2",
    "Sequence Track 3",
    "Sequence Track 4",
    "LFO 1",
    "LFO 2",
    "LFO 3",
    "LFO 4",
    "Filter Envelope",
    "Amp Envelope",
    "Envelope 3",
    "Pitch Bend",
    "Mod Wheel",
    "Pressure",
    "MIDI Breath",
    "MIDI Foot",
    "MIDI Expression",
    "Velocity",
    "Note Number",
    "Noise"
];

const MOD_DESTINATIONS = [
    "Off",
    "Osc 1 Freq",
    "Osc 2 Freq",
    "Osc 1 and 2 Freq",
    "Osc Mix",
    "Noise Level",
    "Osc 1 Pulse Width",
    "Osc 2 Pulse Width",
    "Osc 1 and 2 Pulse Width",
    "Filter Frequency",
    "Resonance",
    "Filter Audio Mod Amt",
    "VCA Level",
    "Pan Spread",
    "LFO 1 Freq",
    "LFO 2 Freq",
    "LFO 3 Freq",
    "LFO 4 Freq",
    "All LFO Freq",
    "LFO 1 Amt",
    "LFO 2 Amt",
    "LFO 3 Amt",
    "LFO 4 Amt",
    "All LFO Amt",
    "Filter Env Amt",
    "Amp Env Amt",
    "Env 3 Amt",
    "All Env Amounts",
    "Env 1 Attack",
    "Env 2 Attack",
    "Env 3 Attack",
    "All Env Attacks",
    "Env 1 Decay",
    "Env 2 Decay",
    "Env 3 Decay",
    "All Env Decays",
    "Env 1 Release",
    "Env 2 Release",
    "Env 3 Release",
    "All Env Releases",
    "Mod 1 Amt",
    "Mod 2 Amt",
    "Mod 3 Amt",
    "Mod 4 Amt",
    "Feedback Volume",
    "Sub Osc 1 Level",
    "Sub Osc 2 Level",
    "Feedback Gain",
    "Slew"
];

let ProgramEditBufferPos : Array<Array<string>> = [
    [
        t.a.osc.a.freq,  // 0
        t.a.osc.a.fine,
        t.a.osc.a.shape,
        t.a.osc.a.glide,
        t.a.osc.a.track,
        t.a.osc.a.sub,
        t.a.osc.b.freq
    ],[
        t.a.osc.b.fine,  // 7
        t.a.osc.b.shape,
        t.a.osc.b.glide,
        t.a.osc.b.track,
        t.a.osc.b.sub,
        t.a.osc.sync,
        t.a.osc.glide
    ],[
        t.a.osc.slop,  // 14
        t.a.osc.bend,
        t.a.osc.mix,
        t.a.osc.noise,
        t.a.osc.feedback.gain,
        t.a.osc.feedback.volume,
        t.a.lpf.freq
    ],[
        t.a.lpf.reso,  // 21
        t.a.lpf.key,
        t.a.lpf.mod,
        t.a.lpf.poles,
        t.a.lpf.env.amount,
        t.a.lpf.env.velo,
        t.a.lpf.env.delay
    ],[
        t.a.lpf.env.attack,  //28
        t.a.lpf.env.decay,
        t.a.lpf.env.sustain,
        t.a.lpf.env.release,
        t.a.amp.initial,
        t.a.amp.env.amount,
        t.a.amp.env.velo
    ],[
        t.a.amp.env.delay,  //35
        t.a.amp.env.attack,
        t.a.amp.env.decay,
        t.a.amp.env.sustain,
        t.a.amp.env.release,
        t.a.amp.spread,
        t.a.amp.volume
    ],[
        t.a.lfo.a.freq,  //42
        t.a.lfo.a.shape,
        t.a.lfo.a.amount,
        t.a.lfo.a.destination,
        t.a.lfo.a.sync,
        t.a.lfo.b.freq,
        t.a.lfo.b.shape,
    ],[
        t.a.lfo.b.amount,  //49
        t.a.lfo.b.destination,
        t.a.lfo.b.sync,
        t.a.lfo.c.freq,
        t.a.lfo.c.shape,
        t.a.lfo.c.amount,
        t.a.lfo.c.destination,
    ],[
        t.a.lfo.c.sync,
        t.a.lfo.d.freq,
        t.a.lfo.d.shape,
        t.a.lfo.d.amount,
        t.a.lfo.d.destination,
        t.a.lfo.d.sync,
        t.a.env3.destination,
    ],[
        t.a.env3.env.amount,  //63
        t.a.env3.env.velo,
        t.a.env3.env.delay,
        t.a.env3.env.attack,
        t.a.env3.env.decay,
        t.a.env3.env.sustain,
        t.a.env3.env.release
    ], [
        t.a.env3.repeat,  //70
        t.a.mod.a.source,
        t.a.mod.a.amount,
        t.a.mod.a.destination,
        t.a.mod.b.source,
        t.a.mod.b.amount,
        t.a.mod.b.destination
    ],[
        t.a.mod.c.source,  //77
        t.a.mod.c.amount,
        t.a.mod.c.destination,
        t.a.mod.d.source,
        t.a.mod.d.amount,
        t.a.mod.d.destination,
        t.a.mod.wheel.amount
    ],[
        t.a.mod.wheel.destination,  //84
        t.a.mod.pressure.amount,
        t.a.mod.pressure.destination,
        t.a.mod.breath.amount,
        t.a.mod.breath.destination,
        t.a.mod.velo.amount,
        t.a.mod.velo.destination
    ],[
        t.a.mod.foot.amount,
        t.a.mod.foot.destination,
        t.a.osc.unison.mode, 
        t.a.osc.unison.priority,
        t.a.osc.unison.on,
        t.a.bits.push.note,
        t.a.bits.push.velo
    ],[
        t.a.bits.push.mode,
        t.global.split,
        t.global.mode,
        t.a.bits.arp.bpm,
        t.a.bits.arp.clock,
        t.a.bits.arp.mode,
        t.a.bits.arp.on
    ],[
        t.a.bits.seq.trigger,
        t.a.bits.seq.toggle,
        t.a.bits.seq.destination.a,
        t.a.bits.seq.destination.b,
        t.a.bits.seq.destination.c,
        t.a.bits.seq.destination.d,
        t.global.assign.a
    ],[
        t.global.assign.b,  //112
        t.global.assign.c,
        t.global.assign.d,
        S.NOT_USED,
        S.NOT_USED,
        S.NOT_USED,  //Editor byte
        S.NOT_USED,
    ],
    [
        S.NOT_USED,  // 119
        t.a.track.a.a,
        t.a.track.a.b,
        t.a.track.a.c,
        t.a.track.a.d,
        t.a.track.a.e,
        t.a.track.a.f,
    ],
    [
        t.a.track.a.g,
        t.a.track.a.h,
        t.a.track.a.i,
        t.a.track.a.j,
        t.a.track.a.k,
        t.a.track.a.l,
        t.a.track.a.m,
    ],
    [
        t.a.track.a.n,
        t.a.track.a.o,
        t.a.track.a.p,
        t.a.track.b.a,
        t.a.track.b.b,
        t.a.track.b.c,
        t.a.track.b.d,
    ],
    [
        t.a.track.b.e,
        t.a.track.b.f,
        t.a.track.b.g,
        t.a.track.b.h,
        t.a.track.b.i,
        t.a.track.b.j,
        t.a.track.b.k,
    ]
];

let ProgramEditBufferObj = R.pipe(
    R.flatten,
    R.chain(k => [k, R.clone(settingsObject)]),
    R.splitEvery(2),
    R.fromPairs
)(ProgramEditBufferPos)

export { ProgramEditBufferPos, ProgramEditBufferObj, MOD_DESTINATIONS, MOD_SOURCES}