"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: {
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    DELIVERING: number;
    CANCELLED: number;
  };
}

export default function OrderStatusPieChart({ data }: Props) {
    const series = [
        data.PENDING,
        data.CONFIRMED,
        data.COMPLETED,
        data.DELIVERING,
        data.CANCELLED,
    ];

    const options: ApexOptions = {
        chart: {
            type: "pie",
        },
        labels: ["Pending", "Confirmed", "Completed", "Delivering", "Cancelled"],
        legend: {
            position: "bottom",
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                },
            },
        ],
    };

    return (
        <div className="border border-gray-200 bg-white p-4 rounded-xl shadow h-full">
            <Chart options={options} series={series} type="pie" height={400} />
        </div>
  );
}