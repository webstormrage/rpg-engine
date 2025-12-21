import { Container, Graphics, Point } from 'pixi.js'

type PerspectiveGridOptions = {
    gridSize: number
    cell: number
    angle: number
    cameraDistance: number
    strokeColor?: number
    fillColor?: number
    lineWidth?: number
}

export function createPerspectiveGrid({
                                          gridSize,
                                          cell,
                                          angle,
                                          cameraDistance,
                                          strokeColor = 0x00ffaa,
                                          fillColor = 0x00ffaa,
                                          lineWidth = 1,
                                      }: PerspectiveGridOptions) {
    const container = new Container()

    // локальный якорь (контейнер потом смещается)
    const cx = 0
    const cy = 0

    // перспектива
    function project(x: number, y: number, z: number) {
        const scale = 1 / (1 + z / cameraDistance)
        return new Point(
            x * scale + cx,
            y * scale + cy
        )
    }

    // 3D → 2D (один в один с твоим примером)
    function transform(x: number, z: number) {
        const X = x * cell
        const Z = z * cell

        const Yr = -Z * Math.sin(angle)
        const Zr =  Z * Math.cos(angle)

        return project(X, Yr, Zr)
    }

    function distance(a: Point, b: Point) {
        return Math.hypot(b.x - a.x, b.y - a.y)
    }

    function midpoint(a: Point, b: Point) {
        return new Point(
            (a.x + b.x) / 2,
            (a.y + b.y) / 2
        )
    }

    // создаём ячейки
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {

            // углы трапеции
            const p00 = transform(col - gridSize / 2,     gridSize - row)
            const p10 = transform(col + 1 - gridSize / 2, gridSize - row)
            const p11 = transform(col + 1 - gridSize / 2, gridSize - (row + 1))
            const p01 = transform(col - gridSize / 2,     gridSize - (row + 1))

            const cellGfx = new Graphics()
            let selected = false

            function redraw() {
                cellGfx.clear()

                cellGfx
                    .moveTo(p00.x, p00.y)
                    .lineTo(p10.x, p10.y)
                    .lineTo(p11.x, p11.y)
                    .lineTo(p01.x, p01.y)
                    .closePath()
                    // fill ОБЯЗАТЕЛЕН для hit-test
                    .fill({
                        color: fillColor,
                        alpha: selected ? 0.25 : 0,
                    })
                    .stroke({
                        width: lineWidth,
                        color: strokeColor,
                    })
            }

            redraw()

            cellGfx.eventMode = 'static'
            cellGfx.cursor = 'pointer'

            cellGfx.on('pointerdown', () => {
                selected = !selected
                redraw()

                // НИЖНЯЯ (наибольшая) горизонтальная сторона
                const bottomWidth = distance(p01, p11)
                const bottomMidLocal = midpoint(p01, p11)
                const bottomMidGlobal = container.toGlobal(bottomMidLocal)

                console.log(
                    `row: ${row}, col: ${col}`,
                    `bottomWidth: ${bottomWidth.toFixed(2)}`,
                    `mid: (${bottomMidGlobal.x.toFixed(2)}, ${bottomMidGlobal.y.toFixed(2)})`
                )
            })

            container.addChild(cellGfx)
        }
    }

    return container
}
