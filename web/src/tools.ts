import type {Scene} from "./scene.ts";
import {type Cell, createCells, type Grid} from "./cells.ts";
import {emit, name, on} from "./bridge.ts";

export type Tool = {
    type: 'grid'
} | {
    type: 'sprite',
    name: string
}

let tool:Tool = {
    type: 'grid'
};

export const initTool = () => {
    emit('on.tool.init', tool);
};

on('tool.update', (source: Tool) => {
    tool = source;
    emit('on.tool.update', tool);
});


const scene:Scene = {
    background: '/tavern.png',
    grid: {
        cols: 10,
        rows: 6,
        angle: 1.536,
        size: 150
    },
    cells: createCells(6, 10),
};

on('grid.update', (source: Partial<Grid>) => {
    const {
        cols=scene.grid.cols,
        rows=scene.grid.rows,
        angle=scene.grid.angle,
        size=scene.grid.size
    } = source;
    scene.grid.cols = cols;
    scene.grid.rows = rows;
    scene.grid.angle = angle;
    scene.grid.size = size;
    scene.cells =  createCells(rows, cols);
    emit('on.scene.update', scene);
});

on('cell.click', (source: Cell) => {
    const target = scene.cells.find(c => c.col === source.col && c.row === source.row);
    if(!target) {
        return;
    }
    if(tool.type === 'grid'){
        target.disabled = !target.disabled;
    } else if(tool.type === 'sprite') {
        if(target.sprite != null){
            target.sprite = null;
        } else {
            target.sprite = tool.name;
        }
    }
    emit(name('cell.update', target.col, target.row), target);
});


export const initScene = () => {
    emit('on.scene.init', scene);
};
