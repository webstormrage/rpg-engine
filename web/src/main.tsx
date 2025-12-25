import './style.css'
import ReactDOM from 'react-dom/client'
import {Editor} from "./editor/editor.tsx";
import {on} from "./bridge/bridge.ts";
import {initTool} from "./state/tool.ts";
import {initScene} from "./state/scene.ts";
import type {Scene} from "./types/types.ts";
import { renderScene } from './canvas/scene.ts'

ReactDOM.createRoot(
    document.getElementById('sidebar')!
).render(
    <Editor/>
);

on('on.scene.init', (scene: Scene) => {
    renderScene(scene);
});

on('on.ui.ready', () => {
    initScene();
    initTool();
});