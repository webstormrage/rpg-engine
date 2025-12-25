import {Image, Select} from "antd";
import type {SelectProps} from "antd";
import {previews} from "../../assets.ts";
import { type FC } from "react";
import styles from './sprite-controls.module.css';
import {emit} from "../../bridge.ts";
import type {Tool} from "../../tools.ts";

const options:SelectProps['options'] = Object.keys(previews).map(name => ({
    value: name,
    label: name
}));

type Props = {
    tool: Tool;
}

export const SpriteControls:FC<Props> = ({ tool }) => {
    const sprite = tool.type === 'sprite' ? tool.name : '';
    const src = tool.type === 'sprite' ? previews[tool.name] : '';
    const handleChange = (val: string) => {
        emit('tool.update', { type: 'sprite', name: val });
    };
    return (<div className={styles.flex}>
        <Select options={options} onChange={handleChange} value={sprite} style={{width: 150}} />
        <Image src={src} height='50px' />
    </div>)
}