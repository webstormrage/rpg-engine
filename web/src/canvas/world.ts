import {type Application, Container} from "pixi.js";
import {BASE_HEIGHT, BASE_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants.ts";


export const renderWorld = (app: Application) => {
    const world = new Container()
    app.stage.addChild(world)
    const scale = Math.min(
        CANVAS_WIDTH / BASE_WIDTH,
        CANVAS_HEIGHT / BASE_HEIGHT
    );
    world.scale.set(scale);
    return world;
};