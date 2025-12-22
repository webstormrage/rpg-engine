import {Point} from "pixi.js";

function project(x: number, y: number, z: number) {
    const scale = 1 / (1 + z / 10)
    return new Point(x * scale, y * scale)
}

export function transform(x: number, z: number, angle: number, cell: number) {
    const X = x * cell
    const Z = z * cell

    const Yr = -Z * Math.sin(angle)
    const Zr =  Z * Math.cos(angle)

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