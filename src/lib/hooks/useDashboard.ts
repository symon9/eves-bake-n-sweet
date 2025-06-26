import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboard";

export const useGetDashboardStats = (range: string) => {
  return useQuery({
    queryKey: ["dashboardStats", range],
    queryFn: keepPreviousData(() => getDashboardStats(range)),
  });
};
