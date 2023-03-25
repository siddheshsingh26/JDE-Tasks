import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// icons from react icons kit
// main Icon component
import { Icon } from "react-icons-kit";

// icons themselves
import { plus } from "react-icons-kit/feather/plus";
import { edit2 } from "react-icons-kit/feather/edit2";
import { trash } from "react-icons-kit/feather/trash";
import { fireEvent } from "@testing-library/react";
import { useRef } from "react";

// getting todos from local storage
const getTodosFromLS = () => {
  const data = localStorage.getItem("Todos");
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const Form = () => {
  // todo value state
  const [todoValue, setTodoValue] = useState("");
  const [description, setDescriptipn] = useState("");
  const [duedate, setDuedate] = useState(new Date());

  // todos array of objects
  const [todos, setTodos] = useState(getTodosFromLS());

  // console.log(todos);

  // form submit event
  const handleSubmit = (e) => {
    e.preventDefault();

    // creating a unique ID for every todo
    const date = new Date();
    // const some = date.getDate() + "/" + date.getMonth() + "/" + date.getYear();
    const time = date.getTime();
    // end of creating a ID
    console.log(
      date.getHours() +
        1 +
        ":" +
        (date.getMinutes() + 1) +
        ":" +
        (date.getSeconds() + 1)
    );
    // creating a todo object
    let todoObject = {
      ID: time,
      TodoValue: todoValue,
      Description: description,
      completed: false,
      Date:
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
      Time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
      DueDate: duedate,
    };
    // end of creating a todo object
    setTodos([...todos, todoObject]);
    setSortedTodos([...sortedTodos, todoObject]);

    setTodoValue("");
    setDescriptipn("");
    setDuedate(null);
  };

  // saving data to local storage
  useEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos));
  }, [todos]);

  // delete todo
  const handleDelete = (id) => {
    // console.log(id);
    const filtered = todos.filter((todo) => {
      return todo.ID !== id;
    });
    setTodos(filtered);
    setSortedTodos(filtered);
  };

  // edit form
  const [editForm, setEditForm] = useState(false);

  // id state
  const [id, setId] = useState();

  // edit todo
  const handleEdit = (todo, index) => {
    setEditForm(true);
    setTodoValue(todo.TodoValue);
    setDuedate(todo.DueDate);
    setDescriptipn(todo.Description);
    setId(index);
  };

  // edit todo submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // copying todos state in items variable
    let items = [...todos];
    // storing the element at a particular index in item variable
    let item = items[id];
    // manipulating the item (object) keys
    item.TodoValue = todoValue;
    item.DueDate = duedate;
    item.Description = description;
    item.completed = false;
    // after manipulating item, saving it at the same index in items
    items[id] = item;
    // updating todos with items
    setTodos(items);

    setEditForm(false);
    setTodoValue("");
    setDuedate(null);
    setDescriptipn("");
  };

  // handle checkbox
  const handleCheckbox = (id) => {
    let todoArray = [];
    todos.forEach((todo) => {
      if (todo.ID === id) {
        if (todo.completed === false) {
          todo.completed = true;
        } else if (todo.completed === true) {
          todo.completed = false;
        }
      }
      todoArray.push(todo);
      // console.log(todoArray);
      setTodos(todoArray);
    });
  };
  // Filter completed todos
  const completedTodos = todos.filter(
    (todo) => todo.completed && todo.TodoValue[0]
  );

  // Filter incomplete todos
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  // Concatenate incomplete todos and completed todos
  const [sortedTodos, setSortedTodos] = useState(
    incompleteTodos.concat(completedTodos)
  );
  const divRef = useRef(null);

  const handleScroll = (e) => {
    const div = divRef.current;
    div.scrollTop += e.deltaY;
  };

  return (
    <>
      {/* form component */}
      {editForm === false && (
        <div className="form">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="input-and-button">
              <input
                type="text"
                placeholder="Add Task"
                required
                onChange={(e) => setTodoValue(e.target.value)}
                value={todoValue}
              />
              <hr />
              <input
                type="text"
                placeholder="Description"
                required
                onChange={(e) => setDescriptipn(e.target.value)}
                value={description}
              />
              <hr />
              <DatePicker
                onChange={(date) => setDuedate(date.toLocaleString())}
                placeholderText="Due Date"
                dateFormat="yyyy-MM-dd"
              />
              <div className="button">
                <button type="submit">
                  <Icon icon={plus} size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* end of form component */}

      {/* edit form component */}
      {editForm === true && (
        <div className="form">
          <form autoComplete="off" onSubmit={handleEditSubmit}>
            <div className="input-and-button">
              <div>
                <input
                  type="text"
                  placeholder="Edit your Item"
                  required
                  onChange={(e) => setTodoValue(e.target.value)}
                  value={todoValue}
                />
              </div>
              <hr />
              <div>
                <input
                  type="text"
                  placeholder="Add Description"
                  required
                  onChange={(e) => setDescriptipn(e.target.value)}
                  value={description}
                />
              </div>
              <hr />
              <div>
                <DatePicker
                  onChange={(date) => setDuedate(date.toLocaleString())}
                  placeholderText="Due Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="button edit">
                <button type="submit">UPDATE</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* end of edit form component */}

      {/* start of rendering todos depending on
          if we have length of todos greater than 0 */}

      {sortedTodos.length > 0 && (
        <>
          <div
            ref={divRef}
            onWheel={handleScroll}
            style={{ overflow: "hidden", height: "480px" }}
          >
            {sortedTodos.map((individualTodo, index) => (
              <div className="todo" key={individualTodo.ID}>
                <div>
                  {/* we dont need to show checkbox when edit
                      button is clicked */}
                  {editForm === false && (
                    <input
                      type="checkbox"
                      checked={individualTodo.completed}
                      onChange={() => handleCheckbox(individualTodo.ID)}
                      className="statusbox"
                    />
                  )}
                  <div>
                    <span
                      style={
                        individualTodo.completed === true
                          ? { textDecoration: "line-through" }
                          : { textDecoration: "none" }
                      }
                    >
                      Date : {individualTodo.Date} Time : {individualTodo.Time}
                    </span>
                    <hr />
                    <span
                      style={
                        individualTodo.completed === true
                          ? { textDecoration: "line-through" }
                          : { textDecoration: "none" }
                      }
                    >
                      Task_Name : {individualTodo.TodoValue}
                    </span>
                    <hr />
                    <span
                      style={
                        individualTodo.completed === true
                          ? { textDecoration: "line-through" }
                          : { textDecoration: "none" }
                      }
                    >
                      Description : {individualTodo.Description}
                    </span>
                  </div>
                  <hr />
                  <span
                    style={
                      individualTodo.completed === true
                        ? { textDecoration: "line-through" }
                        : { textDecoration: "none" }
                    }
                  >
                    DueDate : {individualTodo.DueDate}
                  </span>
                </div>

                {/* we dont need to show edit and delete icons when edit
                  button is clicked */}
                {editForm === false && (
                  <div className="edit-and-delete">
                    <div
                      style={{ marginRight: 7 + "px" }}
                      onClick={() => handleEdit(individualTodo, index)}
                    >
                      <Icon icon={edit2} size={25} />
                    </div>
                    <div onClick={() => handleDelete(individualTodo.ID)}>
                      <Icon icon={trash} size={25} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* delete all todos */}
          {editForm === false && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="delete-all"
                onClick={() => setTodos([]) && setSortedTodos([])}
              >
                Delete All Items
              </button>
            </div>
          )}
        </>
      )}
      {/* end of rendering todos depending on
          if we have length of todos greater than 0 */}
    </>
  );
};
