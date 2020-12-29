import { extend } from 'lodash';
import * as R from 'ramda'
const stringPath = R.join('.');
type ParamPath  = Array<string>;

class Params {
    path : ParamPath;
    constructor(path : ParamPath) {
        this.path = path
    }
    setPath(name: string) {
        return stringPath([...this.path, name])
    }
}

class OscInner extends Params {
    freq: string
    fine: string 
    shape: string
    glide: string 
    track: string
    sub: string
    constructor(path : ParamPath) {
        super(path);
        this.freq = this.setPath('freq');
        this.fine = this.setPath('fine');
        this.shape = this.setPath('shape')
        this.glide = this.setPath('glide');
        this.track = this.setPath('track');
        this.sub = this.setPath('sub')
    }
}

class OscFeedback extends Params{
    gain: string
    volume: string
    constructor(path: ParamPath) {
        super(path)
        this.gain = this.setPath('gain');
        this.volume = this.setPath('volume')
    }       
}

class Envelope extends Params{
    amount: string;
    velo: string;
    delay: string;
    attack: string;
    decay: string;
    sustain: string;
    release: string;
    constructor(path: ParamPath) {
        super(path);
        this.amount = this.setPath('amount');
        this.velo = this.setPath('velo');
        this.delay = this.setPath('delay');
        this.attack = this.setPath('attack');
        this.decay = this.setPath('decay');
        this.sustain = this.setPath('sustain');
        this.release = this.setPath('release');
    }
}

class Unison extends Params {
    mode: string;
    priority: string;
    on: string;
    constructor(path: ParamPath) {
        super(path);
        this.mode = this.setPath('mode')
        this.priority = this.setPath('priority')
        this.on = this.setPath('on')
    }
}

class Osc extends Params {
    a: OscInner
    b: OscInner
    sync: string
    glide: string
    slop: string
    bend: string
    mix: string
    noise: string
    feedback: OscFeedback
    unison: Unison
    constructor(path: ParamPath) {
        super(path)
        this.a = new OscInner([...path, 'a']);
        this.b = new OscInner([...path, 'b']);
        this.sync = this.setPath('sync');
        this.glide = this.setPath('glide');
        this.slop = this.setPath('slop');
        this.bend = this.setPath('bend');
        this.mix = this.setPath('mix');
        this.noise = this.setPath('noise');
        this.feedback = new OscFeedback([...path, 'feedback']);
        this.unison = new Unison([...path, 'unison']);
    }
}

class Lpf extends Params {
    freq: string;
    reso: string;
    key: string;
    mod: string;
    poles: string; 
    env: Envelope;
    constructor(path: ParamPath) {
        super(path);
        this.freq = this.setPath('freq');
        this.reso = this.setPath('reso');
        this.key = this.setPath('key');
        this.mod = this.setPath('mod');
        this.poles = this.setPath('poles');
        this.env = new Envelope([...path, 'env']);
    }
}

class Amp extends Params {
    initial: string;
    env: Envelope;
    spread: string;
    volume: string;
    constructor(path: ParamPath) {
        super(path);
        this.initial = this.setPath('initial');
        this.env = new Envelope([...path, 'env']);
        this.spread = this.setPath('spread');
        this.volume = this.setPath('volume');
    }
}

class LfoInner extends Params{
    freq: string;
    shape: string;
    amount: string;
    destination: string;
    sync: string;
    constructor(path: ParamPath) {
        super(path);
        this.freq = this.setPath('freq');
        this.shape = this.setPath('shape');
        this.amount = this.setPath('amount');
        this.destination = this.setPath('destination');
        this.sync = this.setPath('sync')
    }
}

class Lfo extends Params {
    a: LfoInner
    b: LfoInner
    c: LfoInner
    d: LfoInner
    constructor(path : ParamPath) {
        super(path);
        this.a = new LfoInner([...path, 'a']);
        this.b = new LfoInner([...path, 'b']);
        this.c = new LfoInner([...path, 'b']);
        this.d = new LfoInner([...path, 'd']);

    }
}

class Env3 extends Params {
    destination: string;
    env: Envelope
    repeat: string;
    constructor(path: ParamPath) {
        super(path);
        this.destination = this.setPath('destination');
        this.env = new Envelope([...path, 'env']);
        this.repeat = this.setPath('repeat');
    }
}

class Mod extends Params {
    source: string;
    amount: string;
    destination: string;
    constructor(path: ParamPath) {
        super(path);
        this.source = this.setPath('source');
        this.amount = this.setPath('amount');
        this.destination = this.setPath('destination');
    }
}

