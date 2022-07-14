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
      <code className={styles.code} onClick={() => setShowInput(!showInput)}>
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
    </div>
  );
};

export default AddTodo;
