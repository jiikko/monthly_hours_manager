import { createContext } from 'react';
import { Calendar } from 'lib/calendar';

export type CalendarCollectionContextType = {
  calendars: Array<Calendar>,
}

export const CalendarCollectionContext = createContext(null as CalendarCollectionContextType);
