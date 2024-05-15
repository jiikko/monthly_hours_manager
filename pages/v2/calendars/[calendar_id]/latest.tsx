import { RequiredCalendar } from "layouts/required_calendar";
import { RequiredUser } from "layouts/required_user";
import { Layout } from "layouts/v2";
import { Today } from "lib/calendar_date";
import { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "pages/_app";

const Page: NextPageWithLayout = () => {
  return <div>Redirecting...</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const todayDate = Today();
  const year = todayDate.year();
  const month = todayDate.month();

  const { calendar_id } = context.params;

  return {
    redirect: {
      destination: `/v2/calendars/${calendar_id}/${year}/${month}`,
      permanent: false,
    },
  };
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredUser>
        <RequiredCalendar>{page}</RequiredCalendar>
      </RequiredUser>
    </Layout>
  );
};

export default Page;
