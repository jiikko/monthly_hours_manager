import { WeekData, DayData, ParameterType, MonthTable } from '../types/calendar';

export class JsonParameter {
  static serialize(obj: ParameterType): string {
    return Object.entries(obj)
      .filter(([key, value]) => value !== undefined )
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
      })
      .join('&');
  }

  static parse(query: { [key: string]: string }): ParameterType {
    const result = {} as ParameterType;
    Object.entries(query).forEach(([key, value]) => {
      try {
        result[key] = JSON.parse(decodeURIComponent(value));
      } catch (e) {
        result[key] = decodeURIComponent(value);
      }
    });
    return result;
  }
}
