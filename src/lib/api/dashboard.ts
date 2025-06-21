export const getDashboardStats = async (range: string): Promise<any> => {
  const res = await fetch(`/api/dashboard-stats?range=${range}`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats.");
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || "API returned an error for dashboard stats.");
  }
  return data.data;
};
