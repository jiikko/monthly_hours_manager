import { DayObject, MonthTable } from './days_generator';
import { JsonParameter } from './json_parameter';

export class Week {
  constructor(
    public mon: boolean,
    public tue: boolean,
    public wed: boolean,
    public thu: boolean,
    public fri: boolean,
    public sat: boolean,
    public sun: boolean
  ) {}

  static create(): Week {
    return new Week(false, false, false, false, false, false, false);
  }
}

export type CalendarType = {
  name?: string;
  standardTime?: number;
  week?: Week;
  months?: MonthTable,
}

export class Calendar implements CalendarType {
  constructor(public name: string, public standardTime: number, public week: Week, public months: MonthTable) {}

  serializeAsJson(): string {
    return JsonParameter.serialize({ name: this.name, standardTime: this.standardTime, week: this.week, months: this.months })
  }

  hasSetting(): boolean {
    return !!this.week;
  }
}