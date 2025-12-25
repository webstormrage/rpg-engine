import {Assets, Texture} from "pixi.js";

export const scaleFactor:Record<string,number> = {
    merchantEnface: 1,
    merchantProfile: 0.95,
    merchantBack: 1.05,
    merchantLay: 2.05,
};
//@ts-ignore
window.scaleFactor = scaleFactor;

export const previews:Record<string,string> = {
    merchantEnface: '/merchant-enface.png',
    merchantProfile: '/merchant-profile.png',
    merchantBack: '/merchant-back.png',
    merchantLay: '/merchant-lay.png',
};

export const sprites:Record<string, Texture> = {
    merchantEnface: await Assets.load('/merchant-enface.png'),
    merchantProfile: await Assets.load('/merchant-profile.png'),
    merchantBack: await Assets.load('/merchant-back.png'),
    merchantLay: await Assets.load('/merchant-lay.png'),
};

