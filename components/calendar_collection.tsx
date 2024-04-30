import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar } from "lib/calendar";
import { CalendarDate, CalendarDateType } from "lib/calendar_date";
import { PathGenerator } from "lib/path_generator";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { Button, Col, Nav, Row, Table } from "react-bootstrap";
import { DraggableTableRow } from "./DraggableTableRow";
import { StaticTableRow } from "./StaticTableRow";

type Props = {
  data: Array<any>;
  setData: Dispatch<SetStateAction<Element[]>>;
};

export type Element = {
  name: string;
  calendar: Calendar;
  standardTime: number;
  week: string;
  createdAt: string;
  thisMonthLink: string;
  nextMonthLink: string;
  monthsLink: string;
  editLink: string;
};

export const CalendarCollection: React.FC<Props> = ({ data, setData }) => {
  const pathGenerator = PathGenerator();
  const date = CalendarDate();
  const dateOnNextMonth = date.nextMonthDate();
  const renderMonthSummary = (calendar: Calendar, date: CalendarDateType) => {
    const days = calendar.months[date.monthlyKey()];
    if (days === undefined) {
      return null;
    }

    return (
      <>
        予定: {calculateTime([calendar], date.monthlyKey(), "totalScheduled")}
        時間
        <br />
        実績: {calculateTime([calendar], date.monthlyKey(), "totalActual")}時間
      </>
    );
  };
  const calculateTime = (
    calendars: Array<Calendar>,
    monthKey: string,
    method: string
  ): number => {
    return calendars.reduce((total, calendar) => {
      const monthTotal = calendar.sumByMonth(monthKey, method);
      return Number((total + monthTotal).toFixed(2));
    }, 0);
  };

  const [activeName, setActiveName] = React.useState("");
  const columns: ColumnDef<Element>[] = [
    {
      id: "blank",
      header: "",
      accessorKey: "blank",
    },
    {
      id: "name",
      header: "カレンダー名",
      accessorKey: "name",
    },
    {
      id: "standardTime",
      header: "標準時間",
      accessorKey: "standardTime",
    },
    {
      id: "week",
      header: "週の始まり",
      accessorKey: "week",
    },
    {
      id: "createdAt",
      header: "作成日",
      accessorKey: "createdAt",
    },
    {
      id: "thisMonthLink",
      header: function () {
        return (
          <Link
            href={`/v2/calendars/all/${date.year()}/${date.month()}`}
            className="text-decoration-underline"
          >
            今月({date.month()}月)
          </Link>
        );
      },
      accessorKey: "thisMonthLink",
      cell: function (cell) {
        return (
          <>
            <Nav.Link
              as={Link}
              href={pathGenerator.monthPathV2(
                cell.row.original.calendar.id,
                date.year(),
                date.month()
              )}
            >
              <Button variant="info">表示する</Button>
            </Nav.Link>
            {renderMonthSummary(cell.row.original.calendar, date)}
          </>
        );
      },
    },
    {
      id: "nextMonthLink",
      header: function () {
        return (
          <Link
            href={`/v2/calendars/all/${dateOnNextMonth.year()}/${dateOnNextMonth.month()}`}
            className="text-decoration-underline"
          >
            来月({dateOnNextMonth.month()}月)
          </Link>
        );
      },
      accessorKey: "nextMonthLink",
      cell: (cell) => (
        <>
          <Nav.Link
            as={Link}
            href={pathGenerator.monthPathV2(
              cell.row.original.calendar.id,
              dateOnNextMonth.year(),
              dateOnNextMonth.month()
            )}
          >
            <Button variant="info">表示する</Button>
          </Nav.Link>

          {renderMonthSummary(cell.row.original.calendar, dateOnNextMonth)}
        </>
      ),
    },
    {
      id: "monthsLink",
      header: "月別",
      accessorKey: "monthsLink",
      cell: (cell) => (
        <Link href={`/v2/calendars/${cell.row.original.calendar.id}/months`}>
          <Button>月一覧</Button>
        </Link>
      ),
    },
    {
      id: "editLink",
      header: "編集",
      accessorKey: "editLink",
      cell: (cell) => (
        <Link href={`/v2/calendars/${cell.row.original.calendar.id}/edit`}>
          <Button>編集</Button>
        </Link>
      ),
    },
  ];
  const items = React.useMemo(() => data?.map(({ name }) => name), [data]);
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const selectedRow = React.useMemo(() => {
    if (!activeName) {
      return null;
    }

    const row = table
      .getRowModel()
      .flatRows.find(({ original }) => original.name === activeName);

    return row;
  }, [activeName, table]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event: any) {
    setActiveName(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setData((data) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }

    setActiveName("");
  }

  function handleDragCancel() {
    setActiveName("");
  }

  return (
    <>
      <h1>作成したカレンダーの一覧</h1>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
      >
        <Table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableTableRow key={row.original.name} row={row} />
              ))}
            </SortableContext>
            <tr className="table-info">
              <td></td>
              <td>合計</td>
              <td>
                {data.reduce((sum, item) => sum + item.standardTime, 0)}時間
              </td>
              <td></td>
              <td></td>
              <td>
                予定:{" "}
                {calculateTime(
                  data.map((item) => item.calendar),
                  date.monthlyKey(),
                  "totalScheduled"
                )}
                時間
                <br />
                実績:{" "}
                {calculateTime(
                  data.map((item) => item.calendar),
                  date.monthlyKey(),
                  "totalActual"
                )}
                時間
              </td>
              <td>
                予定:{" "}
                {calculateTime(
                  data.map((item) => item.calendar),
                  dateOnNextMonth.monthlyKey(),
                  "totalScheduled"
                )}
                時間
                <br />
                実績:{" "}
                {calculateTime(
                  data.map((item) => item.calendar),
                  dateOnNextMonth.monthlyKey(),
                  "totalActual"
                )}
                時間
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>

        <DragOverlay>
          {activeName && (
            <Table striped bordered hover>
              <tbody>
                {selectedRow && <StaticTableRow row={selectedRow} />}
              </tbody>
            </Table>
          )}
        </DragOverlay>
      </DndContext>

      <Row>
        <Col className="text-end">
          <Link href={`/v2/calendars/new`}>
            <Button>新しいカレンダーを作成する</Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};
