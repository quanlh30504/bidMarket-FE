import React from "react";

export const TableItem = ({ item }) => {
  const { ...fields } = item;

  return (
    <tr className="mt-2 border-t border-b">
      {Object.values(fields).map((value, index) => (
        <td key={index} className="p-2">
          {value}
        </td>
      ))}

      {fields.status && ( //status field
        <td className="p-2">
          <span
            className={`px-3 py-1 rounded-2xl ${
              fields.status === "Unpaid"
                ? "bg-red-500 text-red-100"
                : "bg-green-100 text-green-500"
            }`}
          >
            {fields.status}
          </span>
        </td>
      )}
    </tr>
  );
};
