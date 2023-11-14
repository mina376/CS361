const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const todoList = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/create', (req, res) => {
  const todoText = req.body.text;
  if (todoText) {
    const newTodo = { text: todoText, id: Date.now() };
    todoList.push(newTodo);
    res.status(201).json(newTodo);
  } else {
    res.status(400).json({ error: 'Text is required for a TODO item' });
  }
});

app.post('/update', (req, res) => {
  const todoId = req.body.id;
  const updatedText = req.body.text;
  
  const todoToUpdate = todoList.find((todo) => todo.id === todoId);
  if (todoToUpdate) {
    todoToUpdate.text = updatedText;
    res.json(todoToUpdate);
  } else {
    res.status(404).json({ error: 'TODO item not found' });
  }
});

app.post('/delete', (req, res) => {
  const todoId = req.body.id;
  const todoIndex = todoList.findIndex((todo) => todo.id === todoId);
  
  if (todoIndex !== -1) {
    const deletedTodo = todoList.splice(todoIndex, 1)[0];
    res.json(deletedTodo);
  } else {
    res.status(404).json({ error: 'TODO item not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
