import React from "react";
import { EyeOff, Dice1, Zap, Gamepad, MessageSquare } from "lucide-react";

interface CategoryCardProps {
  category: string;
  isEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function CategoryCard({
  category,
  isEnabled,
  onToggle,
  disabled = false,
}: CategoryCardProps) {
  // Use lucide-react components instead of emojis
  const categoryData: Record<
    string,
    { name: string; icon: React.ElementType; description: string }
  > = {
    adult: {
      name: "محتوى للبالغين",
      icon: EyeOff,
      description: "حظر المحتوى الإباحي والمواد غير اللائقة",
    },
    gambling: {
      name: "المقامرة",
      icon: Dice1,
      description: "حظر مواقع القمار والرهان",
    },
    violence: {
      name: "العنف",
      icon: Zap,
      description: "حظر المحتوى العنيف والدموي",
    },
    games: {
      name: "الألعاب",
      icon: Gamepad,
      description: "حظر مواقع وتطبيقات الألعاب",
    },
    chat: {
      name: "الدردشة",
      icon: MessageSquare,
      description: "حظر منصات الدردشة والمحادثات",
    },
  };

  const data = categoryData[category] || {
    name: category,
    icon: Gamepad, // fallback icon
    description: "فئة محظورة",
  };

  const Icon = data.icon;

  return (
    <div
      onClick={disabled ? undefined : onToggle}
      className={`rounded-xl border-2 p-5 transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        isEnabled
          ? "border-red-500 bg-red-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-start">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              <Icon />
            </span>
            <h3 className="font-bold text-lg">{data.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">{data.description}</p>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isEnabled
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {isEnabled ? "● محظور" : "○ غير محظور"}
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          onClick={() => !isEnabled}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300
        ${isEnabled ? "bg-red-500" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300
          ${isEnabled ? "translate-x-7" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
  );
}
