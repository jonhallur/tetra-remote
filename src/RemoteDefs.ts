import {tetraParams as t} from './TetraKeyDefs'
import {MOD_DESTINATIONS, MOD_SOURCES} from './DataDefs'
import * as R from 'ramda'
const toString = R.map(R.toString);
const stringRange = (start : number, end: number) => toString(R.range(start, end+1))
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [0,1,2,3,4,5,6,7,8,9];
const FreqValues = [...R.chain(oct => R.map(note => note + oct,NOTES), OCTAVES), 'C10']
const PULSE_RANGES = R.map(n => "Pulse " + n, toString(R.range(0, 100)));
const WaveForms = ['Off', 'Saw', 'Triangle', 'Saw / Tri', ...PULSE_RANGES]
const OFF_ON = ['Off', 'On']
const SEVEN_BITS = stringRange(0,127);
const LFO_FREQ = [
    ...stringRange(0,150), '32st', '16st', '8st', '6st', '4st', '3st', '2st', '1.5st', 
    '1', '2/3', '1/2', '1/3', '1/4', '1/6', '1/8', '1/16'
]
const LFO_WAVE = ['Tri', 'RSaw', 'Saw', 'Squ', 'Rnd']
const ARP_MODES = [
    'Up', 'Down', 'Up/Down', 'Assign', 'Random', 
    '2 Up', '2 Down', '2 Up/Down', '2 Assign', '2 Random',
    '3 Up', '3 Down', '3 Up/Down', '3 Assign', '3 Random',
]
const CLOCK_DIVIDE = [
    '1/2', '1/4', '1/8', '1/8 half swing', '1/8 full swing', '1/8 3rd',
    '1/16', '1/16 half swing', '1/16 full swing', '1/16 3rd',
    '1/32', '1/32 3rd', '1/64 3rd'
]
const SEVEN_BIT_CONTROL = (label: string, key: string, def: number, nrpn: number) : IControl => { 
    return {
        label, key, min: 0, max: 127, values: SEVEN_BITS, default: def, nrpn
    }
}
const ENV_AMOUNT = (label: string, key: string, nrpn: number): IControl => {
    return {
        label, key, min: 0, max: 254, values: toString(R.range(-127, 128)), default: 128, nrpn
    }
}
const DESTINATION = (label: string, key: string, nrpn: number): IControl => {
    return {
        label, key, min: 0, max: 47, values: MOD_DESTINATIONS, default: 0, nrpn
    }
}

interface IControl {
    label : string;
    key: string;
    min: number;
    max: number;
    values: Array<string>;
    nrpn: number;
    default : number;
    current? : number;
}

interface ITab {
    name:string;
    controls: Array<IControl>;
}

interface ICategory {
    width?: number;
    height?: number;
    tabs: Array<ITab>
}

interface ILayer {
    name: string;
    categories: Array<ICategory>
}

type IRemote = Array<ILayer>;

