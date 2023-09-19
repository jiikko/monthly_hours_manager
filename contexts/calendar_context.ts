import { createContext } from 'react';
import { Calendar } from 'lib/calendar';

export type CalendarContextType = {
  calendar: Calendar,
}

export const CalendarContext = createContext(null as CalendarContextType);
