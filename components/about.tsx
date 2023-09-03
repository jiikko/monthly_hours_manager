import { Table, Row, Col } from 'react-bootstrap';
import { Calendar } from '../lib/calendar';

type Props = {
  calendar: Calendar;
}

export const About: React.FC<Props> = ({ calendar }) => {
  const weekDayMapping = {
    "sun": "日曜日",
    "mon": "月曜日",
    "tue": "火曜日",
    "wed": "水曜日",
    "thu": "木曜日",
    "fri": "金曜日",
    "sat": "土曜日"
  };
  const weekDayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return(
    <>
      <Row className='mb-3'>
        月の時間を管理するアプリケーションです。<br />
        <a href='https://zenn.dev/jiikko/articles/43ee218a624a6a' target='_blank' className='text-decoration-underline'>詳細はこちら</a>
      </Row>

      <Row>
        <Col>
          <h2>機能説明</h2>
          <ol>
            <li>非ログイン時は、クエリパラメータでカレンダーデータを保持します</li>
            <li>ログインすることで、カレンダーデータをクラウドに保存します</li>
            <li>保存先に関係なく、1ヶ月分のカレンダーデータのみを保存します</li>
          </ol>

          <h2>使い方</h2>
          <ol>
            <li>カレンダーの設定を入力する</li>
            <li>月を表示する</li>
            <li>時間を入力する</li>
          </ol>
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col>
          <h2>更新履歴</h2>
          <ul>
            <li>2023/09/3: 認証機能, クラウド保存機能の公開</li>
            <li>2023/08/15: リリース</li>
          </ul>
        </Col>
      </Row>

      {calendar.hasSetting() && (
        <Row>
          <Col>
            <h2 className='mb-3'>現在の設定情報</h2>
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
                  <td>{calendar.standardTime && `${calendar.standardTime}時間`}</td>
                  <td>
                    {weekDayOrder.filter(key => calendar.week[key]).map(key => weekDayMapping[key]).join(', ')}
                  </td>
                  <td>
                    <ul>
                      {calendar.months && Object.keys(calendar.months).map((key, _index) => (
                        <li className="br-after" key={key}>{key}</li>
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
  )
}
