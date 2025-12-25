export type Grid = {
    cols: number,
    rows: number,
    size: number,
    angle: number,
};

export type Cell = {
    row: number,
    col: number,
    sprite: string|null,
    disabled: boolean
};

export const createCells = (rows: number, cols: number) => {
    const cells:Cell[] = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            cells.push({
                row,
                col,
                sprite: null,
                disabled: false,
            });
        }
    }
    return cells;
}
