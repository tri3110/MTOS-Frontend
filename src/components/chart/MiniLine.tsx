'use client';

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: number[];
  color?: string;
};

export default function MiniLineChart({ data, color = "#3b82f6" }: Props) {

    const options: ApexOptions = {
        chart: {
            type: "line",
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
            },
            colors: [color],
            tooltip: {
            enabled: true,
        },
    };

    const series = [
        {
            name: "Revenue",
            data: data,
        },
    ];

    return (
        <Chart
            options={options}
            series={series}
            type="line"
            height={50}
        />
    );
}