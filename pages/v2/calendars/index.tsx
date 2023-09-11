import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { Button, Row, Col } from 'react-bootstrap';

const Page: NextPageWithLayout = () => {

  return (
    <>
      カレンダーの一覧を表示します
      <hr />
      <Row>
        <Col className="text-end">
          <Button href="/v2/calendars/new">新しいカレンダーを作成する</Button>
        </Col>
      </Row>
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
