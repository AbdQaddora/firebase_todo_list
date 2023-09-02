import { useEffect, useState } from "react"
import { Button, Checkbox, Form, Input, Modal, Popconfirm, Select, Typography, message } from "antd"
import { useForm } from "antd/es/form/Form"
// icons
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// style
import './styles.css';
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import DB from "../../../firebase";
const TodoCard = ({ todo, onChange }) => {
    const [isEditModalOpend, setIsEditModalOpend] = useState();
    const [isDeleteConfirmOpend, setIsDeleteConfirmOpend] = useState();
    const [docRef, setDocRef] = useState();
    const [form] = useForm();

    useEffect(() => {
        form.setFieldsValue({ ...todo })
        setDocRef(doc(DB, 'todos', todo.id))
    }, [todo])

    const handelEditTodo = (values) => {
        updateDoc(docRef, {
            ...values,
            group: todo.group,
            isChecked: todo.isChecked,
        })
        onChange();
        setIsEditModalOpend(false);
    }

    const handelCheckChange = (value) => {
        updateDoc(docRef, {
            description: todo.description,
            periorty: todo.periorty,
            title: todo.title,
            group: todo.group,
            isChecked: value,
        })
        onChange();
        setIsEditModalOpend(false);
    }

    const handelDeleteTodo = () => {
        deleteDoc(docRef)
            .then(() => message.success("Todo deleted successfully"))
        onChange();
    }

    return (
        <>
            <Modal
                open={isEditModalOpend}
                title={"Edit Todo"}
                onCancel={() => {
                    setIsEditModalOpend(false);
                    form.setFieldsValue({ ...todo })
                }}
                onOk={() => {
                    form.validateFields()
                        .then(handelEditTodo)
                }}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item
                        label={"Todo title"}
                        name="title"
                        rules={[{ required: true, message: "Todo title is required" }]}
                    >
                        <Input placeholder='Todo title' />
                    </Form.Item>
                    <Form.Item
                        label={"Todo title"}
                        name="periorty"
                        rules={[{ required: true, message: "Todo periorty is required" }]}
                    >
                        <Select placeholder='Todo periorty'
                            options={[
                                { label: "High", value: "High" },
                                { label: "Medium", value: "Medium" },
                                { label: "Low", value: "Low" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Todo description"}
                        name="description"
                    >
                        <Input.TextArea
                            placeholder='todo description'
                            rows={5}
                        />
                    </Form.Item>
                </Form>
            </Modal >
            <div className={`todo_card ${todo.periorty.toLowerCase()}`}>
                <Typography.Title className="todo_title" level={5}>{todo.title}</Typography.Title>
                <div className="todo_card_actions">
                    <Checkbox
                        defaultChecked={todo.isChecked}
                        onChange={e => handelCheckChange(e.target.checked)}
                    />
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => { setIsEditModalOpend(true) }}
                    />
                    <Popconfirm
                        title="Delete the todo"
                        description="Are you sure to delete this todo?"
                        open={isDeleteConfirmOpend}
                        onOpenChange={() => setIsDeleteConfirmOpend(prev => !prev)}
                        onConfirm={handelDeleteTodo}
                        onCancel={() => setIsDeleteConfirmOpend(false)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => { setIsDeleteConfirmOpend(true) }}
                        />
                    </Popconfirm>
                </div>
            </div >
        </>
    )
}

export default TodoCard