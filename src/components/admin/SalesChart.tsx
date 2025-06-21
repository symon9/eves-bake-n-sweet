"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesData {
  _id: string; // Date string e.g., "2023-10-27"
  totalSales: number;
}

const SalesChart = ({
  salesData,
  range,
}: {
  salesData: SalesData[];
  range: string;
}) => {
  const generateChartData = () => {
    const labels: string[] = [];
    const dataPoints: number[] = [];
    const salesMap = new Map(salesData.map((d) => [d._id, d.totalSales]));

    let days = 7;
    if (range === "30d") days = 30;
    if (range === "90d") days = 90;
    if (range === "1y") days = 365;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0]; // YYYY-MM-DD format

      let labelFormat: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      if (range === "1y") {
        labelFormat = { month: "short" };
      }

      labels.push(d.toLocaleDateString("en-US", labelFormat));
      dataPoints.push(salesMap.get(dateString) || 0);
    }
    return { labels, dataPoints };
  };

  const { labels, dataPoints } = generateChartData();

  const data = {
    labels,
    datasets: [
      {
        label: "Sales (₦)",
        data: dataPoints,
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ec4899",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#ec4899",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) => `₦${Number(value) / 1000}k`,
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default SalesChart;
