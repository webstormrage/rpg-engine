import './style.css'
import { Application, Assets, Sprite, Container } from 'pixi.js'
import { createPerspectiveGrid } from './perspective-grid'

async function main() {
    const app = new Application()

    await app.init({
        resizeTo: window,
        backgroundAlpha: 1,
    })

    document.body.appendChild(app.canvas)

    // 🌍 общий мир
    const world = new Container()
    app.stage.addChild(world)

    // ===== BACKGROUND =====
    const backgroundUrl =
        'https://i0.wp.com/therefinedgeek.com.au/wp-content/uploads/2012/09/Galaxy-on-Fire-2-PC-Version-Screenshot-Wallpaper-Space-Lounge.jpg?ssl=1'

    const texture = await Assets.load(backgroundUrl)
    const bg = new Sprite(texture)
    world.addChild(bg)

    // ===== GRID =====
    const grid = createPerspectiveGrid({
        gridSize: 10,
        cell: 125,
        angle: Math.PI * 0.49,
        cameraDistance: 10,
    })
    world.addChild(grid)

    // базовый размер (логический)
    const BASE_WIDTH = 1280
    const BASE_HEIGHT = 720

    function resizeWorld() {
        // единый scale
        const scale = Math.min(
            app.screen.width / BASE_WIDTH,
            app.screen.height / BASE_HEIGHT
        )

        world.scale.set(scale)

        // фон — ТОЛЬКО по ширине (логические координаты)
        const bgScale = BASE_WIDTH / texture.width
        bg.scale.set(bgScale)

        bg.x = 0
        bg.y = BASE_HEIGHT - bg.height

        // сетка
        grid.x = BASE_WIDTH / 2
        grid.y = BASE_HEIGHT - 25
    }

    resizeWorld()
    window.addEventListener('resize', resizeWorld)
}

main()
