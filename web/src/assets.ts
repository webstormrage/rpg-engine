import {Assets, Texture} from "pixi.js";

export const previews:Record<string,string> = {
    merchant: '/merchant.png'
};

export const sprites:Record<string, Texture> = {
    merchant: await Assets.load('/merchant.png')
};

