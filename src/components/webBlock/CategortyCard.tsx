import React from "react";

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
  const categoryData: Record<
    string,
    { name: string; icon: string; description: string }
  > = {
    adult: {
      name: "محتوى للبالغين",
      icon: "🔞",
      description: "حظر المحتوى الإباحي والمواد غير اللائقة",
    },
    gambling: {
      name: "المقامرة",
      icon: "🎰",
      description: "حظر مواقع القمار والرهان",
    },
    violence: {
      name: "العنف",
      icon: "⚔️",
      description: "حظر المحتوى العنيف والدموي",
    },
    games: {
      name: "الألعاب",
      icon: "🎮",
      description: "حظر مواقع وتطبيقات الألعاب",
    },
    chat: {
      name: "الدردشة",
      icon: "💬",
      description: "حظر منصات الدردشة والمحادثات",
    },
  };

  const data = categoryData[category] || {
    name: category,
    icon: "📱",
    description: "فئة محظورة",
  };

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
            <span className="text-2xl">{data.icon}</span>
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

        {/* Toggle Switch */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isEnabled ? "bg-red-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                isEnabled ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
