import React, { useState, useRef } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "../Todos/todos.module.css";
import { IoIosAddCircle } from "react-icons/io";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../Hooks/useAuth";
import { db } from "../../firebase";

const AddList = ({ listsObj, listShowing }: any) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const newListRef: React.MutableRefObject<any> = useRef();
  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";
  const addList = async () => {
    sessionStorage.setItem("listShowing", listShowing as string);
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
      {showInput && (
        <textarea
          className={todos.addInput}
          placeholder="press enter to submit"
          ref={newListRef}
          style={{ marginBottom: "2.25rem" }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              addList();
            }
          }}
        ></textarea>
      )}
      <code className={styles.code}>
        {showInput ? (
          <div className="flex flex-col">
            <div>
              <div
                onClick={() => setShowInput(false)}
                style={{
                  borderBottom: "2px black solid",
                }}
              >
                cancel
              </div>
              <div onClick={addList}>submit</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center" onClick={() => setShowInput(true)}>
            add a list
            <IoIosAddCircle size={32} className={styles.icon} />
          </div>
        )}
      </code>
    </div>
  );
};

export default AddList;
