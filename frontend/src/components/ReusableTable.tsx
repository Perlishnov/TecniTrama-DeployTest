import React from "react";

export interface ReusableTableProps {
  title?: string;
  titleIcon?: string;
  columns?: { key: string; label: any; icon?: string }[];
  data?: {
    [key: string]: any;
    label?: string;
    hasAction?: boolean;
    actionText?: string;
    actionIcon?: string;
  }[];
  onAction?: (row: any) => void;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  title = "Vacantes + Crew",
  titleIcon,
  columns = [],
  data = [],
  onAction,
}) => {
  return (
    <div className="w-full h-full flex justify-start items-start gap-6">
      <div className="flex-1 bg-red-100 flex flex-col justify-center items-start">
        {/* Table Header/Title */}
        <div className="self-stretch border border-gray-500 flex justify-start items-start gap-2.5">
          <div className="p-2.5 flex justify-center items-center gap-2.5">
            {titleIcon ? (
              <div className="w-5 h-5 relative overflow-hidden">
                <img src={titleIcon} alt="table icon" />
              </div>
            ) : null}
            <div className="text-justify flex flex-col justify-center text-black text-2xl font-medium font-barlow leading-8">
              {title}
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="self-stretch pl-10 pr-16 bg-red-200 flex justify-between items-start">
          {columns.map((column, index) => (
            <div key={index} className="p-2.5 flex justify-center items-center gap-2.5">
              {column.icon && <span className="mr-1">{column.icon}</span>}
              <div className="text-justify flex flex-col justify-center text-black text-sm font-medium font-barlow">
                {column.label}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="self-stretch h-0 border-t border-gray-500"></div>

        {/* Table Body */}
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="self-stretch pl-10 pr-16 flex justify-start items-center gap-14">
            {/* Checkbox/Selection column (if needed) */}
            {row.label && (
              <div className="w-28 overflow-hidden flex flex-col justify-center items-center">
                <div className="self-stretch p-2 overflow-hidden rounded-lg flex justify-center items-center gap-2">
                  <div className="w-6 h-6 flex justify-center items-center"></div>
                  <div className="flex-1 text-black text-base font-medium font-barlow leading-2">
                    {row.label}
                  </div>
                </div>
              </div>
            )}

            {/* Data columns */}
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="p-2.5 flex justify-end gap-2.5">
                <div className="text-justify flex flex-col justify-end text-black text-sm font-medium font-barlow leading-2">
                  {row[column.key] || "Lorem Ipsum..."}
                </div>
              </div>
            ))}

            {/* Action column */}
            {onAction && row.hasAction && (
              <div className="h-10 p-2.5 bg-red-50 border border-gray-500 flex justify-center items-center gap-2.5">
                <button
                  type="button"
                  className="text-justify flex justify-center text-black text-sm font-medium font-barlow leading-7 cursor-pointer flex-row items-center gap-1"
                  onClick={() => onAction(row)}
                >
                  {row.actionIcon && (
                    <img
                      src={row.actionIcon}
                      alt="action icon"
                      className="w-4 h-4"
                    />
                  )}
                  {row.actionText || "Invitar persona"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReusableTable;
