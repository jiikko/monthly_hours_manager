import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { useRouter } from 'next/router';
import { JsonParameter, Week } from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { SettingForm } from '../components/setting_form';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));

  const handleSubmit = (name: string, standardTime: number, workingWeek: Week, notify: (message: string) => void) => {
    jsonObject.name = name;
    jsonObject.standardTime = standardTime;
    jsonObject.week = workingWeek;
    const editPath = PathGenerator().editPath(jsonObject.serializeAsJson());
    router.push(editPath, undefined, { scroll: false });
    notify('カレンダー情報の変更に成功しました。')
  };

  return (
    <SettingForm jsonObject={jsonObject} handleSubmit={handleSubmit} />
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}
