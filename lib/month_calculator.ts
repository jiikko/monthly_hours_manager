import { DayObject, DayData } from 'lib/days_generator';

export class MonthCalculator {
  private days: Array<DayData>;

  constructor(days: Array<DayData>) {
    this.days = days ? days : [];
  }

  totalScheduled(): number {
    return Number(this.daysWithoutHoliday().reduce((sum, day) => sum + Number(day.scheduled), 0).toFixed(1));
  }

  totalActual(): number {
    return this.daysWithoutHoliday().reduce((sum, day) => sum + Number(day.actual), 0);
  }

  daysWithoutHoliday(): Array<DayObject> {
    const d = this.days.map((day: DayObject, _: number) => { return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday)) })
    return d.filter(day => day.isWorkingDay());
  }
}
