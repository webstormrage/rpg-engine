import {
    Container,
    Graphics,
    Sprite,
    Texture,
    FederatedPointerEvent, Assets,
} from 'pixi.js'
import { transform, midpoint, distance } from "./utils.ts";
import {getTool} from "./tools.ts";

const sprites:Record<string, Texture> = {
    merchant: await Assets.load('/merchant.png')
};

type PerspectiveGridOptions = {
    rows: number
    cols: number
    cell: number
    angle: number
}

const GRID_COLOR = 0x00ffaa;

export function createPerspectiveGrid({
                                          rows,
                                          cols,
                                          cell,
                                          angle,
                                      }: PerspectiveGridOptions) {
    const container = new Container()

    // ===== CELLS =====
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            // координаты клетки в сетке
            const x0 = col - cols / 2
            const x1 = col + 1 - cols / 2

            const z0 = rows - row
            const z1 = rows - (row + 1)

            // 4 угла трапеции
            const p00 = transform(x0, z0, angle, cell)
            const p10 = transform(x1, z0, angle, cell)
            const p11 = transform(x1, z1, angle, cell)
            const p01 = transform(x0, z1, angle, cell)

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
                    .fill({
                        color: GRID_COLOR,
                        alpha: 0
                        // alpha: selected ? 0.25 : 0,
                    })
                    .stroke({
                        width: selected ? 0 : 1,
                        color: GRID_COLOR,
                    })
            }

            redraw()

            cellGfx.eventMode = 'static'
            cellGfx.cursor = 'pointer'

            cellGfx.on('pointerdown', (e: FederatedPointerEvent) => {
                if (e.button !== 0) {
                    return;
                }
                const tool = getTool();

                if (tool.type == 'sprite') {
                    const texture = sprites[tool.name]
                    if (npcSprite) {
                        npcSprite.destroy()
                        npcSprite = null
                        return
                    }

                    const bottomWidth = distance(p01, p11)
                    const bottomMid = midpoint(p01, p11)

                    const npc = new Sprite(texture)
                    npc.anchor.set(0.5, 1)

                    const scale = bottomWidth / texture.width
                    npc.scale.set(scale)

                    npc.position.copyFrom(bottomMid)

                    container.addChild(npc)
                    npcSprite = npc

                    return
                }

                if (tool.type === 'grid') {
                    selected = !selected
                    redraw()
                }
            })

            container.addChild(cellGfx)
        }
    }

    return container
}
