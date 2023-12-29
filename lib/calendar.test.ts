import { Calendar, Week } from "./calendar";

describe("Calendar", () => {
  describe("sortByMonthKey", () => {
    describe("月の昇順に並び替える", () => {
      it("monthsがundefinedのとき", () => {
        const calendar = new Calendar("hoge", 84, Week.create(), undefined);
        expect(calendar.name).toBe("hoge");
        expect(calendar.standardTime).toBe(84);
        expect(calendar.week.tue).toBe(false);
        expect(calendar.week.wed).toBe(false);
        calendar.sortByMonthKey();
        expect(calendar.months).toBe(undefined);
      });

      it("monthsが空オブジェクトのとき", () => {
        const calendar = new Calendar("name", 84, Week.create(), {});
        expect(calendar.name).toBe("name");
        expect(calendar.standardTime).toBe(84);
        expect(calendar.week.tue).toBe(false);
        expect(calendar.week.wed).toBe(false);
        calendar.sortByMonthKey();
        expect(calendar.months).toStrictEqual({});
      });

      it("monthsが1つ要素を持つオブジェクトのとき", () => {
        const calendar = new Calendar("hoge", 84, Week.create(), {
          "2013-1": [],
        });
        expect(calendar.name).toBe("hoge");
        expect(calendar.standardTime).toBe(84);
        expect(calendar.week.tue).toBe(false);
        expect(calendar.week.wed).toBe(false);
        calendar.sortByMonthKey();
        expect(calendar.months).toStrictEqual({ "2013-1": [] });
      });

      it("monthsが複数要素を持つオブジェクトのとき", () => {
        const calendar = new Calendar("hoge", 84, Week.create(), {
          "2013-12": [],
          "2013-1": [],
        });
        expect(calendar.name).toBe("hoge");
        expect(calendar.standardTime).toBe(84);
        expect(calendar.week.tue).toBe(false);
        expect(calendar.week.wed).toBe(false);
        calendar.sortByMonthKey();
        expect(Object.keys(calendar.months)).toStrictEqual(["2013-1", "2013-12"]);
      });
    });
  });
});
