import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, Row } from "@tanstack/react-table";
import { Element } from "./calendar_collection2";

type Props = {
  row: Row<Element>;
};

export const DraggableTableRow = ({ row }: Props) => {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.name,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  return (
    <tr ref={setNodeRef} style={style} key={row.id}>
      {isDragging ? (
        <td colSpan={row.getAllCells().length}>&nbsp;</td>
      ) : (
        row.getVisibleCells().map((cell, i) => {
          if (i === 0) {
            return (
              <td key={cell.id}>
                <div {...attributes} {...listeners}>!11111!!</div>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          }
          return (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        })
      )}
    </tr>
  );
};
