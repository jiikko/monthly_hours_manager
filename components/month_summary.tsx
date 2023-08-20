import { DayObject } from '../lib/days_generator';
import { Table } from 'react-bootstrap';

type SummaryProps = {
  days: Array<DayObject>;
  standardTime: number;
}

export const MonthSummary: React.FC<SummaryProps> = ({ days, standardTime }) => {
  const daysWithoutHoliday =  days.filter(day => day.isWorkingDay());
  const totalScheduled = Number(daysWithoutHoliday.reduce((sum, day) => sum + Number(day.scheduled), 0).toFixed(1));
  const diffScheduled = Number((totalScheduled - standardTime).toFixed(1));
  const totalScheduledClassName = (totalScheduled >= standardTime) ? 'text-white bg-success' : 'text-white bg-danger';
  const totalActual = daysWithoutHoliday.reduce((sum, day) => sum + Number(day.actual), 0);
  const diffActual = totalActual - standardTime;
  const totalActualClassName = (totalActual >= standardTime) ? 'text-white bg-success' : '';

  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>基準時間</th>
          <th className={totalScheduledClassName}>予定の合計</th>
          <th className={totalScheduledClassName}>予定の差分</th>
          <th className={totalActualClassName}>実績の合計</th>
          <th className={totalActualClassName}>実績の差分</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{standardTime}時間</td>
          <td className={totalScheduledClassName}>{totalScheduled}時間</td>
          <td className={totalScheduledClassName}>{diffScheduled}時間</td>
          <td className={totalActualClassName}>{totalActual}時間</td>
          <td className={totalActualClassName}>{diffActual}時間</td>
        </tr>
      </tbody>
    </Table>
  )
};
