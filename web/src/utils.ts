import {Point} from "pixi.js";
import {type Grid} from "./cells.ts";

function project(x: number, y: number, z: number) {
    const scale = 1 / (1 + z / 10)
    return new Point(x * scale, y * scale)
}

export function transform(x: number, z: number, grid: Grid) {
    const X = x * grid.size
    const Z = z * grid.size

    const Yr = -Z * Math.sin(grid.angle)
    const Zr =  Z * Math.cos(grid.angle)

    return project(X, Yr, Zr)
}

export function distance(a: Point, b: Point) {
    return Math.hypot(b.x - a.x, b.y - a.y)
}

export function midpoint(a: Point, b: Point) {
    return new Point(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2
    )
}

/*export function getCellScale(cell: Cell) {
    const x0 = cell.col - cell.grid.cols / 2
    const x1 = cell.col + 1 - cell.grid.cols / 2

    const z1 = cell.grid.rows - (cell.row + 1)

    const p11 = transform(x1, z1, cell.grid)
    const p01 = transform(x0, z1, cell.grid)
    return distance(p01, p11)
}

export function getCellAnchor(cell: Cell) {
    const x0 = cell.col - cell.grid.cols / 2;
    const x1 = cell.col + 1 - cell.grid.cols / 2;

    const z1 = cell.grid.rows - (cell.row + 1);

    const p11 = transform(x1, z1, cell.grid);
    const p01 = transform(x0, z1, cell.grid);

    return midpoint(p01, p11);
}*/