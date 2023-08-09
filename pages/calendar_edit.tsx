import type { NextPageWithLayout } from './_app'
import styles from '../styles/Home.module.css';
import Layout from '../components/layout'

const CalendarEdit: NextPageWithLayout = () => {
  return (
    <div>
      <h1>
        カレンダーの編集
      </h1>
      ここに、名前、基準時間、稼働曜日を入力するフォームを作成する。
    </div>

  )
}

export default CalendarEdit

CalendarEdit.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
