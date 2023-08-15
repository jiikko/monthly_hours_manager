export type ParameterType = {
  name?: string;
  standardTime?: number;
  week?: WeekData;
  months?: MonthTable,
}

export type WeekData = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export type DayData = {
  day: number;
  scheduled: number;
  actual: number;
  isHoliday: boolean;
}

export type MonthTable = {
  [key: string]: Array<DayData>;
}
