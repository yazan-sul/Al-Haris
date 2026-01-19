import React from "react";

type CardProps = {
  label: string;
  icon: React.ReactNode;
  result?: string | number;
};

const Card: React.FC<CardProps> = ({ label, icon, result }) => {
  return (
    <div className="flex  items-center gap-4 p-8 rounded-xl bg-white shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>

        {result && (
          <span className="text-lg font-bold text-gray-900 leading-tight">
            {result}
          </span>
        )}
      </div>
      <div className="text-2xl text-gray-600">{icon}</div>
    </div>
  );
};

export default Card;
