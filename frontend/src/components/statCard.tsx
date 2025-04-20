// src/components/StatCard.tsx
import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon , className}) => (
  <div className={`flex-1 bg-rojo-intec-100 p-6 rounded-2xl flex items-center justify-between gap-4`}>
    <div className="sm:order-2 md:order-1 flex flex-col justify-center items-start">
        <div className="text-Gris-500 font-medium text-sm">{label}</div>
        <div className="text-3xl font-semibold">{value}</div>
    </div>
    {icon && <img src={icon} alt={label} className={`mb-2 ${className} rounded-full sm:order-1 md:order-2`}/>}
  </div>
);

export default StatCard;
