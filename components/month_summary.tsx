import {MonthCalculator} from 'lib/month_calculator';
import {Table} from 'react-bootstrap';
import {DayObject} from '../lib/days_generator';

type SummaryProps = {
  days: Array<DayObject>;
  standardTime: number;
}

export const MonthSummary: React.FC<SummaryProps> = ({ days, standardTime }) => {
  const calculator = new MonthCalculator(days)
  const totalScheduled = calculator.totalScheduled();
  const diffScheduled = Number((totalScheduled - standardTime).toFixed(1));
  const totalScheduledClassName = (totalScheduled >= standardTime) ? 'text-white bg-success' : 'text-white bg-danger';
  const totalActual = calculator.totalActual();
  const diffActual = Number((totalActual - standardTime).toFixed(1));
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
