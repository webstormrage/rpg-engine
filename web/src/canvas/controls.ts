import {CAMERA_SPEED} from "./constants.ts";
import {type Application, type Renderer, type Container, type ContainerChild} from "pixi.js";

const keys: Record<string, boolean> = {}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false
});

export const initControls = (app:  Application<Renderer>, world:  Container<ContainerChild>) => {
    app.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    });
    app.ticker.add(() => {
        if (keys['ArrowLeft']) world.x += CAMERA_SPEED
        if (keys['ArrowRight']) world.x -= CAMERA_SPEED
        if (keys['ArrowUp']) world.y += CAMERA_SPEED
        if (keys['ArrowDown']) world.y -= CAMERA_SPEED
        if (keys['Backspace']) {
            world.x = 0;
            world.y = 0;
        }
    });
};