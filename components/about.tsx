import { Table, Row, Col } from 'react-bootstrap';
import { Calendar } from '../lib/calendar';

type Props = {
  calendar: Calendar;
}

export const About: React.FC<Props> = ({ calendar }) => {
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
                  <td>{Object.keys(calendar.week).filter(key => calendar.week[key]).join(', ')}</td>
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
