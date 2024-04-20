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
import React, { Dispatch, SetStateAction } from "react";
import { DraggableTableRow } from "./DraggableTableRow";
import { StaticTableRow } from "./StaticTableRow";

type Props = {
  data: Array<any>;
  setData: Dispatch<SetStateAction<Element[]>>;
};

export type Element = {
  name: string;
  standardTime: number;
  week: string;
  createdAt: string;
  thisMonthLink: string;
  nextMonthLink: string;
  monthsLink: string;
  editLink: string;
};

export const CalendarCollection2: React.FC<Props> = ({ data, setData }) => {
  const [activeName, setActiveName] = React.useState("");
  const columns: ColumnDef<Element>[] = [
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
      header: "今月",
      accessorKey: "thisMonthLink",
    },
    {
      id: "nextMonthLink",
      header: "来月",
      accessorKey: "nextMonthLink",
    },
    {
      id: "monthsLink",
      header: "月別",
      accessorKey: "monthsLink",
    },
    {
      id: "editLink",
      header: "編集",
      accessorKey: "editLink",
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
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
      >
        <table>
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
          </tbody>
        </table>
        <DragOverlay>
          {activeName && (
            <table style={{ width: "100%" }}>
              <tbody>
                {selectedRow && <StaticTableRow row={selectedRow} />}
              </tbody>
            </table>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};
