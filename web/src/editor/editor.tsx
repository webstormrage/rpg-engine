import styles from './editor.module.css';
import {Card, Tabs, Input, Form, Button} from "antd";
import type { TabsProps } from 'antd';
import {SpriteControls} from "./sprite-controls/sprite-controls.tsx";
import {getAngle, getCols, getRows, getSize, getTool, setAngle, setCols, setSize, setTool} from "../tools.ts";

export const Editor = () => {
    const [form] = Form.useForm();
    const items: TabsProps['items'] = [
        {
            key: 'grid',
            label: 'Grid mode',
            children: null,
        },
        {
            key: 'sprite',
            label: 'Sprite mode',
            children: <SpriteControls />,
        },
    ];
    const handleChange = (toolType: string) => {
        switch (toolType){
            case 'grid':
                setTool({ type: 'grid' });
                break;
            case 'sprite':
                setTool({ type: 'sprite', name: 'merchant'});
                break;
        }
    }
    const handleSubmit = (values: Record<string,number>) => {
        console.log(values);
        setAngle(values.angle);
        setCols(values.cols);
        setRows(values.rows);
        setSize(values.size);
        document.dispatchEvent(new Event('recalculate-grid', {bubbles: true}));
    }
    return (
        <div className={styles.root}>
            <Card>
                <Tabs items={items} onChange={handleChange} defaultActiveKey={getTool()?.type}/>
            </Card>
            <Card>
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{
                        cols: getCols(),
                        rows: getRows(),
                        size: getSize(),
                        angle: getAngle()
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
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Recalculate grid</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}