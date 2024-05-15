import { RequiredCalendar } from "layouts/required_calendar";
import { RequiredUser } from "layouts/required_user";
import { Layout } from "layouts/v2";
import { Today } from "lib/calendar_date";
import type { GetStaticProps, NextPage } from "next";
import { ReactElement, ReactNode } from "react";

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const Page: NextPageWithLayout = () => {
  return <div>Redirecting...</div>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const todayDate = Today();
  const year = todayDate.year();
  const month = todayDate.month();

  const { calendar_id } = context.params as { calendar_id: string };

  return {
    redirect: {
      destination: `/v2/calendars/${calendar_id}/${year}/${month}`,
      permanent: false,
    },
    revalidate: 60,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

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
