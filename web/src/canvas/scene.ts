import {Application, Assets, Container, Sprite} from 'pixi.js'
import {renderDecorations} from './decorations.ts'
import {on} from "../bridge/bridge.ts";
import type {Scene} from "../types/types.ts";
import { CANVAS_HEIGHT, CANVAS_WIDTH, BASE_WIDTH, BASE_HEIGHT} from "./constants.ts";
import {initControls} from "./controls.ts";

export async function renderScene(scene: Scene) {
    /* ================== CANVAS ================== */
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

    /* ================== WORLD ================== */
    const world = new Container()
    app.stage.addChild(world)
    const scale = Math.min(
        CANVAS_WIDTH / BASE_WIDTH,
        CANVAS_HEIGHT / BASE_HEIGHT
    );
    world.scale.set(scale);

    /* ================== BACKGROUND ================== */
    const bgTexture = await Assets.load(scene.background);
    const bg = new Sprite(bgTexture);
    world.addChild(bg);
    const bgScale = BASE_WIDTH / bgTexture.width;
    bg.scale.set(bgScale);
    bg.x = 0;
    bg.y = BASE_HEIGHT - bg.height;

    /* ================== DECORATIONS ================== */
    let decorations = renderDecorations(scene, { container: world });
    const render = function (scene: Scene) {
        decorations.destroy();
        decorations = renderDecorations(scene, { container: world });
    };
    on('on.scene.update', render);

    /* ================== CONTROLS ================== */
    initControls(app, world);
}