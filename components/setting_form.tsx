import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Week } from '../lib/json_parameter';
import { Calendar } from '../lib/calendar';

type Props = {
  calendar: Calendar;
  handleSubmit: (name: string, standardTime: number, workingWeek: Week) => void;
  submitLabel: string;
}

export const SettingForm: React.FC<Props> = ({ calendar, handleSubmit, submitLabel }) => {
  const defaultStandardTime = 84;
  const [name, setName] = useState('');
  const [standardTime, setStandardTime] = useState(undefined);
  const [workingWeek, setWorkingWeek] = useState(Week.create());

  const handleWorkingDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkingWeek({
      ...workingWeek,
      [e.target.name]: e.target.checked,
    });
  };

  useEffect(() => {
    setName(calendar.name || '');
    setStandardTime(calendar.standardTime || defaultStandardTime);
    setWorkingWeek(calendar.week || Week.create());
  }, [calendar]);

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="name">名前</Form.Label>
          <Form.Control type="text" id={'name'} defaultValue={name} onChange={(e) => setName(e.target.value)}  />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor={'standardTime'}>基準時間</Form.Label>
          <Form.Control type="text" id={'standardTime'} defaultValue={standardTime} onChange={(e) => setStandardTime(Number(e.target.value))}  required />
        </Form.Group>

        <Form.Label>稼働曜日</Form.Label>
        <Form.Check type="switch" id='m' name="mon" label="月" className='mb-2' checked={workingWeek.mon || false} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" id='t' name="tue" label="火" className='mb-2' checked={workingWeek.tue || false} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" id='w' name="wed" label="水" className='mb-2' checked={workingWeek.wed || false} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" id='thu' name="thu" label="木" className='mb-2' checked={workingWeek.thu || false} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" id='fri' name="fri" label="金" className='mb-2' checked={workingWeek.fri || false} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" id='sat' name="sat" label="土" className='mb-2' checked={workingWeek.sat || false} onChange={handleWorkingDaysChange} />
        <Form.Check type="switch" id='sun' name="sun" label="日" className='mb-4' checked={workingWeek.sun || false} onChange={handleWorkingDaysChange} />

        <Button variant="primary" type="submit" onClick={(_) => handleSubmit(name, standardTime, workingWeek)}>
          {submitLabel}
        </Button>
      </Form>
    </>
  )
}
