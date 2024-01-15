import { CalendarMonthsTable } from "components/calendar_months_table";
import { CalendarContext } from "contexts/calendar_context";
import { useCurrentUser } from "hooks/use_current_user";
import { useManageCalendar } from "hooks/use_manage_calendar";
import { RequiredCalendar } from "layouts/required_calendar";
import { RequiredUser } from "layouts/required_user";
import { Layout } from "layouts/v2";
import { Calendar } from "lib/calendar";
import type { NextPageWithLayout } from "pages/_app";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const Page: NextPageWithLayout = () => {
  const { user } = useCurrentUser();
  const { calendar } = useContext(CalendarContext);
  const { updateMonths, setCalendar } = useManageCalendar();
  const handleDeleteCalendarMonth = async (monthKey: string) => {
    const result = confirm("月を削除しますか？");
    if (!result) {
      return;
    }

    delete calendar.months[monthKey];
    await updateMonths(calendar, user, monthKey);
    setCalendar((calendar) => {
      return { ...calendar } as Calendar;
    });
    toast(`${monthKey}を削除しました`);
  };

  return (
    <CalendarMonthsTable
      calendar={calendar}
      handleDeleteCalendarMonth={handleDeleteCalendarMonth}
    />
  );
};

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredUser>
        <RequiredCalendar>{page}</RequiredCalendar>
      </RequiredUser>
    </Layout>
  );
};
