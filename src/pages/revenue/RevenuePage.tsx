import React, { useState, useEffect, useRef } from "react";
import { fetchRevenue, RevenueType, RevenueItem } from "../../services/revenueService";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Chart
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

const RevenuePage: React.FC = () => {
    const [type, setType] = useState<RevenueType>("monthly");
    const [year, setYear] = useState<number>(currentYear);
    const [data, setData] = useState<RevenueItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const chartRef = useRef<Chart<"bar", number[], string> | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                const result = await fetchRevenue(type, year);
                setData(result);
            } catch (err: any) {
                setError(err.message || "Error");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [type, year]);

    function onRowClick(item: RevenueItem) {
        if (type === "monthly") {
            navigate(`/dashboard/revenue/detail/${year}/${item.month}`);
        } else if (type === "quarterly") {
            navigate(`/dashboard/revenue/detail-quarter/${year}/${item.quarter}`);
        } else {
            navigate(`/dashboard/revenue/detail-year/${item.year}`);
        }
    }

    function renderTable() {
        if (data.length === 0) {
            return <div className="text-center py-4">Không có dữ liệu</div>;
        }

        let headerLabel = "";
        switch (type) {
            case "monthly":
                headerLabel = "Tháng";
                break;
            case "quarterly":
                headerLabel = "Quý";
                break;
            case "yearly":
                headerLabel = "Năm";
                break;
        }

        return (
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">{headerLabel}</th>
                        <th className="border px-4 py-2 text-right">Doanh Thu (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr
                            key={idx}
                            className={`cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-100`}
                            onClick={() => onRowClick(item)}
                        >
                            <td className="border px-4 py-2">
                                {type === "monthly"
                                    ? item.month
                                    : type === "quarterly"
                                        ? item.quarter
                                        : item.year}
                            </td>
                            <td className="border px-4 py-2 text-right">
                                {Number(item.totalRevenue).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const chartData = {
        labels: data.map((item) =>
            type === "monthly"
                ? `Tháng ${item.month}`
                : type === "quarterly"
                    ? `Quý ${item.quarter}`
                    : `${item.year}`
        ),
        datasets: [
            {
                label: "Doanh thu (VNĐ)",
                data: data.map((item) => Number(item.totalRevenue)),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: {
                display: true,
                text: "Biểu đồ doanh thu",
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return context.parsed.y.toLocaleString("vi-VN") + " ₫";
                    },
                },
            },
        },
        scales: {
            x: {
                type: "category" as const,
                barPercentage: 0.3,
                categoryPercentage: 0.3,
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        return value.toLocaleString("vi-VN") + " ₫";
                    },
                },
            },
        },
    };

    const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const chart = chartRef.current;
        if (!chart) return;

        const points = chart.getElementsAtEventForMode(
            event.nativeEvent,
            "nearest",
            { intersect: true },
            false
        );

        if (points.length > 0) {
            const firstPoint = points[0];
            const idx = firstPoint.index;
            const item = data[idx];
            if (!item) return;

            if (type === "monthly") {
                navigate(`/dashboard/revenue/detail/${year}/${item.month}`);
            } else if (type === "quarterly") {
                navigate(`/dashboard/revenue/detail-quarter/${year}/${item.quarter}`);
            } else {
                navigate(`/dashboard/revenue/detail-year/${item.year}`);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Thống kê doanh thu</h1>

            <div className="flex flex-wrap gap-6 mb-8">
                <div>
                    <label htmlFor="type" className="block mb-2 font-semibold text-gray-700">
                        Loại thống kê
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as RevenueType)}
                        className="border rounded px-4 py-2"
                    >
                        <option value="monthly">Theo tháng</option>
                        <option value="quarterly">Theo quý</option>
                        <option value="yearly">Theo năm</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="year" className="block mb-2 font-semibold text-gray-700">
                        Năm
                    </label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="border rounded px-4 py-2"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto mb-8">
                {loading ? <p className="text-center py-6">Đang tải dữ liệu...</p> : renderTable()}
            </div>

            {!loading && data.length > 0 && (
                <div className="mb-8">
                    <Bar
                        ref={chartRef}
                        data={chartData}
                        options={chartOptions}
                        onClick={handleChartClick}
                    />
                </div>
            )}

            {error && (
                <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>
            )}
        </div>
    );
};

export default RevenuePage;
