import { Layout } from '../components/layout';
import type { NextPageWithLayout } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { PathGenerator } from '../lib/path_generator';
import { useAuth } from '../lib/auth';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const errorMessageTable = {
    'auth/user-not-found': 'ユーザが見つかりませんでした。メールアドレスかパスワードが間違っています。',
  };

  const handleSubmit = () => {
    login(email, password).then(() => {
      router.push(PathGenerator().rootPath(null));
    }).catch((error) => {
      console.log(error);
      setFormErrorMessage(errorMessageTable[error.code] || error.message);
    });
  }

  return (
    <>
      <h1>ログイン</h1>
      <div className="alert alert-info">ログインした時にデータの引き継ぎは行いません。</div>

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
