import {type Grid, type Cell } from "./cells.ts";


export type Scene = {
    background: string,
    cells: Cell[],
    grid: Grid
};