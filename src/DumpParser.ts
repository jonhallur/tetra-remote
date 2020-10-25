import * as R from 'ramda'
import {ProgramEditBufferObj, ProgramEditBufferPos} from './DataDefs'
let mapIndexed = R.addIndex(R.map)

function packBytes(chunk: number[]) {
    let packed = [];
    let head = R.head(chunk);
    let tail = R.tail(chunk);
    for(let i=0; i<7; i++) {
        let msbMask = 1 << i;
        let msbValue = head & msbMask;
        let lsb = tail[i] & 0x7F;
        packed[i] = (msbValue ? 128 : 0) + lsb;
    }
    return packed
}

function parseProgramEditBuffer(buff : number[]) {
    let relevant = R.drop(4, buff);
    let packOfBytes = R.splitEvery(8, relevant);
    let objects : Array<Object> = mapIndexed((params : Array<string>, index : number) => {
        let bytes = packOfBytes[index];
        let packed = packBytes(bytes);
        let obj = R.zipObj(params, packed)
        return obj
    }, ProgramEditBufferPos)
    let buffer = R.mergeAll(objects);
    return buffer;
}

export {parseProgramEditBuffer}