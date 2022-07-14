import React, { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  DocumentData,
  DocumentSnapshot,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../../firebase";
import Todos from "../Todos/Todos";
import todos from "../Todos/todos.module.css";
import styles from "../../../styles/Home.module.css";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";
import { FiLogOut } from "react-icons/fi";
import AddList from "./AddList";

const Lists = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [listsObj, setListsObj] = useState<any>({});
  const [listShowing, setListShowing] = useState<string>();
  const [todosArr, setTodosArr] = useState<Todo[]>([]);
  const dispatch = useDispatch();
  const currentUser = useAuth();
  const uid: string = currentUser.uid !== null ? currentUser.uid : "";

  const readTodos = async () => {
    const docRef: DocumentReference<DocumentData> = doc(db, "userData", uid);
    onSnapshot(docRef, (lists) => {
      let docSnap: DocumentData = lists.data()!;
      setListsObj(docSnap);
      let cachedList = sessionStorage.getItem("listShowing");
      Object.entries(docSnap).map((list, index) => {
        if (cachedList) {
          if (list[0] === cachedList) {
            setListShowing(list[0]);
            setTodosArr(list[1]);
            sessionStorage.setItem("listShowing", "");
          }
        } else if (index === 0) {
          setListShowing(list[0]);
          setTodosArr(list[1] as Todo[]);
        }
      });
      setLoading(false);
    });
  };

  const changeList = (e: React.MouseEvent<HTMLDivElement>) => {
    let newList = e.currentTarget.textContent;
    Object.entries(listsObj).map((list) => {
      if (list[0] === newList) {
        setListShowing(list[0]);
        setTodosArr(list[1] as Todo[]);
      }
    });
  };

  useEffect(() => {
    readTodos();
  }, []);
  return (
    <div>
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
        <section className={styles.mainSection}>
          <section className={styles.listSection}>
            <div>
              <div className={styles.listHeader}>My Lists</div>
              <div>
                {Object.keys(listsObj).map((list: string) => {
                  let selected = false;
                  if (list === listShowing) selected = true;
                  return (
                    <div key={list} className={todos.listOption}>
                      {selected ? (
                        <div
                          style={{
                            background: "#eee",
                          }}
                          className={styles.listOption}
                          onClick={changeList}
                        >
                          {list}
                        </div>
                      ) : (
                        <div onClick={changeList}>{list}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <AddList listsObj={listsObj} listShowing={listShowing}></AddList>
          </section>
          <Todos
            passedTodos={todosArr}
            listsObj={listsObj}
            listShowing={listShowing}
          ></Todos>
        </section>
      )}
    </div>
  );
};

export default Lists;
