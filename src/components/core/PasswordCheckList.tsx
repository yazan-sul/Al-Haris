import { CheckCircle2, Circle } from "lucide-react";

export const PasswordChecklist = ({ password }: { password: string }) => {
  const rules = [
    { label: "8 أحرف على الأقل", met: password.length >= 8 },
    { label: "حرف كبير واحد على الأقل (A-Z)", met: /[A-Z]/.test(password) },
    {
      label: "رمز خاص واحد على الأقل (!@#$)",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="h-[80px] mt-2  transition-all duration-300">
      <div
        className={`space-y-1.5 border-t border-gray-100 pt-2 transition-opacity duration-500 ${password.length > 0}`}
      >
        {rules.map((rule, i) => (
          <div
            key={i}
            className={`flex items-center justify-end gap-2 text-xs transition-colors duration-300 ${
              rule.met ? "text-green-600 font-medium" : "text-gray-400"
            }`}
          >
            <span>{rule.label}</span>
            {rule.met ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 transition-transform scale-110" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
