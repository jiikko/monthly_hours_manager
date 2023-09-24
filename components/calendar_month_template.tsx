import {Calendar, Week} from 'lib/calendar';
import {CalendarViewBuilderReturnType} from 'lib/calendar_view_builder';
import {DayObject} from 'lib/days_generator';
import {Table} from 'react-bootstrap';

type HandleUpdateDayType = (attributeName: string, value: boolean | string, dayIndex: number) => void;
type TDBodyType = (dayNumber: number | null, index: number, days: Array<DayObject | Calendar>, workingWeek: Week, handleUpdateDay: HandleUpdateDayType) => JSX.Element;
type Props = {
  builder: CalendarViewBuilderReturnType;
  days: Array<DayObject | Calendar>;
  workingWeek: Week;
  handleUpdateDay: HandleUpdateDayType;
  tDBody: TDBodyType;
};

export const CalendarMonthTemplate: React.FC<Props> = ({ builder, tDBody, days, workingWeek, handleUpdateDay }) => {
  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          {builder.headerWeeks().map((row, i) => (<th key={i}>{row}</th>))}
        </tr>
      </thead>
      <tbody>
        {builder.bodyWeeks().map((week, i) => (
          <tr key={i}>{week.map(({ dayNumber, index }) => { return tDBody(dayNumber, index, days, workingWeek, handleUpdateDay) })}</tr>
        ))}
      </tbody>
    </Table>
  )
}
