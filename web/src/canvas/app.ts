import {Application} from "pixi.js";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants.ts";

export const initApp =  async () => {
    const app = new Application();
    await app.init({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundAlpha: 1,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
    });
    const canvasWrapper = document.getElementById('canvas');
    canvasWrapper!.appendChild(app.canvas);
    return app;
};