import {useRouter} from 'next/router';
import {useState} from 'react';
import {Alert, Button, Col, Form, Row} from 'react-bootstrap';
import {useAuth} from '../hooks/use_auth';
import {Layout} from '../layouts/v1';
import type {NextPageWithLayout} from './_app';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const handleSubmit = () => {
    register(email, password).then(() => {
      router.push('/v2');
    }).catch((error) => {
      setFormErrorMessage(error.message);
    })
  }

  return(
    <>
      <h1>新規登録</h1>
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
              新規登録
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className='mt-3'>
        <Col className="text-end">
          <a href="/login">ログインはこちら</a>
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
