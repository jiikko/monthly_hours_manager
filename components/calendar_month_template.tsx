import {CalendarViewBuilder} from "lib/calendar_view_builder";
import {Table} from "react-bootstrap";

type TDBodyType = (dayNumber: number | null, index: number) => JSX.Element;
type Props = {
  builder: CalendarViewBuilder;
  tDBody: TDBodyType;
};

export const CalendarMonthTemplate: React.FC<Props> = ({ builder, tDBody }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {builder.headerWeeks().map((row, i) => (
            <th key={i}>{row}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {builder.bodyWeeks().map((week, i) => (
          <tr key={i}>
            {week.map(({ dayNumber, index }) => {
              return tDBody(dayNumber, index);
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
