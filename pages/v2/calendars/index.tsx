import { CalendarCollection2 } from "components/calendar_collection2";
import { useCalendarCollection } from "hooks/use_calendar_collection";
import { RequiredCalendarCollection } from "layouts/required_calendar_collection";
import { RequiredUser } from "layouts/required_user";
import { Layout } from "layouts/v2";
import { CalendarDate } from "lib/calendar_date";
import type { NextPageWithLayout } from "pages/_app";
import React from "react";

const Page: NextPageWithLayout = () => {
  const { calendars } = useCalendarCollection();
  const date = CalendarDate();
  const dateOnNextMonth = date.nextMonthDate();

  const rows = calendars.map((calendar) => {
    return {
      name: calendar.name,
      standardTime: calendar.standardTime,
      week: calendar.week.format(),
      createdAt: calendar.formattedCreatedAt(),
      thisMonthLink: `/v2/calendars/all/${date.year()}/${date.month()}`,
      nextMonthLink: `/v2/calendars/all/${dateOnNextMonth.year()}/${dateOnNextMonth.month()}`,
      monthsLink: `/v2/calendars/${calendar.id}/months`,
      editLink: `/v2/calendars/${calendar.id}/edit`,
    };
  });
  const [data, setData] = React.useState(rows);

  return <CalendarCollection2 data={data} setData={setData} />;
};

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredUser>
        <RequiredCalendarCollection>{page}</RequiredCalendarCollection>
      </RequiredUser>
    </Layout>
  );
};
