import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../app/userSlice";
import { signInWithPopup, updateCurrentUser } from "firebase/auth";
import { auth, provider } from "../../firebase";
import styles from "../../../styles/Home.module.css";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
function Login() {
  const dispatch = useDispatch();
  const handleClick = async () => {
    try {
      let result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { email, displayName, photoURL, uid } = user!;
      const newuser: User = { email, displayName, photoURL, uid };
      const idArr: string[] = [];
      const querySnapshot = await getDocs(collection(db, "userData"));
      querySnapshot.forEach((doc) => {
        idArr.push(doc.id);
      });
      let filteredArr: string[] = idArr.filter((id) => id === uid);
      if (filteredArr.length < 1) {
        await setDoc(doc(db, "userData", uid), { todos: [] });
      }

      dispatch(login(newuser));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <p className={styles.description} onClick={handleClick}>
        <code className={styles.code} style={{ cursor: "pointer" }}>
          Sign in with Google
        </code>
      </p>
    </div>
  );
}

export default Login;
