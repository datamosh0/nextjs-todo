import React, { useEffect, useState } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "./todos.module.css";
import { useAuth } from "../../Hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FcCancel } from "react-icons/fc";
import { uuidv4 } from "@firebase/util";
import AddTodo from "./AddTodo";

const Todos = ({ passedTodos, listsObj, listShowing }: any) => {
  const [todosArr, setTodosArr] = useState<Todo[]>([]);
  const [initTodosArr, setInitTodosArr] = useState<Todo[]>([]);
  const [highlightAll, setHighlightAll] = useState<boolean>(false);
  const [highlightComplete, setHighlightComplete] = useState<boolean>(false);
  const [highlightUncomplete, setHighlightUncomplete] =
    useState<boolean>(false);
  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";

  const removeTodo = async (todo: Todo) => {
    sessionStorage.setItem("listShowing", listShowing as string);
    let newTodos: Todo[] = todosArr
      .map((todoObj) => {
        if (todoObj.todo !== todo.todo) return todoObj;
      })
      .filter((todo) => {
        if (todo !== undefined) return todo;
      }) as Todo[];
    let newLists: any = listsObj;
    for (const list in newLists) {
      if (list === listShowing) newLists[list] = newTodos;
    }

    await setDoc(doc(db, "userData", uid), {
      ...newLists,
    });
  };

  const handleClick = async (clickedTodo: Todo) => {
    sessionStorage.setItem("listShowing", listShowing as string);
    let newTodo: Todo = { todo: clickedTodo.todo, done: !clickedTodo.done };
    let newTodos: Todo[] = todosArr.map((todoObj) => {
      if (todoObj.todo === clickedTodo.todo) return newTodo;
      else return todoObj;
    });
    let newLists: any = listsObj;
    for (const list in newLists) {
      if (list === listShowing) newLists[list] = newTodos;
    }

    await setDoc(doc(db, "userData", uid), {
      ...newLists,
    });
  };

  const filteredTodos = (completed: boolean, init: boolean = false) => {
    setHighlightAll(false);
    setHighlightComplete(false);
    setHighlightUncomplete(false);
    if (init) {
      setTodosArr(initTodosArr);
      return;
    }
    let newTodos: Todo[] = [];
    initTodosArr.forEach((todo) => {
      if (todo.done === true && completed) newTodos.push(todo);
      if (todo.done !== true && !completed) newTodos.push(todo);
    });

    if (newTodos.length === 0) {
      setHighlightAll(true);
      if (completed) setHighlightUncomplete(true);
      if (!completed) setHighlightComplete(true);
    }
    setTodosArr(newTodos);
  };
  useEffect(() => {
    setTodosArr(passedTodos);
    setInitTodosArr(passedTodos);
  }, [passedTodos]);

  return (
    <>
      <main>
        <div className={todos.sortContainer}>
          <div className={todos.sort}>
            {highlightAll ? (
              <div
                className={`${todos.sortButton} ${todos.highlightButton}`}
                onClick={() => filteredTodos(true, true)}
              >
                all
              </div>
            ) : (
              <div
                className={todos.sortButton}
                onClick={() => filteredTodos(true, true)}
              >
                all
              </div>
            )}
            {highlightComplete ? (
              <div
                className={`${todos.sortButton} ${todos.highlightButton}`}
                onClick={() => filteredTodos(true)}
              >
                completed
              </div>
            ) : (
              <div
                className={`${todos.sortButton}`}
                onClick={() => filteredTodos(true)}
              >
                completed
              </div>
            )}
            {highlightUncomplete ? (
              <div
                className={`${todos.sortButton} ${todos.highlightButton}`}
                onClick={() => filteredTodos(false)}
              >
                in progress
              </div>
            ) : (
              <div
                className={todos.sortButton}
                onClick={() => filteredTodos(false)}
              >
                in progress
              </div>
            )}
          </div>
          <AddTodo
            todosArr={todosArr}
            listsObj={listsObj}
            listShowing={listShowing}
          ></AddTodo>
        </div>
        <div className={styles.grid}>
          {todosArr.map((todo) => {
            if (todo.todo === undefined) return;
            return (
              <section className={styles.card} key={uuidv4()}>
                <div
                  className="flex items-center "
                  style={{
                    cursor: "pointer",
                    padding: "1.75rem",
                  }}
                  onClick={() => handleClick(todo)}
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    className={todos.input}
                    onChange={() => console.log()}
                  ></input>
                  {todo.done ? (
                    <label className={todos.completed} data-content={todo.todo}>
                      {todo.todo}
                    </label>
                  ) : (
                    <label className={todos.label} data-content={todo.todo}>
                      {todo.todo}
                    </label>
                  )}
                </div>
                <div className={todos.remove}>
                  <FcCancel
                    size={32}
                    className={styles.icon}
                    style={{ cursor: "pointer" }}
                    onClick={() => removeTodo(todo)}
                  />
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Todos;
