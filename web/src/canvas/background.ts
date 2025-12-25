import type {Scene} from "../types/types.ts";
import {Assets, Container, type ContainerChild, Sprite} from "pixi.js";
import {BASE_HEIGHT, BASE_WIDTH} from "./constants.ts";

export type DecorationsRenderContext = {
    container: Container<ContainerChild>
};

export const  renderBackground = async (scene: Scene, {container}: DecorationsRenderContext)=> {
    const bgTexture = await Assets.load(scene.background);
    const bg = new Sprite(bgTexture);
    container.addChild(bg);
    const bgScale = BASE_WIDTH / bgTexture.width;
    bg.scale.set(bgScale);
    bg.x = 0;
    bg.y = BASE_HEIGHT - bg.height;
    return bg;
}