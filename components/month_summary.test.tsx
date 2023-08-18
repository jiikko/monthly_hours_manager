import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import { MonthSummary } from './month_summary';
import { DayObject } from '../lib/days_generator';

describe('<MonthSummary />', () => {
  test('renders correctly', () => {
    const days = [
      new DayObject(1, 8, 7, false),
      new DayObject(2, 8, 7, false),
    ];
    const standardTime = 16;
    const { container } = render(<MonthSummary days={days} standardTime={standardTime} />);
    expect(container).toHaveTextContent('16時間');
  });
});
