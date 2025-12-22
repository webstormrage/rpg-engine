import type { Sprite } from "pixi.js";

export type Grid = {
    cols: number,
    rows: number,
    size: number,
    angle: number,
};

export type Cell = {
    row: number,
    col: number,
    grid: Grid,
    sprite: Sprite|null,
    disabled: boolean
};

export const createCells = (rows: number, cols: number, size: number, angle: number) => {
    const cells:Cell[] = [];
    const grid = {
        cols,
        rows,
        size,
        angle,
    };
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            cells.push({
                row,
                col,
                sprite: null,
                disabled: false,
                grid
            });
        }
    }
    return cells;
}