import React from "react";

export interface InfoCardProps<T = any> {
  title: string;
  /**
   * Can be:
   * - a single string
   * - an array of strings
   * - an array of objects (e.g. Subject, Genre, ProjectFormat)
   * - any React node
   */
  content: string | T[] | React.ReactNode | any;
  /**
   * When `content` is an array of objects, pick which key to display on each badge
   */
  contentKey?: keyof T;
  headerButton?: React.ReactNode;
  headerColor?: string;
  className?: string;
}

function InfoCard<T>({
  title,
  content,
  contentKey,
  headerButton,
  headerColor,
  className = "",
}: InfoCardProps<T>) {
  // Helper to extract the display label from each content item
  const getLabel = (item: any) => {
    if (typeof item === 'string') return item;
    if (contentKey && item && item[contentKey] != null) {
      return String(item[contentKey]);
    }
    // Caso especial para ProjectFormat
    if (item?.format_name) return item.format_name;
    return item?.name ?? item?.class_name ?? item?.genre ?? JSON.stringify(item);
  };

  return (
    <div className={`w-full rounded-[10px] outline outline-1 outline-[#63666A] flex flex-col overflow-hidden ${className}`}>
      <div className={`bg-rojo-intec-300 flex justify-between items-center p-2.5 ${headerColor || ''}`}>
        <h3 className="text-black text-xl font-barlow font-medium leading-[26px]">
          {title}
        </h3>
        {headerButton}
      </div>
      <div className="h-0 border-t border-[#63666A]" />
      <div className="p-2.5 bg-rojo-intec-200 font-barlow">
        {typeof content === 'string' ? (
          <p className="text-black text-base font-barlow font-normal leading-[26px]">
            {content}
          </p>
        ) : Array.isArray(content) ? (
          <div className="flex flex-wrap gap-2">
            {content.map((item, i) => (
              <div
                key={i}
                className="px-[15px] py-1 bg-white rounded-[22px] outline outline-1 outline-black flex items-center"
              >
                <span className="text-black text-xs font-barlow font-medium leading-5">
                  {getLabel(item)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // If it's already JSX/ReactNode
          <div className="w-full">{content}</div>
        )}
      </div>
    </div>
  );
}

export default InfoCard;
