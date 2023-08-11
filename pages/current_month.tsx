import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { Row, Form, Button } from 'react-bootstrap';

const CurrentMonth: NextPageWithLayout = () => {
  return(
    <>
      <h1>今月の稼働表</h1>
    </>
  )
}
export default CurrentMonth

CurrentMonth.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
