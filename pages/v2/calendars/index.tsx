import { CalendarCollection } from "components/calendar_collection";
import { useCalendarCollection } from "hooks/use_calendar_collection";
import { useCurrentUser } from "hooks/use_current_user";
import { useManageCalendar } from "hooks/use_manage_calendar";
import { RequiredCalendarCollection } from "layouts/required_calendar_collection";
import { RequiredUser } from "layouts/required_user";
import { Layout } from "layouts/v2";
import { Calendar } from "lib/calendar";
import { CalendarDate } from "lib/calendar_date";
import type { NextPageWithLayout } from "pages/_app";
import React from "react";

const Page: NextPageWithLayout = () => {
  const { calendars } = useCalendarCollection();
  const { user } = useCurrentUser();
  const { fetchCalendars } = useManageCalendar();
  const date = CalendarDate();
  const dateOnNextMonth = date.nextMonthDate();
  const convertCalendarToRow = (calendar: Calendar) => {
    return {
      name: calendar.name,
      calendar: calendar,
      standardTime: calendar.standardTime,
      week: calendar.week.format(),
      createdAt: calendar.formattedCreatedAt(),
      thisMonthLink: `/v2/calendars/all/${date.year()}/${date.month()}`,
      nextMonthLink: `/v2/calendars/all/${dateOnNextMonth.year()}/${dateOnNextMonth.month()}`,
      monthsLink: `/v2/calendars/${calendar.id}/months`,
      editLink: `/v2/calendars/${calendar.id}/edit`,
    };
  };
  const [data, setData] = React.useState(calendars.map(convertCalendarToRow));

  const fetchAndUpdateCalendars = () => {
    fetchCalendars(user).then((calendars) => {
      setData(calendars.map(convertCalendarToRow));
    });
  };

  return (
    <CalendarCollection
      data={data}
      setData={setData}
      fetchAndUpdateCalendars={fetchAndUpdateCalendars}
    />
  );
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
