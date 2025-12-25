import {
    Container,
    Graphics,
    Sprite,
    FederatedPointerEvent, type ContainerChild,
} from 'pixi.js'
import { transform, midpoint, distance } from "./utils.ts";
import {scaleFactor, sprites} from "./assets.ts";
import type {Scene} from "./scene.ts";
import {emit, on, name, off} from "./bridge.ts";
import type {Cell, Grid} from "./cells.ts";

const GRID_COLOR = 0x00ffaa;

type RenderContext = {
    grid: Grid,
    cellGfx: Graphics,
    npcSprite:Sprite|null,
    container: Container<ContainerChild>
};

function renderCell(cell: Cell, ctx: RenderContext) {
    const { grid, cellGfx, container } = ctx;
    const x0 = cell.col - grid.cols / 2
    const x1 = cell.col + 1 - grid.cols / 2

    const z0 = grid.rows - cell.row
    const z1 = grid.rows - (cell.row + 1)

    const p00 = transform(x0, z0, grid)
    const p10 = transform(x1, z0, grid)
    const p11 = transform(x1, z1, grid)
    const p01 = transform(x0, z1, grid)
    // GRID
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

    // SPRITE
    if (ctx.npcSprite && !cell.sprite) {
        ctx.npcSprite.destroy()
        ctx.npcSprite = null
    }

    if (!ctx.npcSprite && cell.sprite) {
        const texture = sprites[cell.sprite]

        const bottomWidth = distance(p01, p11)
        const bottomMid = midpoint(p01, p11)

        ctx.npcSprite = new Sprite(texture)
        ctx.npcSprite.anchor.set(0.5, 1)

        const scale = bottomWidth / texture.width
        ctx.npcSprite.scale.set(scale * scaleFactor[cell.sprite])
        ctx.npcSprite.position.copyFrom(bottomMid)

        container.addChild(ctx.npcSprite)
    }
}

// TODO - это создание мира (без бекграунда) а не сетки
export function createPerspectiveGrid(scene: Scene) {
    const container = new Container();
    const {cells, grid} = scene;

    cells.forEach((cell) => {
        const ctx: RenderContext = {
            grid,
            container,
            cellGfx: new Graphics(),
            npcSprite: null,
        };

        const { cellGfx } = ctx;
        renderCell(cell,ctx);

        cellGfx.eventMode = 'static';
        cellGfx.cursor = 'pointer';

        cellGfx.on('pointerdown', (e: FederatedPointerEvent) => {
            if (e.button !== 0) {
                return;
            }

            emit('cell.click', cell);
        });

        const render = (cell: Cell) => renderCell(cell, ctx);

        on(name('cell.update', cell.col, cell.row), render);

        cellGfx.on('destroyed', () => {
            off(render);
        });

        container.addChild(cellGfx);
    });


    return container;
}
