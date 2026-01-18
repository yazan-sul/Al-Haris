"use client";

import React from "react";

type ToggleBarProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
  onLabel?: string;
  offLabel?: string;
};

const ToggleBar: React.FC<ToggleBarProps> = ({
  enabled,
  onChange,
  onLabel = "ON",
  offLabel = "OFF",
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative flex items-center w-20 h-9 rounded-full transition-colors duration-300
        ${enabled ? "bg-green-500" : "bg-gray-300"}`}
    >
      <span
        className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow-md
          transition-transform duration-300
          ${enabled ? "translate-x-11" : "translate-x-0"}`}
      />

      <span className="absolute left-2 text-xs font-semibold text-white">
        {enabled && onLabel}
      </span>

      <span className="absolute right-2 text-xs font-semibold text-gray-600">
        {!enabled && offLabel}
      </span>
    </button>
  );
};

export default ToggleBar;
