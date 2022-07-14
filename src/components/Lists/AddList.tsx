import React, { useState, useRef } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "../Todos/todos.module.css";
import { IoIosAddCircle } from "react-icons/io";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../Hooks/useAuth";
import { db } from "../../firebase";

const AddList = ({ listsObj }: any) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const newListRef: React.MutableRefObject<any> = useRef();
  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";
  const addList = async () => {
    const newList: Object = {
      [newListRef.current.value]: [{}],
    };
    if (newList === "") return;
    let newLists: Object = { ...listsObj, ...newList };

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
              onClick={addList}
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
            ref={newListRef}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                addList();
              }
            }}
          ></input>
        </div>
      )}
    </div>
  );
};

export default AddList;
