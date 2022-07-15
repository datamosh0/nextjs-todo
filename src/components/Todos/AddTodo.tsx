import React, { useState, useRef } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "./todos.module.css";
import { IoIosAddCircle } from "react-icons/io";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../app/useAuth";
import { db } from "../../firebase";

const AddTodo = ({ todosArr, listsObj, listShowing }: any) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const newTodoRef: React.MutableRefObject<any> = useRef();
  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";
  const addTodo = async () => {
    sessionStorage.setItem("listShowing", listShowing as string);
    const newTodo: string = newTodoRef.current.value;
    let returnBool = false;
    todosArr.forEach((todo: Todo) => {
      if (todo.todo === newTodo) returnBool = true;
    });
    if (returnBool || newTodo === "") {
      setShowInput(false);
      return;
    }
    let newTodos: Todo[] = [...todosArr, { todo: newTodo, done: false }];
    let newLists: any = listsObj;
    for (const list in newLists) {
      if (list === listShowing) newLists[list] = newTodos;
    }
    await setDoc(doc(db, "userData", uid), {
      ...newLists,
    });
    setShowInput(false);
  };
  return (
    <div className={styles.description}>
      {showInput ? (
        <code className={styles.code}>
          <div className={todos.addContainer}>
            <textarea
              className={todos.addInput}
              style={{ minWidth: "260px" }}
              placeholder="press enter to submit"
              ref={newTodoRef}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
            ></textarea>
            <div className={todos.addSubContainer}>
              <div
                onClick={addTodo}
                style={{
                  paddingRight: ".5rem",
                  borderRight: "2px black solid",
                }}
              >
                submit
              </div>
              <div
                onClick={() => setShowInput(false)}
                style={{
                  paddingLeft: ".5rem",
                }}
              >
                cancel
              </div>
            </div>
          </div>
        </code>
      ) : (
        <code className={styles.code} onClick={() => setShowInput(true)}>
          <div className="flex items-center">
            add a todo
            <IoIosAddCircle size={24} className={styles.icon} />
          </div>
        </code>
      )}
    </div>
  );
};

export default AddTodo;
