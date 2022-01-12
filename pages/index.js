import { useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const MESSAGE = {
    GET_MODIFIED_NAME: "변경된 이름을 가져왔습니다.",
    GET_NOT_MODIFIED_NAME: "이름이 변경되지 않았습니다.",
  };

  const nameInputRef = useRef();
  const [myData, setMyData] = useState({ name: "", etag: "" });
  const [message, setMessage] = useState("");

  function getName() {
    fetch("/api/name", {
      method: "GET",
      headers: { etag: myData.etag },
    })
      .then((res) => {
        if (res.status === 304) {
          setMessage(MESSAGE.GET_NOT_MODIFIED_NAME);
          return {};
        }
        return res.json();
      })
      .then((data) => {
        if (data.etag && data.etag !== myData.etag) {
          setMessage(MESSAGE.GET_MODIFIED_NAME);
          setMyData(data);
        } else {
          setMessage(MESSAGE.GET_NOT_MODIFIED_NAME);
        }
      });
  }

  function updateName() {
    const name = nameInputRef.current.value;
    fetch("/api/name", {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: { etag: myData.etag },
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>API Etag Practice</title>
        <meta name="description" content="API Etag Practice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.section}>
          <button className={styles.button} onClick={getName}>
            이름 가져오기
          </button>
          <div>
            <span>NAME: </span>
            <span>{myData.name}</span>
          </div>
          <div>
            <span>{message}</span>
          </div>
        </section>
        <section className={styles.section}>
          <fieldset className={styles.fieldset}>
            <input
              className={styles.input}
              ref={nameInputRef}
              placeholder="새로운 이름을 입력하세요"
            />
            <button className={styles.button} onClick={updateName}>
              이름 변경하기
            </button>
          </fieldset>
        </section>
      </main>
    </div>
  );
}
