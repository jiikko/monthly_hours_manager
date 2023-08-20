import { Table, Row, Col } from 'react-bootstrap';
import { JsonParameterTypeImpl } from '../lib/json_parameter';

type Props = {
  jsonObject: JsonParameterTypeImpl;
}

export const About: React.FC<Props> = ({ jsonObject }) => {
  return(
    <>
      <Row>
        月毎の基準時間を管理するアプリケーションです。<br /><br />
      </Row>

      <Row>
        <Col>
          <h2>仕組み・注意点</h2>
          <ol>
            <li>クエリパラメータのみで情報を保持しています</li>
            <li>外部サーバは使っていません</li>
            <li>認証の機構がないのでURLの取り扱いには注意してください</li>
          </ol>

          <h2>使い方</h2>
          <ol>
            <li>カレンダーの設定を入力する</li>
            <li>月を表示する</li>
            <li>時間を入力する</li>
          </ol>
        </Col>
      </Row>

      {jsonObject.hasSetting() && (
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
                  <td>{jsonObject.name}</td>
                  <td>{jsonObject.standardTime && `${jsonObject.standardTime}時間`}</td>
                  <td>{Object.keys(jsonObject.week).filter(key => jsonObject.week[key]).join(', ')}</td>
                  <td>{jsonObject.months && Object.keys(jsonObject.months)}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
  </>
)
}
