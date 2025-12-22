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