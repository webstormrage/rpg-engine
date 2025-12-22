import type { Sprite } from "pixi.js";

export type Cell = {
    row: number,
    col: number,
    grid: {
        cols: number,
        rows: number,
    },
    sprite: Sprite|null,
    disabled: boolean
};

export const createCells = (rows: number, cols: number) => {
    const cells:Cell[] = [];
    const grid = {
        cols,
        rows
    }
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