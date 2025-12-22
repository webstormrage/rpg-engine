import {
    Container,
    Graphics,
    Sprite,
    Texture,
    FederatedPointerEvent, Assets,
} from 'pixi.js'
import { transform, midpoint, distance } from "./utils.ts";
import { getTool } from "./tools.ts";
import {type Cell} from "./cells.ts";

const sprites:Record<string, Texture> = {
    merchant: await Assets.load('/merchant.png')
};

type PerspectiveGridOptions = {
    cells: Cell[],
    cellSize: number
    angle: number
}

const GRID_COLOR = 0x00ffaa;

export function createPerspectiveGrid({
                                          cells,
                                          cellSize,
                                          angle,
                                      }: PerspectiveGridOptions) {
    const container = new Container()

    cells.forEach((cell) => {
        const x0 = cell.col - cell.grid.cols / 2
        const x1 = cell.col + 1 - cell.grid.cols / 2

        const z0 = cell.grid.rows - cell.row
        const z1 = cell.grid.rows - (cell.row + 1)

        // 4 угла трапеции
        const p00 = transform(x0, z0, angle, cellSize)
        const p10 = transform(x1, z0, angle, cellSize)
        const p11 = transform(x1, z1, angle, cellSize)
        const p01 = transform(x0, z1, angle, cellSize)

        const cellGfx = new Graphics()

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
                    alpha: cell.disabled ? 0 : 0.1,
                })
                .stroke({
                    width: cell.disabled ? 0 : 1,
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
                if (cell.sprite) {
                    cell.sprite.destroy()
                    cell.sprite = null
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
                cell.sprite = npc

                return
            }

            if (tool.type === 'grid') {
                cell.disabled = !cell.disabled
                redraw()
            }
        })

        container.addChild(cellGfx)
    });
    return container
}
