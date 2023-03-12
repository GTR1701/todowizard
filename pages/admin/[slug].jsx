import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth } from "../../lib/firebase";
import {
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";

let punkty = [];

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  // const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "listy",
    slug
  );
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Narzędzia</h3>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const [tekst, setTekst] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [done, setDone] = useState(false);
  punkty = defaultValues.content;

  useEffect(() => {
    setTekst("");
  }, [refresh]);

  const updatePost = async () => {
    await updateDoc(postRef, {
      content: punkty,
      updatedAt: serverTimestamp(),
    });
  };
  const handleClick = (e) => {
    e.preventDefault();
    punkty.push({ tekst, done: false, id: tekst.length });
    setRefresh(!refresh);
  };

  const handleMark = (e, item) => {
    e.preventDefault();
    setDone(!done);
    for (let i = 0; i < punkty.length; i++) {
      if (punkty[i].tekst == item.tekst) {
        item.done = !item.done;
      }
    }
  };

  const handleDelete = (e, item) => {
    e.preventDefault();
    for (let i = 0; i < punkty.length; i++) {
      if (punkty[i].id == item.id) {
        punkty.splice(i, 1);
        setRefresh(!refresh);
      }
    }
  };

  return (
    <form onSubmit={updatePost()}>
      <ul className="todo-ul">
        {punkty.map((item) => (
          <div className="task-div">
            <li
              className="task"
              style={item.done ? { textDecoration: "line-through" } : {}}
            >
              {item.tekst}
            </li>
            <button className="btn-green" onClick={(e) => handleMark(e, item)}>
              &#x2714;
            </button>
            <button className="btn-red" onClick={(e) => handleDelete(e, item)}>
              &#x2718;
            </button>
          </div>
        ))}
        <li>
          <input
            id="pole"
            type="text"
            placeholder="Wpisz nowe zadanie"
            onChange={(e) => setTekst(e.target.value)}
            value={tekst}
          />
          <button className="btn-blue" onClick={(e) => handleClick(e)}>
            Dodaj
          </button>
        </li>
      </ul>
      {/* <div className={preview ? styles.hidden : styles.controls}>
        <button type="submit" className="btn-green">
          Zapisz zmiany
        </button>
      </div> */}
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("czy na pewno usunąć?");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("post annihilated ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Usuń listę
    </button>
  );
}

function MarkTask({}) {
  return <div></div>;
}

function CreateTask({}) {
  return <></>;
}

function ListElement({ content }) {
  return <p>{content}</p>;
}
