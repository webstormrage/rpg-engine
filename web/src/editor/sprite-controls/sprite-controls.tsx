import {Image, Select} from "antd";
import type {SelectProps} from "antd";
import {previews} from "../../assets.ts";
import {useState} from "react";
import styles from './sprite-controls.module.css';
import {getTool, setTool} from "../../tools.ts";

const options:SelectProps['options'] = [
    {
        value: 'merchant',
        label: 'merchant'
    }
]

export const SpriteControls = () => {
    const [value, setValue] = useState<string|null>(getTool().name);
    const handleChange = (val: string) => {
        setValue(val);
        setTool({ type: 'sprite', name: val});
    };
    return (<div className={styles.flex}>
        <Select options={options} onChange={handleChange} value={value} style={{width: 150}}/>
        <Image src={previews[value]} height='50px' />
    </div>)
}