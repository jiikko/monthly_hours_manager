import { Form, Button } from 'react-bootstrap';
import { Calendar, Week } from 'lib/calendar';
import {useController, useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver}  from '@hookform/resolvers/yup';

type Props = {
  calendar: Calendar;
  handleSubmit: (name: string, standardTime: number, workingWeek: Week) => void;
  submitLabel: string;
}

const schema = yup.object().shape({
  name: yup.string().required('必須項目です'),
  standardTime: yup.number().typeError('基準時間は数値である必要があります'),
  workingWeek: yup.object().shape({
    mon: yup.boolean(),
    tue: yup.boolean(),
    wed: yup.boolean(),
    thu: yup.boolean(),
    fri: yup.boolean(),
    sat: yup.boolean(),
    sun: yup.boolean(),
  }),
});

export const SettingForm: React.FC<Props> = ({ calendar, handleSubmit: handleParentSubmit, submitLabel }) => {
  const defaultStandardTime = 84;
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: calendar.name,
      standardTime: calendar.standardTime || defaultStandardTime,
      workingWeek: calendar.week || Week.create(),
    }
  });
  const { field: nameField, fieldState: nameFieldState } = useController({
    name: 'name',
    control,
  });
  const { field: standardTimeField, fieldState: standardTimeFieldState } = useController({
    name: 'standardTime',
    control,
  });
  const wrapperHandleSubmit = (data: any) => {
    handleParentSubmit(data.name, data.standardTime, Week.parse(data.workingWeek))
  };
  const dayTable = {
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
    sun: '日',
  };

  return (
    <>
      <Form onSubmit={handleSubmit(wrapperHandleSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="name">名前</Form.Label>
          <Form.Control {...nameField} type="text" isInvalid={!!nameFieldState.error} />
          <Form.Control.Feedback type="invalid">{nameFieldState.error?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor={'standardTime'}>基準時間</Form.Label>
          <Form.Control {...standardTimeField} type="text" isInvalid={!!standardTimeFieldState.error} />
          <Form.Control.Feedback type="invalid">{standardTimeFieldState.error?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Label>稼働曜日</Form.Label>
        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
          <Controller
            key={day}
            name={`workingWeek.${day}`}
            control={control}
            render={({ field }) => (
              <Form.Check
                type="switch"
                id={day}
                label={dayTable[day]}
                className='mb-2'
                checked={field.value || false}
                onChange={e => field.onChange(e.target.checked)}
              />
            )}
          />
        ))}

        <Button variant="primary" type="submit">{submitLabel}</Button>
      </Form>
    </>
  )
}
