import './style.css'
import { Application, Assets, Container, Sprite } from 'pixi.js'
import { createPerspectiveGrid } from './perspective-grid'

const keys:Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true
})

window.addEventListener('keyup', (e) => {
    keys[e.key] = false
})

const CAMERA_SPEED = 10 // px за кадр

async function main() {
    const app = new Application()

    await app.init({
        resizeTo: window,
        backgroundAlpha: 1,
    })

    document.body.appendChild(app.canvas)

    // отключаем контекстное меню (ПКМ)
    app.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })

    // ===== WORLD (общая система координат) =====
    const world = new Container()
    app.stage.addChild(world)

    // ===== ASSETS =====
    const bgTexture = await Assets.load('/tavern.png')
    const npcTexture = await Assets.load('/merchant.png')

    // ===== BACKGROUND =====
    const bg = new Sprite(bgTexture)
    world.addChild(bg)

    // ===== GRID =====
    const grid = createPerspectiveGrid({
        rows: 6,
        cols: 10,
        cell: 250,
        angle: Math.PI * 0.493,
        cameraDistance: 10,
        npcTexture,
    })
    world.addChild(grid)

    // логическое разрешение
    const BASE_WIDTH = 1280
    const BASE_HEIGHT = 720

    function resizeWorld() {
        const scale = Math.min(
            app.screen.width / BASE_WIDTH,
            app.screen.height / BASE_HEIGHT
        )

        world.scale.set(scale)

        // background (логические координаты)
        const bgScale = BASE_WIDTH / bgTexture.width
        bg.scale.set(bgScale)
        bg.x = 0
        bg.y = BASE_HEIGHT - bg.height

        // grid
        grid.x = BASE_WIDTH / 2
        grid.y = BASE_HEIGHT// - 40
    }

    resizeWorld()
    window.addEventListener('resize', resizeWorld)
    //@ts-ignore
    window.world = world;

    app.ticker.add(() => {
        if (keys['ArrowLeft'])  world.x += CAMERA_SPEED
        if (keys['ArrowRight']) world.x -= CAMERA_SPEED
        if (keys['ArrowUp'])    world.y += CAMERA_SPEED
        if (keys['ArrowDown'])  world.y -= CAMERA_SPEED
    })
}

main()
