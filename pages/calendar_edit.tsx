import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { Container, Row } from 'react-bootstrap';

const CalendarEdit: NextPageWithLayout = () => {
  return (
    <Container>
      <Row className="justify-content-md-between">
        <h1>
          カレンダーの編集
        </h1>
        ここに、名前、基準時間、稼働曜日を入力するフォームを作成する。
      </Row>
    </Container>
  )
}

export default CalendarEdit

CalendarEdit.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
