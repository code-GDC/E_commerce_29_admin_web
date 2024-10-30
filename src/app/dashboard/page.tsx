"use client";
import React, { useEffect, useState } from "react";
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
  TooltipItem,
} from "chart.js";
import { People, MonetizationOn, ShoppingCart } from "@mui/icons-material";
import { Bounce } from "react-awesome-reveal";
import Skeleton from '@mui/material/Skeleton'; // Import Skeleton from Material-UI

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Earnings {
  month: string;
  totalEarnings: string | null;
}

const allMonths = [
  { month: "2024-01", name: "Jan" },
  { month: "2024-02", name: "Feb" },
  { month: "2024-03", name: "Mar" },
  { month: "2024-04", name: "Apr" },
  { month: "2024-05", name: "May" },
  { month: "2024-06", name: "Jun" },
  { month: "2024-07", name: "Jul" },
  { month: "2024-08", name: "Aug" },
  { month: "2024-09", name: "Sep" },
  { month: "2024-10", name: "Oct" },
  { month: "2024-11", name: "Nov" },
  { month: "2024-12", name: "Dec" },
];

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loader"></div>
    </div>
  );
};

const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="flex items-center">
        <Skeleton variant="circular" width={56} height={56} className="mr-4" />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [totalDeals, setTotalDeals] = useState<number | null>(null);
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch("/api/getRevenue");
        if (!response.ok) throw new Error("Failed to fetch revenue");
        const data = await response.json();
        setTotalRevenue(data.totalRevenue || 0);
      } catch (error) {
        console.error("Failed to fetch total revenue:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/getUserCount");
        const data = await response.json();
        setUserCount(data.userCount);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };

    const fetchDeals = async () => {
      try {
        const response = await fetch("/api/getDeals");
        const data = await response.json();
        setTotalDeals(data.totalDeals);
      } catch (error) {
        console.error("Failed to fetch total deals:", error);
      }
    };

    const fetchEarnings = async () => {
      try {
        const response = await fetch("/api/getEarn");
        const data = await response.json();
        if (response.ok) {
          setEarnings(data.earningsPerMonth);
        } else {
          setError(data.error || "Failed to load data");
        }
      } catch (err) {
        setError("Failed to fetch earnings data");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
    fetchUserCount();
    fetchDeals();
    fetchEarnings();
  }, []);

  const earningsMap = new Map(earnings.map((earning) => [earning.month, parseFloat(earning.totalEarnings || "0")]));

  const chartData = {
    labels: allMonths.map((month) => month.name),
    datasets: [
      {
        label: "Total Earnings",
        data: allMonths.map((month) => earningsMap.get(month.month) || 0),
        fill: true,
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          color: "#333",
          callback: (value: number | string) => `${value}`,
        },
      },
      x: {
        type: 'category' as const,
        ticks: {
          color: "#333",
        },
      },
    },
    plugins: {
      legend: { position: "top" as const, labels: { color: "#333" } },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => `Rs: ${tooltipItem.raw as number}`,
        },
      },
    },
  };

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 min-h-screen text-gray-950">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Customers Card */}
        <Bounce>
          {loading ? (
            <CardSkeleton /> // Use the CardSkeleton for loading state
          ) : (
            <div className="bg-teal-100 rounded-lg shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <People className="text-5xl text-teal-700" />
                <div className="ml-4">
                  <h6 className="text-lg font-semibold">Total Customers</h6>
                  <h4 className="text-3xl font-bold">{userCount !== null ? `${userCount}` : "Loading..."}</h4>
                </div>
              </div>
            </div>
          )}
        </Bounce>

        {/* Total Revenue Card */}
        <Bounce delay={100}>
          {loading ? (
            <CardSkeleton /> // Use the CardSkeleton for loading state
          ) : (
            <div className="bg-green-100 rounded-lg shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <MonetizationOn className="text-5xl text-green-600" />
                <div className="ml-4">
                  <h6 className="text-lg font-semibold">Total Revenue</h6>
                  <h4 className="text-3xl font-bold">
  {totalRevenue !== null ? `Rs: ${Number(totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Loading..."}
</h4>


                </div>
              </div>
            </div>
          )}
        </Bounce>

        {/* Total Deals Card */}
        <Bounce delay={200}>
          {loading ? (
            <CardSkeleton /> // Use the CardSkeleton for loading state
          ) : (
            <div className="bg-yellow-100 rounded-lg shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <ShoppingCart className="text-5xl text-yellow-700" />
                <div className="ml-4">
                  <h6 className="text-lg font-semibold">Total Deals</h6>
                  <h4 className="text-3xl font-bold">{totalDeals !== null ? `${totalDeals}` : "Loading..."}</h4>
                </div>
              </div>
            </div>
          )}
        </Bounce>

        {/* Earnings Chart */}
        <div className="col-span-1 sm:col-span-3 bg-white rounded-lg shadow-lg p-6 sm:p-10 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Earnings in 2024</h3>
          <div className="relative h-96">
            {loading ? (
              <Spinner /> // Use the Spinner component here
            ) : error ? (
              <p className="text-red-600">Error loading chart: {error}</p>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
