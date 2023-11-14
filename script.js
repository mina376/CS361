const todoValue = document.getElementById("js-todo-ttl");
const todoRegister = document.getElementById("js-register-btn");
const todoList = document.getElementById("js-todo-list");
const doneList = document.getElementById("js-done-list");

window.addEventListener('load', () => {
  fetch('/todos')
    .then(response => response.json())
    .then(data => {
      data.todos.forEach(todoData => {
        createTodoElement(todoData.text, todoData.isDone);
      });
      data.done.forEach(todoData => {
        createTodoElement(todoData.text, todoData.isDone);
      });
    });
});

todoRegister.addEventListener('click', () => {
    const todoText = todoValue.value;
    if (todoText.length > 0) {
      fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: todoText })
      })
        .then(response => response.json())
        .then(todoData => {
          createTodoElement(todoData.text, false);
          todoValue.value = '';
        });
    }
  });

function createTodoElement(text, isDone) {
    const liTag = document.createElement('li');
    const pTag = document.createElement('p');
    pTag.appendChild(document.createTextNode(text));
    liTag.appendChild(pTag);
    todoList.appendChild(liTag);
  
    const btnBox = document.createElement('div');
    btnBox.setAttribute('class', 'btn-box');
    liTag.appendChild(btnBox);
  
    const doneBtn = document.createElement('button');
    doneBtn.setAttribute('id', 'js-done-btn');
    doneBtn.innerHTML = 'Done';
    btnBox.appendChild(doneBtn);
  
    const delBtn = document.createElement('button');
    delBtn.setAttribute('id', 'js-del-btn');
    delBtn.innerHTML = 'Remove';
    btnBox.appendChild(delBtn);
  
    delBtn.addEventListener('click', () => {
      deleteTodoElement(liTag);
    });
  
    doneBtn.addEventListener('click', () => {
      markTodoAsDone(liTag);
    });
  
    if (isDone) {
      markTodoAsDone(liTag);
    }
  }
  
  function deleteTodoElement(todoElement) {
    const delConfirm = confirm('Do you really want to delete?');
    if (delConfirm) {
      todoElement.remove();
    }
  }
  
  function markTodoAsDone(todoElement) {
    todoElement.setAttribute('class', 'done-item');
    doneList.appendChild(todoElement);
    const doneBtn = todoElement.querySelector('#js-done-btn');
    doneBtn.remove();
  }
  
todoList.addEventListener('click', (event) => {
  const target = event.target;
  if (target.id === 'js-del-btn') {
    const todoElement = target.parentElement;
    const index = Array.from(todoList.children).indexOf(todoElement);
    
    fetch('/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ index })
    })
      .then(response => response.json())
      .then(deletedTodo => {
        todoElement.remove();
      });
  }
});

todoList.addEventListener('click', (event) => {
  const target = event.target;
  if (target.id === 'js-done-btn') {
    const todoElement = target.parentElement;
    const index = Array.from(todoList.children).indexOf(todoElement);

    fetch('/done', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ index })
    })
      .then(response => response.json())
      .then(doneTodo => {
        markTodoAsDone(todoElement);
      });
  }
});
