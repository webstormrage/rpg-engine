import {emit, on} from "../bridge/bridge.ts";

export type Tool = {
    type: 'grid'
} | {
    type: 'sprite',
    name: string
}

let tool:Tool = {
    type: 'grid'
};

export const getTool = () => {
    return tool;
}

export const initTool = () => {
    emit('on.tool.init', tool);
};

on('tool.update', (source: Tool) => {
    tool = source;
    emit('on.tool.update', tool);
});