"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { CalendarIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { fetcherSWR } from "@/lib/helpers";
import { formatNumber } from "@/lib/helpers";
import { API_BASE_URLS } from "@/lib/constants";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
    dataParent: any;
};

export default function RevenueOverview({ dataParent }: Props) {
    const datePickerRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState(
        API_BASE_URLS.ADMIN + "dashboard/"
    );

    const { data, isLoading } = useSWR(url, fetcherSWR);

    useEffect(() => {
        if (!datePickerRef.current) return;

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        flatpickr(datePickerRef.current, {
            mode: "range",
            static: true,
            dateFormat: "M d",
            defaultDate: [sevenDaysAgo, today],
            onChange: (selectedDates) => {
                if (selectedDates.length === 2) {
                    const from = selectedDates[0].toISOString().slice(0, 10);
                    const to = selectedDates[1].toISOString().slice(0, 10);
                    setUrl(
                        `${API_BASE_URLS.ADMIN}dashboard/?from=${from}&to=${to}`
                    );
                }
            },
        });
    }, []);

    const options: ApexOptions = {
        chart: {
            type: "area",
            height: 320,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif",
        },
        colors: ["#465FFF", "#22C55E"],
        stroke: {
            curve: "smooth",
            width: [2, 0],
        },
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 4,
            },
        },
        fill: {
            type: ["gradient", "solid"],
            gradient: {
                opacityFrom: 0.4,
                opacityTo: 0,
            },
            opacity: [1, 0.9]
        },
        grid: {
            borderColor: "#E5E7EB",
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data?.categories || [],
        },
        yaxis: [
            {
                title: {
                    text: "Revenue",
                },
                labels: {
                    formatter: (val) => formatNumber(val.toString()),
                },
            },
            {
                opposite: true,
                title: {
                    text: "Orders",
                },
            },
        ],
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
    };

    const series = [
        {
            name: "Revenue",
            data: data?.revenue.series || [],
            type: "area",
        },
        {
            name: "Orders",
            data: data?.orders.series || [],
            type: "bar",
        },
    ];

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div>
              <h2 className="text-lg font-semibold text-gray-800">
                  Revenue Overview
              </h2>
          </div>
          <div className="relative">
              <CalendarIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                  ref={datePickerRef}
                  className="h-10 w-full pl-9 pr-3 border rounded-lg text-sm"
                  placeholder="Select date"
              />
          </div>
        </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-2 rounded-xl bg-gray-50 flex gap-2 items-center">
                <p className="text-sm text-gray-500">Revenue: </p>
                <h3 className="text-xl font-bold text-gray-800">
                    {formatNumber(data?.revenue.total)}
                </h3>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 flex gap-2 items-center">
                <p className="text-sm text-gray-500">Orders: </p>
                <h3 className="text-xl font-bold text-gray-800">
                    {formatNumber(data?.orders.total)}
                </h3>
            </div>
          </div>
          <Chart
              options={options}
              series={series}
              type="area"
              height={320}
          />
      </div>
    );
}