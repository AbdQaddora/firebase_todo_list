import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { Menu, Modal, Input, Select, Form, Layout, message, FloatButton, Row, Col, Spin } from 'antd';
import { EditOutlined, PlusSquareOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
// style
import './styles.css'
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import TodoCard from './TodoCard';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { getCollection } from '../../firebase';
const Home = () => {
    const { logout, isLoggedIn, user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [isgroupsLoading, setIsGroupsLoading] = useState(true);
    const [activeGroup, setActiveGroup] = useState(null)

    const [todos, setTodos] = useState([]);
    const [isTodosLoading, setIsTodosLoading] = useState(true);

    const [isAddNewGroupModalOpen, setIsAddNewGroupModalOpen] = useState(false);
    const [isAddNewTodoModalOpen, setIsAddNewTodoModalOpen] = useState(false);
    const [addGroupForm] = useForm();
    const [addTodoForm] = useForm();

    useEffect(() => {
        setIsGroupsLoading(true)
        const q = query(getCollection("groups"), where("userId", "==", user.userId));
        getDocs(q)
            .then((QuerySnapshot) => {
                let temp = []
                QuerySnapshot.forEach((el) => {
                    temp.push({
                        id: el.id,
                        name: el.data().name
                    })

                })
                setActiveGroup(temp[0]?.id)
                setGroups(temp);
            }).finally(() => {
                setIsGroupsLoading(false)
            })
    }, [])

    const changeTodos = async () => {
        if (!activeGroup) return;

        const q = query(getCollection("todos"), where("group", "==", activeGroup));
        const docs = await getDocs(q);

        let tempTodos = [];
        docs.forEach((todo) => {
            tempTodos.push({ ...todo.data(), id: todo.id })
        })

        setTodos(tempTodos)
    }

    useEffect(() => {
        setIsTodosLoading(true);
        changeTodos()
        setIsTodosLoading(false);
    }, [activeGroup])

    // servicses
    const handelAddGroup = (group_name) => {
        addDoc(getCollection("groups"), {
            userId: user.userId,
            name: group_name
        }).then((res) => {
            setGroups(prev => ([...prev, { id: res.id, name: group_name }]))
            setIsAddNewGroupModalOpen(false);
        }).catch((err) => {
            message.error(err.message);
        })
    }

    const handelAddTodo = (todo) => {
        addDoc(getCollection("todos"), {
            ...todo,
            isChecked: false,
            group: activeGroup
        }).then((res) => {
            setTodos(prev => ([...prev, {
                id: res.id,
                ...{
                    ...todo,
                    isChecked: false,
                    group: activeGroup
                }
            }]))
            setIsAddNewTodoModalOpen(false);
        }).catch((err) => {
            message.error(err.message);
        })
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }

    if (isgroupsLoading) {
        return <Row align="middle" justify={"center"} style={{ height: "100dvh" }}>
            <Col>
                <Spin size='large' />
            </Col>
        </Row>
    }

    return (
        <>
            <Modal
                open={isAddNewGroupModalOpen}
                title={"Add new Group"}
                onCancel={() => {
                    setIsAddNewGroupModalOpen(false);
                    addGroupForm.resetFields();
                }}
                onOk={() => {
                    addGroupForm.validateFields()
                        .then((values) => {
                            handelAddGroup(values.group_name);
                            addGroupForm.resetFields();
                        })
                }}
            >
                <Form form={addGroupForm} layout='vertical'>
                    <Form.Item
                        label={"Group name"}
                        name="group_name"
                        rules={[{ required: true, message: "Group name is required" }]}
                    >
                        <Input placeholder='Group name' />
                    </Form.Item>
                </Form>
            </Modal >
            <Modal
                open={isAddNewTodoModalOpen}
                title={"Add new Todo"}
                onCancel={() => {
                    setIsAddNewTodoModalOpen(false);
                    addTodoForm.resetFields();
                }}
                onOk={() => {
                    addTodoForm.validateFields()
                        .then((values) => {
                            handelAddTodo(values)
                        })
                }}
            >
                <Form form={addTodoForm} layout='vertical'>
                    <Form.Item
                        label={"Todo title"}
                        name="title"
                        rules={[{ required: true, message: "Todo title is required" }]}
                    >
                        <Input placeholder='Todo name' />
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
                        <Input.TextArea placeholder='todo description' />
                    </Form.Item>
                </Form>
            </Modal >
            <Layout className='home_page'>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    <div className="demo-logo-vertical" />
                    <Menu
                        defaultSelectedKeys={[activeGroup]}
                        style={{ height: '100%' }}
                        theme="dark"
                        mode="inline"
                        items={[...groups.map((group) => ({
                            key: group.id,
                            icon: <EditOutlined />,
                            label: group.name,
                            onClick: () => setActiveGroup(group.id)
                        })),
                        {
                            key: String("add_new"),
                            icon: <PlusSquareOutlined />,
                            label: `Add new group`,
                            onClick: () => {
                                setIsAddNewGroupModalOpen(true)
                            }
                        },
                        {
                            key: String("logout"),
                            icon: <LogoutOutlined />,
                            label: `Logout`,
                            onClick: logout
                        }
                        ]
                        }
                    />
                </Sider>
                <Layout>
                    <Content style={{
                        margin: '24px 16px 0',
                    }}
                    >
                        {isTodosLoading ? <Row align="middle" justify={"center"} style={{ height: "100dvh" }}>
                            <Col>
                                <Spin size='large' />
                            </Col>
                        </Row> :
                            <div className='todos'>
                                {todos.map(todo => <TodoCard
                                    key={todo.id}
                                    todo={todo}
                                    onChange={changeTodos} />)}
                            </div>
                        }

                    </Content>
                </Layout>
            </Layout>
            <FloatButton
                type="primary"
                onClick={() => { setIsAddNewTodoModalOpen(true) }}
                icon={<PlusOutlined />}
                tooltip={<div>Add new note</div>} />
        </>
    )
}

export default Home