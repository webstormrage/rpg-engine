import {renderDecorations} from './decorations.ts'
import {on} from "../bridge/bridge.ts";
import type {Scene} from "../types/types.ts";
import {initControls} from "./controls.ts";
import {renderBackground} from "./background.ts";
import {initApp} from "./app.ts";
import {renderWorld} from "./world.ts";

export async function renderScene(scene: Scene) {
    /* ================== CANVAS ================== */
    const app = await initApp();

    const world = renderWorld(app);

    await renderBackground(scene, { container: world });


    let decorations = renderDecorations(scene, { container: world });
    const renderD = function (scene: Scene) {
        decorations.destroy();
        decorations = renderDecorations(scene, { container: world });
    };
    on('on.scene.update', renderD);


    initControls(app, world);
}