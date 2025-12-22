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
// @ts-ignore
window.setTool = setTool;