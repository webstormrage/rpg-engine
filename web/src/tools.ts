type Tool = {
    type: 'grid'
} | {
    type: 'sprite',
    name: string
}

let currentTool:Tool = {
    type: 'grid'
};

export function getTool():Tool {
    return currentTool;
}

export function setTool(tool: Tool){
    currentTool = tool
}

let rows = 6;

export function getRows(){
    return rows;
}

export function setRows(r: number){
    rows = r;
}

let cols = 10;

export function getCols(){
    return cols;
}

export function setCols(c: number){
    cols = c;
}

let size = 150;

export function getSize(){
    return size;
}

export function setSize(s: number){
    size = s;
}

let angle = 0.489;

export function getAngle(){
    return angle;
}

export function setAngle(a: number){
    angle = a;
}

// @ts-ignore
window.setTool = setTool;
// @ts-ignore
window.setCols = setCols;
// @ts-ignore
window.setRows = setRows;
// @ts-ignore
window.setSize = setSize;
// @ts-ignore
window.setAngle = setAngle;