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

export const MODE_CONFIG: Record<string, {
    index: number,
    Color0: [number, number, number],
    Color1: [number, number, number],
    Color: [number, number, number],
    ColorNight: [number, number, number],
    ColorTiles: [number, number, number],
    progressDance: number,
    timescale: number,
    colorTop: [number, number, number],
    colorBottom: [number, number, number],
}> = {
    meebit: {
        index: 0,
        Color0: (hexToRGB("#171445")),
        Color1: (hexToRGB("#3433a5")),
        Color: (hexToRGB("#b8bcfc")),
        ColorNight: (hexToRGB("#5567F5")),
        ColorTiles: (hexToRGB("#3a3cb2")),
        progressDance: 1,
        timescale: 0.5,
        colorTop: (hexToRGB("#e0e1ef")),
        colorBottom: (hexToRGB("#b8bcfc")),
    },
    pride: {
        index: 1,
        Color0: (hexToRGB("#171445")),
        Color1: (hexToRGB("#3433a5")),
        Color: (hexToRGB("#ffb83e")),
        ColorNight: (hexToRGB("#fdc25b")),
        ColorTiles: (hexToRGB("#fdc25b")),
        progressDance: 1,
        timescale: 0.5,
        colorTop: (hexToRGB("#ff6dfb")),
        colorBottom: (hexToRGB("#670bff")),
    },
    zen: {
        index: 2,
        Color0: (hexToRGB("#006db6")),
        Color1: (hexToRGB("#5daee5")),
        Color: (hexToRGB("#65bffb")),
        ColorNight: (hexToRGB("#fdc25b")),
        ColorTiles: (hexToRGB("#ffffff")),
        progressDance: 1,
        timescale: 0.5,
        colorTop: (hexToRGB("#f5fbff")),
        colorBottom: (hexToRGB("#7db8df")),
    },
    heated: {
        index: 3,
        Color0: (hexToRGB("#2c19cc")),
        Color1: (hexToRGB("#df212c")),
        Color: (hexToRGB("#f11926")),
        ColorNight: (hexToRGB("#fdc25b")),
        ColorTiles: (hexToRGB("#ffffff")),
        progressDance: 1,
        timescale: 0.5,
        colorTop: (hexToRGB("#f8f3f4")),
        colorBottom: (hexToRGB("#e5888d")),
    },
}

export const MODES = Object.keys(MODE_CONFIG)

export const DEFAULT_MODE = MODES[2]

export const TEXT_SPACE = 0.2

const wordsConfig = {
    "!Meebin_top": { value: "#e0e1ef", params: {} },
    "!Meebin_bottom": { value: "#b8bcfc", params: {} },
    Shy_top: { value: "#ead2ff", params: {} },
    Shy_bottom: { value: "#b58dd5", params: {} },
    Swoon_top: { value: "#efe9ea", params: {} },
    Swoon_bottom: { value: "#e9adeb", params: {} },
    GM_top: { value: "#fff8f3", params: {} },
    GM_bottom: { value: "#efc5ab", params: {} },
    Nope_top: { value: "#fff8f0", params: {} },
    Nope_bottom: { value: "#ddb181", params: {} },
    Chill_top: { value: "#f5fbff", params: {} },
    Chill_bottom: { value: "#7db8df", params: {} },
    Spicy_top: { value: "#fff6eb", params: {} },
    Spicy_bottom: { value: "#fb7c3e", params: {} },
    GN_top: { value: "#e7e1f8", params: {} },
    GN_bottom: { value: "#567be2", params: {} },
    Heated_top: { value: "#f8f3f4", params: {} },
    Heated_bottom: { value: "#e5888d", params: {} },
    Zoomin_top: { value: "#f5f8f6", params: {} },
    Zoomin_bottom: { value: "#6cd880", params: {} },
    Dazed_top: { value: "#e8d8e6", params: {} },
    Dazed_bottom: { value: "#bf6f9c", params: {} },
    Buzzed_top: { value: "#e8d8e6", params: {} },
    Buzzed_bottom: { value: "#bf6f9c", params: {} },
    Ded_top: { value: "#dbe0e8", params: {} },
    Ded_bottom: { value: "#9fb1cf", params: {} },
    Hype_top: { value: "#fbf8f3", params: {} },
    Hype_bottom: { value: "#eba371", params: {} },
    Pride_top: { value: "#ff6dfb", params: {} },
    Pride_bottom: { value: "#670bff", params: {} },
};

