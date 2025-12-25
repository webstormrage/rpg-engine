import {
    Container,
    Graphics,
    FederatedPointerEvent, type ContainerChild,
} from 'pixi.js'
import {emit, on, name, off} from "../bridge/bridge.ts";
import type {Cell,  Scene} from "../types/types.ts";
import {type CellRenderContext, renderCell} from "./cell.ts";
import {BASE_HEIGHT, BASE_WIDTH} from "./constants.ts";

export type DecorationsRenderContext = {
    container: Container<ContainerChild>
};

export function renderDecorations(scene: Scene, { container }: DecorationsRenderContext) {
    const root = new Container();
    root.sortableChildren = true;
    const {cells, grid} = scene;

    cells.forEach((cell) => {
        const ctx: CellRenderContext = {
            grid,
            container: root,
            cellGfx: new Graphics(),
            npcSprite: null,
        };

        const { cellGfx } = ctx;
        renderCell(cell, ctx);

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

        root.addChild(cellGfx);
    });


    container.addChild(root)
    root.x = BASE_WIDTH / 2
    root.y = BASE_HEIGHT
    return root;
}
