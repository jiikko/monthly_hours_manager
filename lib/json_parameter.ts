import { WeekData, DayData } from '../types/calendar';
type MonthTable = {
  [key: string]: Array<DayData>;
}

type ParameterType = {
  name?: string;
  standardTime?: number;
  week?: WeekData;
  months: MonthTable,
}

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