// applyMoodSettings(moodId) {
//     switch (moodId) {
//       case "buzzed":
//         if (this.scene.post) this.scene.post.config.DrunkPower.value = 1;
//         break;

//       case "heated":
//         // this.scene.post.config.HeatMapPower.value = 1
//         this.scene.skybox.config.Color0.value = "#2c19cc";
//         this.scene.skybox.config.Color1.value = "#df212c";
//         this.scene.ground.config.Color.value = "#f11926";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "spicy":
//         this.scene.skybox.config.Color0.value = "#ffa216";
//         this.scene.skybox.config.Color1.value = "#ea6920";
//         this.scene.ground.config.Color.value = "#eb9019";
//         this.scene.ground.config.ColorTiles.value = "#E71818";
//         this.scene.particles.config.color.value = "#FFA216";
//         this.scene.particles.config.color1.value = "#E71818";

//         if (this.scene.post) this.scene.post.config.HeatPower.value = 1;
//         break;

//       case "gm":
//         this.scene.skybox.config.Color0.value = "#518aff";
//         this.scene.skybox.config.Color1.value = "#ffb371";
//         this.scene.ground.config.Color.value = "#ff8336";
//         this.scene.ground.config.ColorTiles.value = "#A3B5E4";
//         break;

//       case "gn":
//         this.scene.skybox.config.Color0.value = "#521543";
//         this.scene.skybox.config.Color1.value = "#112b6f";
//         this.scene.ground.config.Color.value = "#274bac";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "zen":
//         this.scene.skybox.config.Color0.value = "#006db6";
//         this.scene.skybox.config.Color1.value = "#5daee5";
//         this.scene.ground.config.Color.value = "#65bffb";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "swoon":
//         this.scene.skybox.config.Color0.value = "#ff2c60";
//         this.scene.skybox.config.Color1.value = "#d9a4db";
//         this.scene.ground.config.Color.value = "#c69bc8";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "ded":
//         this.scene.skybox.config.Color0.value = "#22344f";
//         this.scene.skybox.config.Color1.value = "#6e88b2";
//         this.scene.ground.config.Color.value = "#7493c2";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "shy":
//         this.scene.skybox.config.Color0.value = "#8022CA";
//         this.scene.skybox.config.Color1.value = "#bb9ad5";
//         this.scene.ground.config.Color.value = "#c5b3dc";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "wtf":
//         this.scene.skybox.config.Color0.value = "#08869f";
//         this.scene.skybox.config.Color1.value = "#1dd55e";
//         this.scene.ground.config.Color.value = "#5bf879";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         if (this.scene.post) this.scene.post.config.ShakePower.value = 1;
//         break;

//       case "meebin":
//         this.scene.skybox.config.Color0.value = "#171445";
//         this.scene.skybox.config.Color1.value = "#3433a5";
//         this.scene.ground.config.Color.value = "#b8bcfc";
//         this.scene.ground.config.ColorNight.value = "#5567F5";
//         this.scene.ground.config.ColorTiles.value = "#3a3cb2";
//         this.scene.ground.progressDance = 1;
//         this.scene.ground.timescale = 0.5;
//         break;

//       case "nope":
//         this.scene.skybox.config.Color0.value = "#5e2c19";
//         this.scene.skybox.config.Color1.value = "#ddb181";
//         this.scene.ground.config.Color.value = "#ddb181";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;

//       case "hype":
//         this.scene.skybox.config.Color0.value = "#f54304";
//         this.scene.skybox.config.Color1.value = "#f2ac33";
//         this.scene.ground.config.Color.value = "#ffb83e";
//         this.scene.ground.config.ColorTiles.value = "#fdc25b";
//         break;

//       case "pride":
//         this.scene.ground.config.Color.value = "#ffb83e";
//         this.scene.ground.config.ColorTiles.value = "#fdc25b";
//         this.scene.ground.progressDance = 1;
//         this.scene.ground.timescale = 0.5;
//         break;

//       default:
//         this.scene.skybox.config.Color0.value = "#607c91";
//         this.scene.skybox.config.Color1.value = "#6a899d";
//         this.scene.ground.config.Color.value = "#597485";
//         this.scene.ground.config.ColorTiles.value = "#ffffff";
//         break;
//     }
//   }