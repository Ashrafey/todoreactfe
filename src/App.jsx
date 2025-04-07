import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Alert,
  Fade,
} from 'react-bootstrap';
import {
  faPlus,
  faEdit,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const API_URL = 'https://totoreactbe.onrender.com/todos';

  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const fetchTodos = () => {
    axios
      .get(API_URL)
      .then((res) => setTodos(res.data))
      .catch(() => showAlert('Failed to fetch todos from server.', 'danger'));
  };

  const resetForm = () => {
    setTask('');
    setDate('');
    setTime('');
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = { task, date, time };

    if (isEditing) {
      axios
        .put(`${API_URL}/${currentId}`, newTodo)
        .then(() => {
          fetchTodos();
          showAlert('Todo updated successfully!', 'success');
          resetForm();
        })
        .catch(() => showAlert('Failed to update todo.', 'danger'));
    } else {
      axios
        .post(API_URL, newTodo)
        .then((res) => {
          setTodos([...todos, res.data]);
          showAlert('Todo added successfully!', 'success');
          resetForm();
        })
        .catch(() => showAlert('Failed to add todo. Server error.', 'danger'));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
        showAlert('Todo deleted!', 'danger');
      })
      .catch(() => showAlert('Failed to delete todo.', 'danger'));
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setDate(todo.date);
    setTime(todo.time);
    setIsEditing(true);
    setCurrentId(todo.id);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'bg-dark text-light min-vh-100' : 'bg-light text-dark min-vh-100'}>
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} className="mb-4">
        <Container className="justify-content-between">
          <Nav className="mx-auto">
            <Navbar.Brand className="fs-3 fw-bold">Todo List</Navbar.Brand>
          </Nav>
          <Button variant={darkMode ? 'light' : 'dark'} onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </Button>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <Fade in={alert.show}>
          <div>
            {alert.show && (
              <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                {alert.message}
              </Alert>
            )}
          </div>
        </Fade>

        <Form onSubmit={handleSubmit} className="mb-4">
          <Row className="g-2 align-items-end">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter your task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Col>
            <Col md={2}>
              <Button type="submit" variant={isEditing ? 'warning' : 'primary'} className="w-100">
                <FontAwesomeIcon icon={isEditing ? faEdit : faPlus} /> {isEditing ? 'Update' : 'Add'}
              </Button>
            </Col>
          </Row>
        </Form>

        <Row className="gy-3">
          {todos.map((todo) => (
            <Col md={6} key={todo.id}>
              <Card bg={darkMode ? 'secondary' : 'light'} text={darkMode ? 'light' : 'dark'}>
                <Card.Body>
                  <Card.Title>{todo.task}</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong> {todo.date}
                    <br />
                    <strong>Time:</strong> {todo.time}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="warning" onClick={() => handleEdit(todo)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(todo.id)}>Delete</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default App;
