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
}

type MonthTable = {
  [key: string]: Array<DayData>;
}
