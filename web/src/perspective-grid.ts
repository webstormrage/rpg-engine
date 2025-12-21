import {
    Container,
    Graphics,
    Point,
    Sprite,
    Texture,
    FederatedPointerEvent,
} from 'pixi.js'

type PerspectiveGridOptions = {
    rows: number
    cols: number
    cell: number
    angle: number
    cameraDistance: number
    npcTexture?: Texture
    strokeColor?: number
    fillColor?: number
    lineWidth?: number
}

export function createPerspectiveGrid({
                                          rows,
                                          cols,
                                          cell,
                                          angle,
                                          cameraDistance,
                                          npcTexture,
                                          strokeColor = 0x00ffaa,
                                          fillColor = 0x00ffaa,
                                          lineWidth = 1,
                                      }: PerspectiveGridOptions) {
    const container = new Container()

    // локальная система координат
    const cx = 0
    const cy = 0

    // перспектива
    function project(x: number, y: number, z: number) {
        const scale = 1 / (1 + z / cameraDistance)
        return new Point(x * scale + cx, y * scale + cy)
    }

    // 3D → 2D (как в эталонном canvas-примере)
    function transform(x: number, z: number) {
        const X = x * cell
        const Z = z * cell

        const Yr = -Z * Math.sin(angle)
        const Zr =  Z * Math.cos(angle)

        return project(X, Yr, Zr)
    }

    function distance(a: Point, b: Point) {
        return Math.hypot(b.x - a.x, b.y - a.y)
    }

    function midpoint(a: Point, b: Point) {
        return new Point(
            (a.x + b.x) / 2,
            (a.y + b.y) / 2
        )
    }

    // ===== CELLS =====
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            // координаты клетки в сетке
            const x0 = col - cols / 2
            const x1 = col + 1 - cols / 2

            const z0 = rows - row
            const z1 = rows - (row + 1)

            // 4 угла трапеции
            const p00 = transform(x0, z0)
            const p10 = transform(x1, z0)
            const p11 = transform(x1, z1)
            const p01 = transform(x0, z1)

            const cellGfx = new Graphics()
            let selected = false
            let npcSprite: Sprite | null = null

            function redraw() {
                cellGfx.clear()

                cellGfx
                    .moveTo(p00.x, p00.y)
                    .lineTo(p10.x, p10.y)
                    .lineTo(p11.x, p11.y)
                    .lineTo(p01.x, p01.y)
                    .closePath()
                    // fill обязателен для hit-test
                    .fill({
                        color: fillColor,
                        alpha: 0
                        // alpha: selected ? 0.25 : 0,
                    })
                    .stroke({
                        width: selected ? 0 : lineWidth,
                        color: strokeColor,
                    })
            }

            redraw()

            cellGfx.eventMode = 'static'
            cellGfx.cursor = 'pointer'

            cellGfx.on('pointerdown', (e: FederatedPointerEvent) => {
                const isRightClick =
                    e.buttons === 2 ||
                    e.nativeEvent?.button === 2

                // ===== RIGHT CLICK → TOGGLE NPC =====
                if (isRightClick && npcTexture) {

                    // 🔴 если NPC уже есть → удалить
                    if (npcSprite) {
                        npcSprite.destroy()
                        npcSprite = null
                        return
                    }

                    // 🟢 если NPC нет → создать
                    const bottomWidth = distance(p01, p11)
                    const bottomMid = midpoint(p01, p11)

                    const npc = new Sprite(npcTexture)
                    npc.anchor.set(0.5, 1)

                    const scale = bottomWidth / npcTexture.width
                    npc.scale.set(scale)

                    npc.position.copyFrom(bottomMid)

                    container.addChild(npc)
                    npcSprite = npc

                    return
                }

                // ===== LEFT CLICK → TOGGLE CELL =====
                if (e.button === 0) {
                    selected = !selected
                    redraw()
                }
            })


            container.addChild(cellGfx)
        }
    }

    return container
}
