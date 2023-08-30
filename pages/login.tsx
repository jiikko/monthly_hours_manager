import { Layout } from '../components/layout';
import type { NextPageWithLayout } from './_app';
import { useState } from 'react';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, getIdToken, signOut } from "firebase/auth";
import { useRouter } from 'next/router';
import { app } from "../lib/firebase";
import { PathGenerator } from '../lib/path_generator';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const errorMessageTable = {
    'auth/user-not-found': 'ユーザが見つかりませんでした。メールアドレスかパスワードが間違っています。',
  };

  const handleSubmit = () => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((_userCredential) => {
        const pathGenerator = PathGenerator();
        const { year, month, ...rest } = router.query; // パスパラメータは除外する
        const queryParameters = new URLSearchParams(Object.fromEntries(Object.entries(rest).map(([key, val]) => [key, String(val)]))).toString();
        const rootPath = pathGenerator.rootPath(queryParameters)
        router.push(rootPath);
      })
      .catch((error) => {
        console.log(error);
        setFormErrorMessage(errorMessageTable[error.code] || error.message);
      });
  };

  return (
    <>
      <h1>
        ログイン
      </h1>
      {formErrorMessage && <div className="alert alert-danger">{formErrorMessage}</div>}
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <input type="submit" value="ログイン" onClick={handleSubmit} />
    </>
  )
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Page;
