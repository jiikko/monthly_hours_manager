import {MonthTable} from "./days_generator";
import {JsonParameter} from "./json_parameter";
import {MonthCalculator} from "./month_calculator";

function isObject(object) {
  return object != null && typeof object === 'object';
}
function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}

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
    public createdAt?: Date,
    public lockVersion?: number
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

  sortByMonthKey(): void {
    if (!this.months) { return; }

    const sortedKeys = Object.keys(this.months).sort((a, b) => {
      const dateA = new Date(a + '-01');
      const dateB = new Date(b + '-01');
      return dateA.getTime() - dateB.getTime();
    });
    const sortedMonths: MonthTable = {};
    sortedKeys.forEach(key => {
      sortedMonths[key] = this.months[key];
    });
    this.months = sortedMonths;
  }

  sumByMonth(monthKey: string, method: string): number {
    const c = new MonthCalculator(this.months[monthKey])
    return Number(c[method]().toFixed(2));
  }

  isEqual(calendar: CalendarType): boolean {
    if (!(calendar instanceof Calendar)) {
      return false;
    }

    return this.name === calendar.name &&
      this.standardTime === calendar.standardTime &&
      deepEqual(this.week, calendar.week) &&
      deepEqual(this.months, calendar.months) &&
      this.shouldOutputQueryParam === calendar.shouldOutputQueryParam &&
      this.id === calendar.id &&
      this.createdAt.toJSON() === calendar.createdAt.toJSON() &&
      this.lockVersion === calendar.lockVersion;
  }
}
