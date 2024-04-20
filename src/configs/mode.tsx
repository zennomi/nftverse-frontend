// const MOODS = [
//     "buzzed",
//     "heated",
//     "spicy",
//     "gm",
//     "gn",
//     "zen",
//     "swoon",
//     "meebit",
//     "ded",
//     "shy",
//     "wtf",
//     "nope",
//     "hype",
//     "pride",
//   ];

import { hexToRGB } from "../utils/color"
import * as THREE from "three"

export const MODE_CONFIG: Record<string, Record<string, string | number | [number, number, number]>> = {
    meebit: {
        Color0: (hexToRGB("#171445")),
        Color1: (hexToRGB("#3433a5")),
        Color: (hexToRGB("#b8bcfc")),
        ColorNight: (hexToRGB("#5567F5")),
        ColorTiles: (hexToRGB("#3a3cb2")),
        progressDance: 1,
        timescale: 0.5
    },
    pride: {
        Color0: (hexToRGB("#171445")),
        Color1: (hexToRGB("#3433a5")),
        Color: (hexToRGB("#ffb83e")),
        ColorNight: (hexToRGB("#fdc25b")),
        ColorTiles: (hexToRGB("#fdc25b")),
        progressDance: 1,
        timescale: 0.5
    },
    zen: {
        Color0: (hexToRGB("#006db6")),
        Color1: (hexToRGB("#5daee5")),
        Color: (hexToRGB("#65bffb")),
        ColorNight: (hexToRGB("#fdc25b")),
        ColorTiles: (hexToRGB("#ffffff")),
        progressDance: 1,
        timescale: 0.5
    },
}

export const MODES = Object.keys(MODE_CONFIG)

export const DEFAULT_MODE = MODES[2]