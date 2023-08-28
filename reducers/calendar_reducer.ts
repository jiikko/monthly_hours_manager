export const CalendarReducer = (state: any, action: any) => {
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
      months: action.payload.calendarMonths,
    };
    default:
      throw new Error();
  }
}
