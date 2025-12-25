import './style.css'
import {Application, Assets, Container, Sprite} from 'pixi.js'
import { createPerspectiveGrid } from './perspective-grid'
import ReactDOM from 'react-dom/client'
import {Editor} from "./editor/editor.tsx";
import {on} from "./bridge.ts";
import type {Scene} from "./scene.ts";
import {initScene, initTool} from "./tools.ts";

/* ================== INPUT ================== */
const keys: Record<string, boolean> = {}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true
})

window.addEventListener('keyup', (e) => {
    keys[e.key] = false
})

/* ================== CONSTANTS ================== */
const CAMERA_SPEED = 10

const CANVAS_WIDTH = 800*1.5
const CANVAS_HEIGHT = 533*1.5

// логическое разрешение мира
const BASE_WIDTH = 800
const BASE_HEIGHT = 533

on('on.scene.init', (scene: Scene ) => {
    main(scene);
});

async function main(scene: Scene) {
    const app = new Application()

    await app.init({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundAlpha: 1,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
    })

    const canvasWrapper = document.getElementById('canvas');
    canvasWrapper!.appendChild(app.canvas);

    // отключаем контекстное меню (ПКМ)
    app.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })

    /* ================== WORLD ================== */
    const world = new Container()
    app.stage.addChild(world)

    /* ================== ASSETS ================== */
    const bgTexture = await Assets.load(scene.background)

    /* ================== BACKGROUND ================== */
    const bg = new Sprite(bgTexture)
    world.addChild(bg)

    let content = createPerspectiveGrid(scene);
    world.addChild(content)


    function layoutWorld() {
        const scale = Math.min(
            CANVAS_WIDTH / BASE_WIDTH,
            CANVAS_HEIGHT / BASE_HEIGHT
        )

        world.scale.set(scale)

        // background (в логических координатах)
        const bgScale = BASE_WIDTH / bgTexture.width
        bg.scale.set(bgScale)
        bg.x = 0
        bg.y = BASE_HEIGHT - bg.height

        // grid position
        content.x = BASE_WIDTH / 2
        content.y = BASE_HEIGHT
    }

    const recalculateGrid = function(){
        content.destroy();
        content = createPerspectiveGrid(scene);
        world.addChild(content)
        content.x = BASE_WIDTH / 2
        content.y = BASE_HEIGHT
    };
    on('on.scene.update', recalculateGrid);

    layoutWorld()

    // для дебага
    // @ts-ignore
    window.world = world

    /* ================== UPDATE ================== */
    app.ticker.add(() => {
        if (keys['ArrowLeft'])  world.x += CAMERA_SPEED
        if (keys['ArrowRight']) world.x -= CAMERA_SPEED
        if (keys['ArrowUp'])    world.y += CAMERA_SPEED
        if (keys['ArrowDown'])  world.y -= CAMERA_SPEED
        if (keys['Backspace']) {
            world.x = 0;
            world.y = 0;
        }
    })
}


ReactDOM.createRoot(
    document.getElementById('sidebar')!
).render(
     <Editor />
);

on('on.ui.ready', () => {
    initScene();
    initTool();
});