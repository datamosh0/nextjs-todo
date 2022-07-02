import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Todos from "../src/components/Todos/Todos";
import { useAuth } from "../src/Hooks/useAuth";
import Login from "../src/components/Login/Login";
const Home: NextPage = () => {
  const currentUser: User = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Todo</h1>
        {currentUser.email ? (
          <div className="flex flex-col items-center">
            <Todos></Todos>
          </div>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
};

export default Home;
