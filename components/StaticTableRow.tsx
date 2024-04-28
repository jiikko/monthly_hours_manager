import { flexRender, Row } from "@tanstack/react-table";
import { Element } from "./calendar_collection2";

type Props = {
  row: Row<Element>;
};

export const StaticTableRow = ({ row }: Props) => {
  return (
    <tr>
      {row.getVisibleCells().map((cell, i) => {
        if (i === 0) {
          return (
            <td key={cell.id}>
              <div>↕️</div>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        }
        return (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
};
