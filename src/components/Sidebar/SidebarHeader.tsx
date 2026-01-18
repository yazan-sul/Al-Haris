import React from "react";
import { Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";

interface SidebarHeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  showMobileOverlay?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isOpen,
  toggleSidebar,
  isMobile = false,
  showMobileOverlay = false,
}) => {
  return (
    <div className="flex items-center justify-between p-4  border-gray-200 dark:border-gray-700">
      <Link href="/">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg shadow-teal-500/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span
            className={`font-bold text-xl text-gray-800 dark:text-white transition-all duration-300 ${
              isOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10 hidden"
            }`}
          >
            DenClinc
          </span>
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeader;
