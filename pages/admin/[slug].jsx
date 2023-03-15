import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { auth } from "../../lib/firebase";
import {
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
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

            <PostForm postRef={postRef} defaultValues={post} />
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
  const [punkty, setPunkty] = useState(defaultValues.content);

  useEffect(() => {
    setTekst("");
  }, [refresh]);

  const updatePost = async (e) => {
    e.preventDefault();
    if (punkty == []) {
      await updateDoc(postRef, {
        content: [],
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(postRef, {
        content: punkty,
        updatedAt: serverTimestamp(),
      });
    }
    toast.success("Lista zapisana");
  };
  const handleClick = (e) => {
    e.preventDefault();
    punkty.push({ tekst, done: false, id: punkty.length, indent: 1 });
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

  const removeIndent = (e, item) => {
    e.preventDefault();
    for (let i = 0; i < punkty.length; i++) {
      if (punkty[i].id == item.id) {
        if (punkty[i].indent < 4) {
          punkty[i].indent++;
          setRefresh(!refresh);
        }
      }
    }
  };

  const addIndent = (e, item) => {
    e.preventDefault();
    for (let i = 0; i < punkty.length; i++) {
      if (punkty[i].id == item.id) {
        if (punkty[i].indent > 1) {
          punkty[i].indent--;
          setRefresh(!refresh);
        }
      }
    }
  };

  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const drop = (e) => {
    const copyListItems = [...punkty];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setPunkty(copyListItems);
    setRefresh(!refresh);
  };

  return (
    <>
      <ul className="todo-ul">
        {punkty &&
          punkty.map((item, index) => (
            <div
              className="task-div"
              onDragStart={(e) => dragStart(e, index)}
              onDragEnter={(e) => dragEnter(e, index)}
              onDragEnd={drop}
              key={index}
              draggable
            >
              <li
                className={`task level${item.indent}`}
                style={item.done ? { textDecoration: "line-through" } : {}}
              >
                {item.tekst}
              </li>
              <button
                className="btn-green"
                onClick={(e) => handleMark(e, item)}
              >
                &#x2714;
              </button>
              <button
                className="btn-blue strzalka"
                onClick={(e) => addIndent(e, item)}
              >
                &#x1F808;
              </button>
              <button
                className="btn-blue strzalka"
                onClick={(e) => removeIndent(e, item)}
              >
                &#x1F80a;
              </button>
              <button
                className="btn-red"
                onClick={(e) => handleDelete(e, item)}
              >
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
          <div className="flex">
            <button className="btn-blue" onClick={(e) => handleClick(e)}>
              Dodaj
            </button>
          </div>
        </li>
      </ul>
      <div className={preview ? styles.hidden : styles.controls}>
        <button onClick={(e) => updatePost(e)} className="btn-green">
          Zapisz zmiany
        </button>
      </div>
    </>
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
