import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JsonParameter from '../lib/json_parameter';

const CalendarEdit: NextPageWithLayout = () => {
  const defaultStandardTime = 84;
  const router = useRouter();
  const [name, setName] = useState('');
  const [standardTime, setStandardTime] = useState(defaultStandardTime);
  const [workingDays, setWorkingDays] = useState({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });

  const handleWorkingDaysChange = (e) => {
    setWorkingDays({
      ...workingDays,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
    const jsonQuery = JsonParameter.serialize({ name, standardTime, week: workingDays, months: jsonObject.months})
    router.push(`/calendar_edit?${jsonQuery}`);
    console.log('this calendar has been saved!'); // トーストで表示したい
  };

  useEffect(() => {
    const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
    setName(jsonObject['name'] || '');
    setStandardTime(jsonObject['standardTime'] || defaultStandardTime);

    setWorkingDays(jsonObject.week || {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    })
  }, [router.query]);

  return (
    <>
      <h1>
        カレンダーの編集
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>名前</Form.Label>
          <Form.Control type="name" defaultValue={name} onChange={(e) => setName(e.target.value)}  required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>基準時間</Form.Label>
          <Form.Control type="name" defaultValue={standardTime} onChange={(e) => setStandardTime(Number(e.target.value))}  required />
        </Form.Group>

        <Form.Label>稼働曜日</Form.Label>
        <Form.Check type="switch" name="mon" label="月" checked={workingDays.mon} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="tue" label="火" checked={workingDays.tue} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="wed" label="水" checked={workingDays.wed} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="thu" label="木" checked={workingDays.thu} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="fri" label="金" checked={workingDays.fri} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="sat" label="土" checked={workingDays.sat} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" name="sun" label="日" checked={workingDays.sun} onChange={handleWorkingDaysChange} />

        <Button variant="primary" type="submit">保存する</Button>
      </Form>
    </>
  )
}

export default CalendarEdit

CalendarEdit.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
