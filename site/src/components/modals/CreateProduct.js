import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form } from "react-bootstrap";
import { Context } from "../../index";
import { createProduct, fetchCategory } from "../../http/productAPI";
import { observer } from "mobx-react-lite";

const CreateProduct = observer(({ show, onHide }) => {
    const { product } = useContext(Context)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState(null)

    useEffect(() => {
        fetchCategory().then(data => product.setCategory(data))
    }, [])

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addProduct = () => {
        const formData = new FormData()
        formData.append('title', `${title}`)
        formData.append('price', `${price}`)
        formData.append('image', file)
        createProduct(formData).then(data => onHide())
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить устройство
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{product.selectedCategory.name || "Выберите категорию"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.category.map(category =>
                                <Dropdown.Item
                                    onClick={() => product.setSelectedCategory(category)}
                                    key={category.id}
                                >
                                    {category.title}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название устройства"
                    />
                    <Form.Control
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость устройства"
                        type="number"
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addProduct}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;
