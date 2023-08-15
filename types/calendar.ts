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

export class Week implements WeekData {
  constructor(public mon: boolean, public tue: boolean, public wed: boolean, public thu: boolean, public fri: boolean, public sat: boolean, public sun: boolean) {}

  static create(): Week {
    return new Week(false, false, false, false, false, false, false);
  }
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
