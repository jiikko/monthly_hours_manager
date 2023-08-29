import { MonthTable } from '../lib/days_generator';
import { Week } from '../lib/calendar';

type CalendarAction =
  | { type: 'initialize'; payload: any }
  | { type: 'updateDays'; payload: { monthKey: string; days: any } }
  | { type: 'clearMonths' }
  | { type: 'updateCalendar'; payload: { name: string; standardTime: number; week: Week; } };

// Reducerの型も明示的に定義
type CalendarState = {
  name?: string;
  standardTime?: number;
  week?: Week;
  months?: MonthTable;
};

export const CalendarReducer = (state: CalendarState, action: CalendarAction) => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        ...action.payload
      };
    case 'updateDays':
      state.months[action.payload.monthKey] = action.payload.days;
      return { ...state }
    case 'clearMonths':
      state.months = {};
      return { ...state }
    case 'updateCalendar':
    return {
      ...state,
      name: action.payload.name,
      standardTime: action.payload.standardTime,
      week: action.payload.week,
      months: state.months,
    };
    default:
      throw new Error();
  }
}
