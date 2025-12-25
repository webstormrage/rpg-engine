import styles from './editor.module.css';
import {Card, Tabs, Input, Form, Button} from "antd";
import type { TabsProps } from 'antd';
import {SpriteControls} from "./sprite-controls/sprite-controls.tsx";
import {emit, on, off} from "../bridge.ts";
import {useEffect, useState} from "react";
import type {Tool} from "../tools.ts";
import type {Scene} from "../scene.ts";

const useTool = ():Tool|null => {
    const [tool, setTool] = useState<Tool|null>(null);
    useEffect(() => {
        on('on.tool.init', setTool);
        on('on.tool.update', setTool);
        return () => {
            off(setTool);
        };
    }, []);
    return tool;
};

const useScene = ():Scene|null => {
    const [scene, setScene] = useState<Scene|null>(null);
    useEffect(() => {
        on('on.scene.init', setScene);
        on('on.scene.update', setScene);
        return () => {
            off(setScene);
        };
    }, []);
    return scene;
};

export const Editor = () => {
    const [form] = Form.useForm();
    const tool = useTool();
    const scene = useScene();
    useEffect(() => {
        emit('on.ui.ready', {});
    }, []);
    const items: TabsProps['items'] = [
        {
            key: 'grid',
            label: 'Grid mode',
            children: null,
        },
        {
            key: 'sprite',
            label: 'Sprite mode',
            children: tool && <SpriteControls tool={tool} />,
        },
    ];
    const handleChange = (toolType: string) => {
        switch (toolType){
            case 'grid':
                emit('tool.update', { type: 'grid'});
                break;
            case 'sprite':
                emit('tool.update', { type: 'sprite', name: 'merchant'});
                break;
        }
    }
    const handleSubmit = (values: Record<string,number>) => {
        console.log(values);
        emit('grid.update', values);
    }
    if(!tool || !scene){
        return null;
    }
    return (
        <div className={styles.root}>
            <Card>
                <Tabs items={items} onChange={handleChange} activeKey={tool?.type} />
            </Card>
            <Card>
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{
                        cols: scene.grid.cols,
                        rows: scene.grid.rows,
                        size: scene.grid.size,
                        angle: scene.grid.angle
                    }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Cols" name="cols">
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item label="Rows" name="rows">
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item label="Size" name="size">
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item label="Angle" name="angle">
                        <Input type='number' step={0.001}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Recalculate grid</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}