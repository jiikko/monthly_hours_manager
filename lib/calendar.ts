import { MonthTable } from "./days_generator";
import { JsonParameter } from "./json_parameter";

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

  static parse(week: Week): Week {
    return new Week(
      week.mon,
      week.tue,
      week.wed,
      week.thu,
      week.fri,
      week.sat,
      week.sun
    );
  }

  format(): string {
    const weekDayMapping = {
      sun: "日",
      mon: "月",
      tue: "火",
      wed: "水",
      thu: "木",
      fri: "金",
      sat: "土",
    };
    const weekDayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return weekDayOrder
      .filter((key) => this[key])
      .map((key) => weekDayMapping[key])
      .join(", ");
  }

  // NOTE: firestoreに格納するときに使う
  toObject(): object {
    const { mon, tue, wed, thu, fri, sat, sun } = this;
    const obj = { mon, tue, wed, thu, fri, sat, sun };
    Object.keys(obj).forEach(
      (key) => obj[key] === undefined && delete obj[key]
    );
    return obj;
  }
}

export type CalendarType = {
  name?: string;
  standardTime?: number;
  week?: Week;
  months?: MonthTable;
  shouldOutputQueryParam?: boolean;
  createdAt?: Date;
};

export class Calendar implements CalendarType {
  constructor(
    public name: string,
    public standardTime: number,
    public week: Week,
    public months: MonthTable,
    public shouldOutputQueryParam?: boolean,
    public id?: string,
    public createdAt?: Date
  ) {}

  static initializeWithDefault(): Calendar {
    return new Calendar("新しいカレンダー", 84, Week.create(), {});
  }

  serializeAsJson(): string {
    if (this.shouldOutputQueryParam) {
      return;
    }

    return JsonParameter.serialize({
      name: this.name,
      standardTime: this.standardTime,
      week: this.week,
      months: this.months,
    });
  }

  hasSetting(): boolean {
    return !this.hasNoSetting();
  }

  hasNoSetting(): boolean {
    if (!this.week) {
      return true;
    }
    return Object.entries(this.week).length === 0;
  }

  formattedCreatedAt(): string {
    return this.createdAt.toISOString().slice(0, 10);
  }
}
