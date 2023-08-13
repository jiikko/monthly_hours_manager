import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { Form, Button, ToastContainer } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JsonParameter from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { useToast } from '../hooks/useToast';
import { ToastComponent } from '../components/toast';

type ToastProps = {
  message: string;
  showToast: boolean;
  hideToast: () => void;
}

const Page: NextPageWithLayout = () => {
  const defaultStandardTime = 84;
  const defaultWeek = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
    }
  const router = useRouter();
  const [name, setName] = useState('');
  const [standardTime, setStandardTime] = useState(defaultStandardTime);
  const [workingWeek, setWorkingWeek] = useState(defaultWeek);
  const { showToastFunction, toastMessage, showToast, hideToast } = useToast();

  const handleWorkingDaysChange = (e) => {
    setWorkingWeek({
      ...workingWeek,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
    const jsonQuery = JsonParameter.serialize({ name, standardTime, week: workingWeek, months: jsonObject.months})
    const editPath = PathGenerator().editPath(jsonQuery)

    router.push(editPath);
    showToastFunction('カレンダー情報の変更に成功しました。')
  };

  useEffect(() => {
    const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
    setName(jsonObject['name'] || '');
    setStandardTime(jsonObject['standardTime'] || defaultStandardTime);
    setWorkingWeek(jsonObject.week || defaultWeek);
  }, [router.query]);

  return (
    <>
      <h1>
        カレンダーの編集
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>名前</Form.Label>
          <Form.Control type="name" defaultValue={name} onChange={(e) => setName(e.target.value)}  />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>基準時間</Form.Label>
          <Form.Control type="name" defaultValue={standardTime} onChange={(e) => setStandardTime(Number(e.target.value))}  required />
        </Form.Group>

        <Form.Label>稼働曜日</Form.Label>
        <Form.Check type="switch" name="mon" label="月" checked={workingWeek.mon} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="tue" label="火" checked={workingWeek.tue} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="wed" label="水" checked={workingWeek.wed} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="thu" label="木" checked={workingWeek.thu} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="fri" label="金" checked={workingWeek.fri} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="sat" label="土" checked={workingWeek.sat} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="sun" label="日" checked={workingWeek.sun} onChange={handleWorkingDaysChange} />

        <Button variant="primary" type="submit">保存する</Button>
      </Form>

      <ToastComponent message={toastMessage} showToast={showToast} hideToast={hideToast} />
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
