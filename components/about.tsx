import { Table, Row, Col } from "react-bootstrap";
import { Calendar } from "../lib/calendar";
import { AboutWithoutSetting } from "components/v1_about_without_setting";

type Props = {
  calendar: Calendar;
};

export const About: React.FC<Props> = ({ calendar }) => {
  const weekDayMapping = {
    sun: "日曜日",
    mon: "月曜日",
    tue: "火曜日",
    wed: "水曜日",
    thu: "木曜日",
    fri: "金曜日",
    sat: "土曜日",
  };
  const weekDayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return (
    <>
      <AboutWithoutSetting />
      {calendar.hasSetting() && (
        <Row>
          <Col>
            <h2 className="mb-3">現在の設定情報</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>名前</th>
                  <th>基準時間</th>
                  <th>稼働曜日</th>
                  <th>管理対象の月</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{calendar.name}</td>
                  <td>
                    {calendar.standardTime && `${calendar.standardTime}時間`}
                  </td>
                  <td>
                    {weekDayOrder
                      .filter((key) => calendar.week[key])
                      .map((key) => weekDayMapping[key])
                      .join(", ")}
                  </td>
                  <td>
                    <ul>
                      {calendar.months &&
                        Object.keys(calendar.months).map((key, _index) => (
                          <li className="br-after" key={key}>
                            {key}
                          </li>
                        ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </>
  );
};
