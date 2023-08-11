type WeekData = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

type DayData = {
  scheduled: number;
  actual: number;
}

type ParameterType = {
  name?: string;
  standardTime?: number;
  week?: WeekData;
  currentMonth?: Array<DayData>;
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
