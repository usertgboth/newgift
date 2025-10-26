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
      console.log('AdminContext checking admin status');
      
      const res = await apiRequest('GET', '/api/admin/me');
      const data = await res.json();
      console.log('Admin status response:', data);
      return data;
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
