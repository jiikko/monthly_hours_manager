import {useRouter} from 'next/router';
import {useState} from 'react';
import {Alert, Button, Col, Form, Row} from 'react-bootstrap';
import {useAuth} from '../hooks/use_auth';
import {Layout} from '../layouts/v1';
import type {NextPageWithLayout} from './_app';
import * as yup from 'yup';
import {useController, useForm} from 'react-hook-form';
import { yupResolver}  from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email('無効なメールアドレスです').required('必須項目です'),
  password: yup.string().required('必須項目です'),
});

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const onSubmit = (data: { email: string, password: string }) => {
    login(data.email, data.password).then(() => {
      router.push('/v2');
    }).catch((error) => {
      setFormErrorMessage(error.message);
    });
  }
 const { control, handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { field: emailField, fieldState: emailFieldState } = useController({
    name: 'email',
    control,
  });
  const { field: passwordField, fieldState: passwordFieldState } = useController({
    name: 'password',
    control,
  });

  return (
    <>
      <h1>ログイン</h1>
      <div className="alert alert-info">ログイン後、既存データ(クエリパラメータ)の引き継ぎは行いません。</div>
      {formErrorMessage && <Alert variant="danger">{formErrorMessage}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control {...emailField} type="email" placeholder="Enter email" isInvalid={!!emailFieldState.error} />
          <Form.Control.Feedback type="invalid">
            {emailFieldState.error?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control {...passwordField} type="password" placeholder="Password" isInvalid={!!passwordFieldState.error} />
          <Form.Control.Feedback type="invalid">
            {passwordFieldState.error?.message}
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
