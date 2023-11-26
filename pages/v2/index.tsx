import { AboutWithoutSetting } from "components/v1_about_without_setting";
import { Layout } from "../../layouts/v2";
import type { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return <AboutWithoutSetting />;
};

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
