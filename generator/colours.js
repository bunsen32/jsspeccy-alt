import { stdout } from 'process';

const colours = [
    // RGBA dark
    0x000000ff,
    0x2030c0ff,
    0xc04010ff,
    0xc040c0ff,
    0x40b010ff,
    0x50c0b0ff,
    0xe0c010ff,
    0xc0c0c0ff,
    // RGBA bright
    0x000000ff,
    0x3040ffff,
    0xff4030ff,
    0xff70f0ff,
    0x50e010ff,
    0x50e0ffff,
    0xffe850ff,
    0xffffffff
];

function scale_from_255_to(l, x) {
    const scaled = Math.round((x * (l+1) / 256))
    return Math.min(Math.max(0, scaled), l)
}

function rgba32_to_grb8(rgba) {
    const red = (rgba >> 24) & 0xff
    const green = (rgba >> 16) & 0xff
    const blue = (rgba >> 8) & 0xff

    const g3 = scale_from_255_to(7, green)
    const r3 = scale_from_255_to(7, red)
    const b2 = scale_from_255_to(3, blue)

    return (g3 << 5) | (r3 << 2) | (b2 << 0)
}

function hex8(byte) {
    const s = byte.toString(16)
    return (s.length == 1) ? '0'+s : s
}
/*
stdout.write('[');
let addComma = false;
for(const rgba of colours) {
    if (addComma) stdout.write(', ')
    const byte = rgba32_to_grb8(rgba)
    stdout.write('0x' + hex8(byte))
    addComma = true;
}
stdout.write('];\n')
*/

stdout.write(`${(7 << 29).toString(16)}\n`)

const standardPalette = [0x00, 0x47, 0x58, 0x5b, 0xc8, 0xcf, 0xdc, 0xdb, 0x00, 0x4b, 0x5d, 0x9f, 0xec, 0xef, 0xfd, 0xff];
for(const grb of standardPalette) {
    stdout.write(`${grb.toString(16)} => ${rgbaFromGrb8(grb).toString(16)}\n`)
}

 function   rgbaFromGrb8(grb8) {
        const g3 = (grb8 >> 5) & 7;
        const r3 = (grb8 >> 2) & 7;
        const b2 = (grb8 >> 0) & 3;
        const b3 = (b2 << 1) + (b2 === 0 ? 0 : 1)

        stdout.write(`${r3} ${g3} ${r3}\r`)
        return (
            (((r3 << 21) | (r3 << 18) | (r3 << 15)) & 0xff0000) |
            (((g3 << 13) | (g3 << 10) | (g3 << 7)) & 0x00ff00) |
            (((b3 << 5) | (b3 << 2) | (b3 >>> 1)) & 0x0000ff)) * 256 + 255;
    }