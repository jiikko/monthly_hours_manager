import { WeekData, DayData, ParameterType, MonthTable } from '../types/calendar';
import { DayObject } from './days_generator';

class JsonParameterTypeImpl implements ParameterType {
   public currentMonthKey: string;

  constructor(public name: string, public standardTime: number, public week: WeekData, public months: MonthTable) {
    // Objectで入っているはずだけど、クエリパラメータを直接編集してしまったことによってjsonのデシリアライズに失敗したら破損扱いとする
    if(typeof this.week === 'string') { this.week = undefined; }
    if(typeof this.months === 'string' || this.months === undefined) { this.months = {} as MonthTable; }
  }

  hasNoSetting(): boolean {
    return this.week === undefined;
  }

  hasName(): boolean {
    return !!this.name;
  }

  hasNoMothsSetting(): boolean {
    return Object.keys(this.months).length === 0;
  }

  hasMothsSetting(): boolean {
    return Object.keys(this.months).length > 0;
  }

  clearMonths(): void {
    this.months = {} as MonthTable;
  }

  selectMonth(monthKey: string): void {
    this.currentMonthKey = monthKey;
  }

  currentDaysInMonth(): Array<DayObject> {
    return this.months[this.currentMonthKey].map((day: DayObject, _: number) => {
      return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday))
    })
  }

  setDaysInMonth(days: Array<DayObject>): void {
    this.months[this.currentMonthKey] = days;
  }

  serializeAsJson(): string {
    return JsonParameter.serialize({ name: this.name, standardTime: this.standardTime, week: this.week, months: this.months })
  }
}

export class JsonParameter {
  static serialize(obj: ParameterType): string {
    return Object.entries(obj)
      .filter(([key, value]) => value !== undefined )
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
      })
      .join('&');
  }

  static parse(query: { [key: string]: string }): JsonParameterTypeImpl {
    const result = {} as ParameterType;
    Object.entries(query).forEach(([key, value]) => {
      try {
        result[key] = JSON.parse(decodeURIComponent(value));
      } catch (e) {
        result[key] = decodeURIComponent(value);
      }
    });

    return new JsonParameterTypeImpl(result.name, result.standardTime, result.week, result.months);
  }
}
