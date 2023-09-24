import { CalendarCollectionContext } from "contexts/calendar_collection_context";
import { Calendar } from "lib/calendar";
import { useContext } from "react";

type Type = {
  calendars: Array<Calendar>;
};

export const useCalendarCollection = (): Type => {
  const { calendars } = useContext(CalendarCollectionContext);

  return { calendars };
};
