import React, { useState, useRef } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "./todos.module.css";
import { IoIosAddCircle } from "react-icons/io";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../Hooks/useAuth";
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
    if (returnBool || newTodo === "") return;
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
      <code className={styles.code}>
        {showInput ? (
          <div className="flex items-center">
            <div
              onClick={() => setShowInput(false)}
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
            <div className="flex items-center mt-3">
              <textarea
                className={todos.addInput}
                placeholder="press enter to submit"
                ref={newTodoRef}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="flex items-center" onClick={() => setShowInput(true)}>
            add a todo
            <IoIosAddCircle size={32} className={styles.icon} />
          </div>
        )}
      </code>
    </div>
  );
};

export default AddTodo;
