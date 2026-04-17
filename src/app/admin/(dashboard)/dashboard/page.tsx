'use client'

import { EcommerceMetrics } from '@/components/chart/EcommerceMetrics';
import OrdersByHourPyramid from '@/components/chart/OrdersByHourPyramid';
import OrderStatusPieChart from '@/components/chart/OrderStatus';
import RevenueOverview from '@/components/chart/StatisticsChart';
import { fetcherSWR } from '@/utils/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

export default function Home() {
    
    const { t } = useTranslation();
    const { data: data, isLoading: loading } = useSWR(
        process.env.NEXT_PUBLIC_HTTP_ADMIN + "dashboard/?range=30d",
        fetcherSWR
    );

    if (loading) {
        return <div>{t("Loading...")}</div>;
    }

    return (
        <div className="space-y-6">

            <EcommerceMetrics data={data} />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 lg:col-span-7">
                    <div>
                        <RevenueOverview dataParent={data} />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5">
                    <div className="h-full">
                        <OrderStatusPieChart
                            data={{
                                PENDING: data.pending.total,
                                CONFIRMED: data.confirmed.total,
                                COMPLETED: data.completed.total,
                                DELIVERING: data.delivering.total,
                                CANCELLED: data.cancelled.total,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}