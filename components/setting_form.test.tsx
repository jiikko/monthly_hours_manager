import React from 'react';
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import { Week } from '../lib/json_parameter';
import { SettingForm } from './setting_form';
import { Calendar } from '../lib/calendar';

test('SettingForm submits the correct values', () => {
  const handleSubmit = jest.fn();
  const calendar = new Calendar('a', 100, Week.create(), {});
  render(<SettingForm calendar={calendar} handleSubmit={handleSubmit} submitLabel={'a'} />);

  fireEvent.change(screen.getByLabelText(/名前/i), { target: { value: '新しい名前' } });
  fireEvent.change(screen.getByLabelText(/基準時間/i), { target: { value: '120' } });
  fireEvent.click(screen.getByLabelText(/月/i));
  fireEvent.click(screen.getByText(/保存する/i));

  expect(handleSubmit).toHaveBeenCalledWith(
    '新しい名前',
    120,
    expect.objectContaining({
      mon: true,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    }),
    expect.anything()
  );
});