class FixedMod extends Params {
    amount: string;
    destination: string;
    constructor(path: ParamPath) {
        super(path);
        this.amount = this.setPath('amount');
        this.destination = this.setPath('destination');
    }
}

class Mods extends Params {
    a: Mod;
    b: Mod;
    c: Mod;
    d: Mod;
    wheel: FixedMod;
    pressure: FixedMod;
    breath: FixedMod;
    velo: FixedMod;
    foot: FixedMod;
    constructor(path: ParamPath) {
        super(path);
        this.a = new Mod([...path, 'a']);
        this.b = new Mod([...path, 'b']);
        this.c = new Mod([...path, 'c']);
        this.d = new Mod([...path, 'd']);
        this.wheel = new FixedMod([...path, 'wheel']);
        this.pressure = new FixedMod([...path, 'pressure']);
        this.breath = new FixedMod([...path, 'breath']);
        this.velo = new FixedMod([...path, 'velo']);
        this.foot = new FixedMod([...path, 'foot']);
    }
}

class Push extends Params {
    note: string;
    velo: string;
    mode: string;
    constructor(path: ParamPath) {
        super(path);
        this.note = this.setPath('note');
        this.velo = this.setPath('velo');
        this.mode = this.setPath('mode');
    }
}

class Four extends Params {
    a: string;
    b: string;
    c: string;
    d: string;
    constructor(path: ParamPath) {
        super(path);
        this.a = this.setPath('a');
        this.b = this.setPath('b');
        this.c = this.setPath('c');
        this.d = this.setPath('d');
    }
}

class Arp extends Params {
    on: string;
    mode: string;
    bpm: string;
    clock: string;
    constructor(path: ParamPath) {
        super(path);
        this.on = this.setPath('on');
        this.mode = this.setPath('mode');
        this.bpm = this.setPath('bpm');
        this.clock = this.setPath('clock');
    }
}

class Sequencer extends Params {
    trigger: string;
    toggle: string;
    destination: Four;
    constructor(path: ParamPath) {
        super(path);
        this.trigger = this.setPath('trigger');
        this.toggle = this.setPath('toggle');
        this.destination = new Four([...path, 'destination']);
    }
}

class Bits extends Params {
    push: Push;
    arp: Arp;
    seq: Sequencer;
    constructor(path: ParamPath) {
        super(path);
        this.push = new Push([...path, 'push']);
        this.seq = new Sequencer([...path, 'seq']);
        this.arp = new Arp([...path, 'arp']);
    }
}

class Sixteen extends Params {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    h: string;
    i: string;
    j: string;
    k: string;
    l: string;
    m: string;
    n: string;
    o: string;
    p: string;
    constructor(path: ParamPath) {
        super(path);
        R.forEach((charCode: number) => {
            let letter = String.fromCharCode(charCode);
            this[letter] = this.setPath(letter)
        }, R.range(97, 113));
    }
}

class Tracks extends Params {
    a: Sixteen;
    b: Sixteen;
    c: Sixteen;
    d: Sixteen;
    constructor(path: ParamPath) {
        super(path);
        this.a = new Sixteen([...path, 'a']);
        this.b = new Sixteen([...path, 'b']);
        this.c = new Sixteen([...path, 'c']);
        this.d = new Sixteen([...path, 'd']);
    }
}

class Categories extends Params {
    osc: Osc;
    lpf: Lpf;
    amp: Amp;
    lfo: Lfo;
    env3: Env3;
    mod: Mods;
    bits: Bits;
    track: Tracks;
    constructor(path: ParamPath) {
        super(path);
        this.osc = new Osc([...path, 'osc']);
        this.lpf = new Lpf([...path, 'lpf']);
        this.amp = new Amp([...path, 'amp']);
        this.lfo = new Lfo([...path, 'lfo']);
        this.env3 = new Env3([...path, 'env3']);
        this.mod = new Mods([...path, 'mod']);
        this.bits = new Bits([...path, 'bits']);
        this.track = new Tracks([...path, 'track']);
        
    }
}

class Global extends Params {
    split: string;
    mode: string;
    assign: Four;
    name: Sixteen;
    constructor(path: ParamPath) {
        super(path);
        this.split = this.setPath('split');
        this.mode = this.setPath('mode');
        this.assign = new Four([...path, 'assign']);
        this.name = new Sixteen([...path, 'name']);
    }
}

class Tetra {
    a: Categories;
    b: Categories;
    global: Global;
    constructor() {
        this.a = new Categories(['a']);
        this.b = new Categories(['b']);
        this.global = new Global(['global']);
    }
}

export const tetraParams = new Tetra();