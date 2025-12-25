export type Grid = {
    cols: number,
    rows: number,
    size: number,
    angle: number,
};

export type Cell = {
    row: number,
    col: number,
    sprite: string | null,
    disabled: boolean
};

export type Scene = {
    background: string,
    cells: Cell[],
    grid: Grid
};