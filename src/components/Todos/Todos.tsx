import React, { useEffect, useState } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "./todos.module.css";
import { useRef } from "react";
import { useAuth } from "../../Hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { IoIosAddCircle } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";
import { uuidv4 } from "@firebase/util";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";

const Todos = () => {
  const [todosArr, setTodosArr] = useState<Todo[]>([]);
  const [initTodosArr, setInitTodosArr] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showInput, setShowInput] = useState<boolean>(false);
  const newTodoRef: React.MutableRefObject<any> = useRef();
  const currentUser = useAuth();
  const [highlightAll, setHighlightAll] = useState<boolean>(false);
  const [highlightComplete, setHighlightComplete] = useState<boolean>(false);
  const [highlightUncomplete, setHighlightUncomplete] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";

  const readTodos = async () => {
    const docRef = doc(db, "userData", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setTodosArr(data.todos);
      setInitTodosArr(data.todos);
      setLoading(false);
    }
  };

  const addTodo = async () => {
    const newTodo: string = newTodoRef.current.value;
    let returnBool = false;
    todosArr.forEach((todo: Todo) => {
      if (todo.todo === newTodo) returnBool = true;
    });
    if (returnBool || newTodo === "") return;
    let newTodos: Todo[] = [...todosArr, { todo: newTodo, done: false }];
    await setDoc(doc(db, "userData", uid), {
      todos: newTodos,
    });
    setShowInput(false);
    readTodos();
  };

  const removeTodo = async (todo: Todo) => {
    let newTodos: Todo[] = [];
    todosArr.forEach((todoObj) => {
      if (todoObj.todo !== todo.todo) newTodos.push(todoObj);
    });
    await setDoc(doc(db, "userData", uid), {
      todos: newTodos,
    });
    readTodos();
  };

  const handleClick = async (todo: Todo) => {
    let newTodo: Todo = { todo: todo.todo, done: !todo.done };
    let newTodos: Todo[] = [];
    todosArr.forEach((todoObj) => {
      if (todoObj.todo === todo.todo) newTodos.push(newTodo);
      else newTodos.push(todoObj);
    });
    await setDoc(doc(db, "userData", uid), {
      todos: newTodos,
    });
    readTodos();
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
    if (currentUser.email) {
      readTodos();
    }
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div>Next.js Todo List</div>
        <div className="flex items-center">
          <div style={{ marginRight: "10px" }}>{currentUser.displayName}</div>
          <img
            className={todos.userImg}
            src={`${currentUser.photoURL}`}
            alt="alt"
            referrerPolicy="no-referrer"
          />
          <FiLogOut
            style={{ marginLeft: ".75rem", cursor: "pointer" }}
            onClick={() => dispatch(logout())}
          ></FiLogOut>
        </div>
      </header>
      {!loading && (
        <main>
          <div className={styles.description}>
            <code
              className={styles.code}
              onClick={() => setShowInput(!showInput)}
            >
              {showInput ? (
                <div className="flex ">
                  <div
                    style={{
                      paddingRight: ".5rem",
                      borderRight: "2px black solid",
                    }}
                  >
                    cancel
                  </div>
                  <div
                    onClick={addTodo}
                    style={{
                      paddingLeft: ".5rem",
                    }}
                  >
                    submit
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  add a todo
                  <IoIosAddCircle size={32} className={styles.icon} />
                </div>
              )}
            </code>

            {showInput && (
              <div className="flex items-center mt-3">
                <input
                  type="text"
                  className={todos.addInput}
                  placeholder="press enter to submit"
                  ref={newTodoRef}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      addTodo();
                    }
                  }}
                ></input>
              </div>
            )}

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
          </div>
          <div className={styles.grid}>
            {todosArr.map((todo) => {
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
                    <label className={todos.label} data-content={todo.todo}>
                      {todo.todo}
                    </label>
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
      )}
    </>
  );
};

export default Todos;
