import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import Link from "next/link";

interface UserData {
  name: string;
}

interface UserProfileProps {
  isOpen: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Auth failed with status:", response.status);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUser();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Link
      href="/profile"
      className="flex flex-col items-center gap-3 px-3 py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group"
    >
      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
        <User className="w-24 h-24 text-white" />
      </div>
      <div className="flex-1 transition-all duration-300 text-center">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {user?.name || ""}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">ولي امر</p>
      </div>
    </Link>
  );
};

export default UserProfile;
