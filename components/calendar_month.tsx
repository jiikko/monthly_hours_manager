import { CalendarMonthTemplate } from "components/calendar_month_template";
import { Week } from "lib/calendar";
import { CalendarDate } from "lib/calendar_date";
import { CalendarMonthData } from "lib/calendar_month_data";
import { CalendarMonthView } from "lib/calendar_month_view";
import { Badge, FloatingLabel, Form } from "react-bootstrap";

type MonthProps = {
  year: number;
  month: number;
  monthDataList: Array<CalendarMonthData>;
  workingWeek: Week;
  handleUpdateDay: (
    attributeName: string,
    value: boolean | string,
    dayIndex: number,
    onlyUpdateState: boolean
  ) => void;
};

export const CalendarMonth: React.FC<MonthProps> = ({
  year,
  month,
  workingWeek,
  handleUpdateDay,
  monthDataList,
}) => {
  const builder = new CalendarMonthView(year, month);
  const tDBody = (dayNumber: number | null, index: number) => {
    if (dayNumber === null) {
      return <td key={index}></td>;
    }

    const dayIndex = dayNumber - 1;
    const calendarDate = CalendarDate(year, month, dayNumber);
    const day = monthDataList[0].days[dayIndex]; // NOTE: ここでは1つのカレンダーのみ入ってくるので、0番目を参照する
    let tdClassName = workingWeek[calendarDate.weekDayName()]
      ? "bg-info"
      : "bg-secondary text-light";
    if (Number(day.actual)) {
      tdClassName = "bg-success text-light";
    }
    if (day.isHoliday) {
      tdClassName = "bg-secondary text-light";
    }
    if (day.isInvalid()) {
      tdClassName = "bg-warning text-light";
    }

    const renderTodayLabel = () => {
      return (
        <Badge bg="danger" className="m-1">
          {renderNotTodayLabel()}
        </Badge>
      );
    };
    const renderNotTodayLabel = () => {
      return (
        <>
          {calendarDate.day()}日{calendarDate.isNationalHoliday() && "(祝)"}
        </>
      );
    };

    return (
      <td key={index} className={tdClassName}>
        <div>
          {calendarDate.isToday() ? renderTodayLabel() : renderNotTodayLabel()}
        </div>
        <br />
        <Form>
          <Form.Check
            type="switch"
            checked={day.isHoliday}
            name={"isHoliday"}
            label="稼働対象外"
            className="m-1"
            onChange={(e) =>
              handleUpdateDay("isHoliday", e.target.checked, dayIndex, false)
            }
          />
          {day.isWorkingDay() && (
            <>
              <FloatingLabel
                controlId="floatingInput"
                label="予定"
                className="mb-2"
              >
                <Form.Control
                  type="text"
                  value={day.scheduled}
                  name={"scheduled"}
                  onBlur={(e) =>
                    handleUpdateDay(
                      "scheduled",
                      e.target.value,
                      dayIndex,
                      false
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  onChange={(e) =>
                    handleUpdateDay("scheduled", e.target.value, dayIndex, true)
                  }
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingInput" label="実績">
                <Form.Control
                  type="text"
                  value={day.actual}
                  name={"actual"}
                  onBlur={(e) =>
                    handleUpdateDay("actual", e.target.value, dayIndex, false)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  onChange={(e) =>
                    handleUpdateDay("actual", e.target.value, dayIndex, true)
                  }
                />
              </FloatingLabel>
            </>
          )}
        </Form>
      </td>
    );
  };

  return <CalendarMonthTemplate builder={builder} tDBody={tDBody} />;
};
