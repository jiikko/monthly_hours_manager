import { Layout } from '../components/layout';
import type { NextPageWithLayout } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { PathGenerator } from '../lib/path_generator';
import { useAuth } from '../lib/auth';
import { Row, Alert, Button, Form, Col } from 'react-bootstrap';

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
      <div className="alert alert-info">ログイン後、既存データ(クエリパラメータ)の引き継ぎは行いません。</div>

      {formErrorMessage && <Alert variant="danger">{formErrorMessage}</Alert>}
      <Form>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Row>
          <Col>
            <Button variant="primary" className='mt-3' onClick={handleSubmit}>
              ログイン
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className='mt-3'>
        <Col className="text-end">
          <a href="/register">新規登録はこちら</a>
        </Col>
      </Row>
    </>
  )
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Page;
