import './style.css'
import {Application, Assets, Container, Sprite} from 'pixi.js'
import { createPerspectiveGrid } from './perspective-grid'
import { createCells } from "./cells.ts";
import {getAngle, getCols, getRows, getSize} from "./tools.ts";
import ReactDOM from 'react-dom/client'
import {Editor} from "./editor/editor.tsx";

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

async function main() {
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
    const bgTexture = await Assets.load('/tavern.png')

    /* ================== BACKGROUND ================== */
    const bg = new Sprite(bgTexture)
    world.addChild(bg)

    const cells = createCells(getRows(), getCols(), getSize(), Math.PI * getAngle());
    let grid = createPerspectiveGrid(cells);
    world.addChild(grid)


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
        grid.x = BASE_WIDTH / 2
        grid.y = BASE_HEIGHT
    }

    const recalculateGrid = function(){
        grid.destroy();
        const cells = createCells(getRows(), getCols(), getSize(), Math.PI * getAngle());
        grid = createPerspectiveGrid(cells);
        world.addChild(grid)
        grid.x = BASE_WIDTH / 2
        grid.y = BASE_HEIGHT
    };
    document.addEventListener('recalculate-grid', recalculateGrid);

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

main()


ReactDOM.createRoot(
    document.getElementById('sidebar')!
).render(
     <Editor />
)