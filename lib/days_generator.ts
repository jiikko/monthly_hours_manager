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

class DaysGenerator {
  static execute(year: number, month: number, standardTime: number, workingDays: WeekData): Array<DayData> {
    return [];
  }
}

export default DaysGenerator;