let TetraRemote : IRemote =
[
    {
        name: "Layer A",
        categories: [
            {
                width: 4,
                height: 2,
                tabs: [
                    {
                        name: "Osc1",
                        controls: [
                            {
                                label: "Freq",
                                key: t.a.osc.a.freq,
                                min: 0,
                                max: 120,
                                values: FreqValues,
                                nrpn: 0,
                                default: 24
                            },{
                                label: "Fine",
                                key: t.a.osc.a.fine,
                                min: 0,
                                max: 100,
                                values: toString(R.range(-50, 51)),
                                nrpn: 1,
                                default: 50
                            },{
                                label: "Shape",
                                key: t.a.osc.a.shape,
                                min: 0,
                                max: 103,
                                values: WaveForms,
                                nrpn: 2,
                                default: 1
                            },{
                                label: 'Track',
                                key: t.a.osc.a.track,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                nrpn: 4,
                                default: 1
                            },{
                                label: "Sub",
                                key: t.a.osc.a.sub,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 114,
                                default: 0
                            },{
                                label: "Glide",
                                key: t.a.osc.a.glide,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 3,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "Osc2",
                        controls: [
                            {
                                label: "Freq",
                                key: t.a.osc.b.freq,
                                min: 0,
                                max: 120,
                                values: FreqValues,
                                nrpn: 5,
                                default: 24
                            },{
                                label: "Fine",
                                key: t.a.osc.b.fine,
                                min: 0,
                                max: 100,
                                values: toString(R.range(-50, 51)),
                                nrpn: 6,
                                default: 50
                            },{
                                label: "Shape",
                                key: t.a.osc.b.shape,
                                min: 0,
                                max: 103,
                                values: WaveForms,
                                nrpn: 7,
                                default: 1
                            },{
                                label: 'Track',
                                key: t.a.osc.b.track,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                nrpn: 9,
                                default: 1
                            },{
                                label: "Sub",
                                key: t.a.osc.b.sub,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 115,
                                default: 0
                            },{
                                label: "Glide",
                                key: t.a.osc.b.glide,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 8,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "Common",
                        controls: [
                            {
                                label: "Sync",
                                key: t.a.osc.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                nrpn: 10,
                                default: 0
                            },
                            {
                                label: "Glide",
                                key: t.a.osc.glide,
                                min: 0,
                                max: 3,
                                values: ['Rate', 'Rate auto', 'Time', 'Time auto'],
                                nrpn: 11,
                                default: 0
                            },
                            {
                                label: "Slop",
                                key: t.a.osc.slop,
                                min: 0,
                                max: 5,
                                values: toString(R.range(0, 6)),
                                nrpn: 12,
                                default: 0
                            },
                            {
                                label: "Bend",
                                key: t.a.osc.bend,
                                min: 0,
                                max: 12,
                                values: toString(R.range(0, 13)),
                                nrpn: 93,
                                default: 2
                            },
                            {
                                label: "Mix",
                                key: t.a.osc.mix,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 13,
                                default: 0
                            },
                            {
                                label: "Noise",
                                key: t.a.osc.noise,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 14,
                                default: 0
                            },
                            {
                                label: "Fdb Vol",
                                key: t.a.osc.feedback.volume,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 116,
                                default: 0
                            },
                            {
                                label: "Fdb Gain",
                                key: t.a.osc.feedback.gain,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 110,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "Misc",
                        controls: [
                            {
                                label: "Unison",
                                key: t.a.osc.unison.on,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 99 
                            },
                            {
                                label: "Uni Mode",
                                key: t.a.osc.unison.priority,
                                min: 0,
                                max: 5,
                                values: ['Low', 'Low retrig', 'High', 'High retrig', 'Last', 'Last retrig'],
                                default: 0,
                                nrpn: 96 
                            },
                            {
                                label: "Uni Prio",
                                key: t.a.osc.unison.mode,
                                min: 0,
                                max: 4,
                                values: ['One', 'All', 'Detune 1', 'Detune 2', 'Detune 3'],
                                default: 0,
                                nrpn: 95 
                            },
                            {
                                label: "Psh key",
                                key: t.a.bits.push.note,
                                min: 0,
                                max: 120,
                                values: FreqValues,
                                default: 24,
                                nrpn: 111
                            },
                            {
                                label: "Psh Velo",
                                key: t.a.bits.push.velo,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                default: 24,
                                nrpn: 112
                            },
                            {
                                label: "Psh Mode",
                                key: t.a.bits.push.mode,
                                min: 0,
                                max: 1,
                                values: ['Normal', 'Toggle'],
                                default: 0,
                                nrpn: 113
                            }
                        ]
                    },
                    {
                        name: "Seq",
                        controls: [
                            {
                                label: "Arp",
                                key: t.a.bits.arp.on,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 100
                            },
                            {
                                label: "Arp Mode",
                                key: t.a.bits.arp.mode,
                                min: 0,
                                max: 14,
                                values: ARP_MODES,
                                default: 0,
                                nrpn: 97
                            },
                            {
                                label: "Clock",
                                key: t.a.bits.arp.clock,
                                min: 0,
                                max: 12,
                                values: CLOCK_DIVIDE,
                                default: 0,
                                nrpn: 92
                            },
                            {
                                label: "BPM",
                                key: t.a.bits.arp.bpm,
                                min: 0,
                                max: 220,
                                values: toString(R.range(0, 221)),
                                default: 0,
                                nrpn: 91
                            },

                            
                        ]
                    }

                ]
            },
            {
                width: 6,
                height: 2,
                tabs: [
                    {
                        name: "LPF",
                        controls: [
                            {
                                label: "Freq",
                                key: t.a.lpf.freq,
                                min: 0,
                                max: 164,
                                values: toString(R.range(0, 165)),
                                nrpn: 15,
                                default: 164
                            },
                            {
                                label: "Reso",
                                key: t.a.lpf.reso,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 16,
                                default: 0
                            },
                            {
                                label: "Key",
                                key: t.a.lpf.key,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 17,
                                default: 0
                            },
                            {
                                label: "Aud X",
                                key: t.a.lpf.mod,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 18,
                                default: 0
                            },
                            {
                                label: "Poles",
                                key: t.a.lpf.poles,
                                min: 0,
                                max: 1,
                                values: ["2-pole", "4-pole"],
                                nrpn: 19,
                                default: 0
                            },
                            ENV_AMOUNT("Env", t.a.lpf.env.amount, 20),
                            {
                                label: "Velo",
                                key: t.a.lpf.env.velo,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 21,
                                default: 0
                            },
                            {
                                label: "Delay",
                                key: t.a.lpf.env.delay,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 22,
                                default: 0
                            },
                            {
                                label: "Attack",
                                key: t.a.lpf.env.attack,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 23,
                                default: 0
                            },
                            {
                                label: "Decay",
                                key: t.a.lpf.env.decay,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 24,
                                default: 0
                            },
                            {
                                label: "Sustain",
                                key: t.a.lpf.env.delay,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 25,
                                default: 127
                            },
                            {
                                label: "Release",
                                key: t.a.lpf.env.release,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 26,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "VCA",
                        controls: [
                            SEVEN_BIT_CONTROL("Init", t.a.amp.initial, 0, 27),
                            SEVEN_BIT_CONTROL("Spread", t.a.amp.spread, 0, 28),
                            SEVEN_BIT_CONTROL("Vol", t.a.amp.volume, 127, 29),
                            ENV_AMOUNT("Env", t.a.amp.env.amount, 30),
                            SEVEN_BIT_CONTROL("Velo", t.a.amp.env.velo, 0, 31),
                            SEVEN_BIT_CONTROL("Delay", t.a.amp.env.delay, 0, 32),
                            SEVEN_BIT_CONTROL("Attack", t.a.amp.env.attack, 0, 33),
                            SEVEN_BIT_CONTROL("Decay", t.a.amp.env.decay, 0, 34),
                            SEVEN_BIT_CONTROL("Sustain", t.a.amp.env.sustain, 127, 35),
                            SEVEN_BIT_CONTROL("Release", t.a.amp.env.release, 0, 36), 
                        ]
                    },
                    {
                        name: "Env3",
                        controls: [
                            {
                                label: "Dest",
                                key: t.a.env3.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 57
                            },
                            {
                                label: "Repeat",
                                key: t.a.env3.repeat,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 98
                            },
                            ENV_AMOUNT("Env", t.a.env3.env.amount, 58),
                            SEVEN_BIT_CONTROL("Velo", t.a.env3.env.velo, 0, 59),
                            SEVEN_BIT_CONTROL("Delay", t.a.env3.env.delay, 0, 60),
                            SEVEN_BIT_CONTROL("Attack", t.a.env3.env.attack, 0, 61),
                            SEVEN_BIT_CONTROL("Decay", t.a.env3.env.decay, 0, 62),
                            SEVEN_BIT_CONTROL("Sustain", t.a.env3.env.sustain, 127, 63),
                            SEVEN_BIT_CONTROL("Release", t.a.env3.env.release, 0, 64),
                        ]
                    },
                ]
            },
            {
                height: 2,
                width: 3,
                tabs: [
                    {
                        name: "LFO 1",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.a.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 37
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.a.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 38
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.a.amount, 0, 39),
                            {
                                label: 'Dest',
                                key: t.a.lfo.a.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 40
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.a.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 41
                            }
                        ]
                    },
                    {
                        name: "LFO 2",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.b.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 37
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.b.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 38
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.b.amount, 0, 39),
                            {
                                label: 'Dest',
                                key: t.a.lfo.b.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 40
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.b.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 41
                            }
                        ]
                    },
                    {
                        name: "LFO 3",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.c.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 37
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.c.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 38
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.c.amount, 0, 39),
                            {
                                label: 'Dest',
                                key: t.a.lfo.c.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 40
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.c.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 41
                            }
                        ]
                    },
                    {
                        name: "LFO 4",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.d.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 37
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.d.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 38
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.d.amount, 0, 39),
                            {
                                label: 'Dest',
                                key: t.a.lfo.d.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 40
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.d.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 41
                            }
                        ]
                    }
                ]
            },
            {
                height: 1,
                width: 3,
                tabs: [
                    {
                        name: "MOD1",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.a.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 65
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.a.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 66
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.a.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 67
                            }
                        ]
                    },
                    {
                        name: "MOD2",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.b.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 68
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.b.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 69
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.b.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 70
                            }
                        ]
                    },
                    {
                        name: "MOD3",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.c.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 71
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.c.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 72
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.c.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 73
                            }
                        ]
                    },
                    {
                        name: "MOD4",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.d.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 74
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.d.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 75
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.d.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 76
                            }
                        ]
                    },
                ]
            },
            {
                height: 1,
                width: 3,
                tabs: [
                    {
                        name: "Wheel",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.wheel.amount, 81),
                            DESTINATION("Dest", t.a.mod.wheel.destination, 82)
                        ]
                    },
                    {
                        name: "Press",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.pressure.amount, 83),
                            DESTINATION("Dest", t.a.mod.pressure.destination, 84)
                        ]
                    },
                    {
                        name: "Breath",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.breath.amount, 85),
                            DESTINATION("Dest", t.a.mod.breath.destination, 86)
                        ]
                    },
                    {
                        name: "Velo",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.velo.amount, 87),
                            DESTINATION("Dest", t.a.mod.velo.destination, 88)
                        ]
                    },
                    {
                        name: "Foot",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.foot.amount, 89),
                            DESTINATION("Dest", t.a.mod.foot.destination, 90)
                        ]
                    }
                ]
            }
        ]
    }
]

export {
    TetraRemote
};
export type { IRemote, ICategory as Category, ITab as Tab, IControl, ILayer as Layer};
