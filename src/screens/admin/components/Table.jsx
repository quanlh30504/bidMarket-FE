import React from "react";
import { TableItem } from "./TableItem";

export const Table = ({ items, sortOptions, sortFuntion }) => {
  if (items.length === 0) return null;

  // get all fields from the first item
  const fields = Object.keys(items[0])
    .filter((field) => !field.startsWith("hidden_"))
    .map((field) => field.charAt(0).toUpperCase() + field.slice(1)
  );
  
  return (
    <div className="p-5 border rounded-xl relative">
      {sortOptions && sortOptions.length > 0 && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <label>Sorted by:</label>
          <select
            className="ml-2 p-1 font-bold border rounded-lg"
            onChange={(event) => {
              const selectedValue = event.target.value;
              sortFuntion(selectedValue);
            }}
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <table className="w-full text-center border-collapse mt-10">
        <thead>
          <tr className="border-b">
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <TableItem key={index} item={item}/>
          ))}
        </tbody>
      </table>
    </div>
  );
};
