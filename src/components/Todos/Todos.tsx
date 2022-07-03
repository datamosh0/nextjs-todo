import React, { useEffect, useState } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "./todos.module.css";
import { useRef } from "react";
import { useAuth } from "../../Hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { IoIosAddCircle } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { uuidv4 } from "@firebase/util";

interface Todo {
  todo: string;
  done: boolean;
}
const Todos = () => {
  const [todosArr, setTodosArr] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [value, setValue] = useState(true);

  const newTodoRef: React.MutableRefObject<any> = useRef();
  const inputRef: React.MutableRefObject<any> = useRef();

  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";
  const name: string =
    currentUser.displayName !== null
      ? currentUser.displayName.split(" ")[0]
      : "";

  const readTodos = async () => {
    const docRef = doc(db, "userData", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setTodosArr(data.todos);
      setLoading(false);
    }
  };
  const checkKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
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

  useEffect(() => {
    if (currentUser.email) {
      readTodos();
    }
  }, []);

  return (
    <>
      {!loading && (
        <main>
          <div className={styles.description}>
            <h2 className="pb-2 text-3xl">Hello, {name}</h2>
            <code
              className={styles.code}
              onClick={() => setShowInput(!showInput)}
            >
              {showInput ? (
                "cancel"
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
                  className="border-2 border-black  p-1"
                  placeholder="press enter to submit "
                  ref={newTodoRef}
                  onKeyUp={checkKeyPress}
                ></input>
                <div onClick={addTodo} style={{ cursor: "pointer" }}>
                  submit
                </div>
              </div>
            )}
          </div>
          <div className={styles.grid}>
            {todosArr.map((todo) => {
              return (
                <section
                  className={styles.card}
                  key={uuidv4()}
                  onClick={() => handleClick(todo)}
                >
                  <div className="flex items-center">
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
                  <div onClick={() => removeTodo(todo)}>
                    <FcCancel size={32} className={styles.icon} />
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
