import type {Cell, Grid} from "../types/types.ts";
import {ColorMatrixFilter, Container, type ContainerChild, Graphics, Sprite} from "pixi.js";
import {distance, midpoint, transform} from "./utils.ts";
import {brightnessFactor, scaleFactor, sprites} from "../assets/assets.ts";

const GRID_COLOR = 0x00ffaa;

export type CellRenderContext = {
    grid: Grid,
    cellGfx: Graphics,
    npcSprite:Sprite|null,
    container: Container<ContainerChild>
};

export function renderCell(cell: Cell, ctx: CellRenderContext) {
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
        const texture = sprites[cell.sprite];

        const bottomWidth = distance(p01, p11)
        const bottomMid = midpoint(p01, p11);

        ctx.npcSprite = new Sprite(texture);
        ctx.npcSprite.anchor.set(0.5, 1);

        const scale = bottomWidth / texture.width;
        ctx.npcSprite.scale.set(scale * scaleFactor[cell.sprite]);
        const colorMatrix = new ColorMatrixFilter();
        ctx.npcSprite.filters = [colorMatrix];
        colorMatrix.brightness(brightnessFactor[cell.sprite], false);
        ctx.npcSprite.position.copyFrom(bottomMid);
        ctx.npcSprite.zIndex = cell.row;

        container.addChild(ctx.npcSprite)
    }
}