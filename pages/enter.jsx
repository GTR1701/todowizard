import { auth, googleAuthProvider } from "../lib/firebase";
import { doc, writeBatch, getDoc, getFirestore } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { UserContext } from "../lib/context";
import Metatags from "../components/Metatags";
import styles from "../styles/Enter.module.css";

import { useEffect, useState, useCallback, useContext } from "react";
import debounce from "lodash.debounce";
import Link from "next/link";

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <div className={styles.flex}>
            <SignOutButton />
          </div>
        )
      ) : (
        <>
          <div className={styles.flex}>
            <SignInButton />
            <Link href={"/"}>
              <button className="btn-google" onClick={() => signOut(auth)}>
                Wróć na stronę główną
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={"/google.png"} width="30px" /> Zaloguj się
      </button>
    </>
  );
}

function SignOutButton() {
  return (
    <button className="btn-google" onClick={() => signOut(auth)}>
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), "usernames", username);
        const snap = await getDoc(ref);
        console.log("Firestore read executed!", snap.exists());
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className={styles.section}>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            className={styles.input}
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button
            type="submit"
            className={styles.btn_green}
            disabled={!isValid}
          >
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
