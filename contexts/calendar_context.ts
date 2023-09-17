import { createContext } from 'react';
import { Calendar } from 'lib/calendar';

export type CalendarContextType = {
  calendar: Calendar,
  calendar_id: string,
}

export const CalendarContext = createContext(null as CalendarContextType);
