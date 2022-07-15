import React, { useState, useRef } from "react";
import styles from "../../../styles/Home.module.css";
import todos from "../Todos/todos.module.css";
import { IoIosAddCircle } from "react-icons/io";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../app/useAuth";
import { db } from "../../firebase";

const AddList = ({
  listsObj,
  listShowing,
}: {
  listsObj: Object;
  listShowing: string;
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const newListRef: React.MutableRefObject<any> = useRef();
  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";
  const addList = async () => {
    sessionStorage.setItem("listShowing", listShowing as string);
    const newListValue = newListRef.current.value;
    const newList: Object = {
      [newListValue]: [{}],
    };
    let returnBool = false;
    Object.keys(listsObj).map((listKey: string) => {
      if (listKey === newListValue) returnBool = true;
    });
    if (returnBool || newListValue === "") {
      setShowInput(false);
      return;
    }
    let newLists: Object = { ...listsObj, ...newList };

    await setDoc(doc(db, "userData", uid), {
      ...newLists,
    });
    setShowInput(false);
  };
  return (
    <div className={styles.description}>
      <div className={todos.codeContainer}>
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
            <div className="flex" style={{ overflowWrap: "anywhere" }}>
              <div onClick={addList} style={{ paddingRight: "5px" }}>
                submit
              </div>
              <div
                onClick={() => setShowInput(false)}
                style={{
                  borderLeft: "2px black solid",
                  paddingLeft: "5px",
                }}
              >
                cancel
              </div>
            </div>
          ) : (
            <div
              className="flex items-center"
              onClick={() => setShowInput(true)}
            >
              add a list
              <IoIosAddCircle size={24} className={styles.icon} />
            </div>
          )}
        </code>
      </div>
    </div>
  );
};

export default AddList;
