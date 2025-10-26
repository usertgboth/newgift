import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdminContextType {
  isAdmin: boolean;
  userId: string | null;
  setAdminActivated: () => void;
  clearAdminData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminActivated, setAdminActivatedState] = useState(() => {
    return localStorage.getItem('adminActivated') === 'true';
  });

  const { data: adminStatus } = useQuery({
    queryKey: ['/api/admin/me'],
    enabled: adminActivated,
    retry: false,
    queryFn: async () => {
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const telegramId = telegramUser?.id?.toString() || '';
      
      const res = await apiRequest('GET', '/api/admin/me', undefined, {
        'x-telegram-id': telegramId
      });
      return res.json();
    },
  });

  const isAdmin = adminStatus?.isAdmin || false;
  const userId = adminStatus?.user?.id || null;

  const setAdminActivated = () => {
    setAdminActivatedState(true);
    localStorage.setItem('adminActivated', 'true');
  };

  const clearAdminData = () => {
    setAdminActivatedState(false);
    localStorage.removeItem('adminActivated');
  };

  useEffect(() => {
    if (adminActivated && !isAdmin && adminStatus !== undefined) {
      clearAdminData();
    }
  }, [isAdmin, adminStatus, adminActivated]);

  return (
    <AdminContext.Provider value={{ isAdmin, userId, setAdminActivated, clearAdminData }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
