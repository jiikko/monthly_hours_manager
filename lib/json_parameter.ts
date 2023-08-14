import { WeekData, DayData, ParameterType, MonthTable } from '../types/calendar';

class JsonParameterTypeImpl implements ParameterType {
  constructor(public name: string, public standardTime: number, public week: WeekData, public months: MonthTable) {
    // Objectで入っているはずだけど、クエリパラメータを直接編集してしまったことによってjsonのデシリアライズに失敗したら破損扱いとする
    if(typeof this.week === 'string') { this.week = undefined; }
    if(typeof this.months === 'string') { this.months = undefined; }
  }

  hasNoSetting(): boolean {
    return this.week === undefined;
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
