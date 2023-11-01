import {useRouter} from 'next/router';
import {useState} from 'react';
import {Alert, Button, Col, Form, Row} from 'react-bootstrap';
import {useAuth} from '../hooks/use_auth';
import {Layout} from '../layouts/v1';
import type {NextPageWithLayout} from './_app';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import { yupResolver}  from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email('無効なメールアドレスです').required('必須項目です'),
  password: yup.string().required('必須項目です'),
});

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const onSubmit = () => {
    login(email, password).then(() => {
      router.push('/v2');
    }).catch((error) => {
      setFormErrorMessage(error.message);
    });
  }
 const { control, handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  console.log(errors)

  return (
    <>
      <h1>ログイン</h1>
      <div className="alert alert-info">ログイン後、既存データ(クエリパラメータ)の引き継ぎは行いません。</div>
      {formErrorMessage && <Alert variant="danger">{formErrorMessage}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" {...register("email")} isInvalid={!!errors.email} />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" { ...register("password")} isInvalid={!!errors.password} />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col>
            <Button variant="primary" className='mt-3' type="submit">
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
