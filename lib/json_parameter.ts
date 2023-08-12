import { WeekData, DayData, ParameterType, MonthTable } from '../types/calendar';

class JsonParameter {
  static serialize(obj: ParameterType): string {
    return Object.entries(obj) .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
    }).join('&');
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

export default JsonParameter;
