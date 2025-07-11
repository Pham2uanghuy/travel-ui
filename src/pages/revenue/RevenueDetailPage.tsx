import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRevenue, RevenueItem } from "../../services/revenueService";
import { getCustomerById } from "../../services/customer";

interface Transaction {
    id: number;
    amount: number;
    method: string;
    date: string;
    tax: number;
    discount: number;
    customerId: number;
    employeeId: number;
    tourBookingId: number;
}

interface RevenueDetail {
    month: number;
    transactionCount: number;
    customerCount: number;
    transactions: Transaction[];
    totalRevenue: number;
}

const RevenueDetailPage: React.FC = () => {
    const { year, month } = useParams<{ year: string; month: string }>();
    const [details, setDetails] = useState<RevenueDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filterMethod, setFilterMethod] = useState("all");
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [customerNames, setCustomerNames] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        async function loadCustomerNames(transactions: Transaction[]) {
            const uniqueCustomerIds = Array.from(new Set(transactions.map(tx => tx.customerId)));
            console.log("Unique Customer IDs:", uniqueCustomerIds);
            const nameMap: { [key: number]: string } = {};

            await Promise.all(uniqueCustomerIds.map(async (id) => {
                try {
                    const customer = await getCustomerById(id);
                    nameMap[id] = customer.fullname;
                } catch {
                    nameMap[id] = "Không xác định";
                }
            }));

            setCustomerNames(nameMap);
        }

        async function loadDetail() {
            if (!year || !month) return;

            setLoading(true);
            setError("");

            try {
                const revenueItems: RevenueItem[] = await fetchRevenue("monthly", Number(year));
                const mappedData: RevenueDetail[] = revenueItems
                    .filter(item => typeof item.month === "number")
                    .map(item => ({
                        month: item.month as number,
                        transactionCount: item.transactionCount ?? 0,
                        customerCount: item.customerCount ?? 0,
                        transactions: item.transactions ?? [],
                        totalRevenue: item.totalRevenue ?? 0,
                    }));
                const filtered = mappedData.find(item => item.month === Number(month));
                if (filtered) {
                    setDetails(filtered);
                    setFilteredTransactions(filtered.transactions);
                    setFilterMethod("all");
                    await loadCustomerNames(filtered.transactions);
                } else {
                    setDetails(null);
                    setFilteredTransactions([]);
                }
            } catch (err: any) {
                setError(err.message || "Lỗi tải dữ liệu chi tiết");
            } finally {
                setLoading(false);
            }
        }

        loadDetail();
    }, [year, month]);

    const applyFilters = () => {
        if (!details) return;
        const result = details.transactions.filter(t =>
            filterMethod === "all" || t.method.trim().toLowerCase() === filterMethod.trim().toLowerCase()
        );
        setFilteredTransactions(result);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Chi tiết doanh thu tháng {month} năm {year}
            </h1>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && !details && <p>Không có dữ liệu chi tiết</p>}

            {!loading && !error && details && (
                <>
                    <div className="mb-4">
                        <p><strong>Số giao dịch:</strong> {details.transactionCount}</p>
                        <p><strong>Số khách hàng:</strong> {details.customerCount}</p>
                        <p><strong>Tổng doanh thu:</strong>{" "}
                            {details.totalRevenue.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </p>
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                        <label htmlFor="methodFilter" className="font-semibold">Lọc theo phương thức:</label>
                        <select
                            id="methodFilter"
                            value={filterMethod}
                            onChange={e => setFilterMethod(e.target.value)}
                            className="border rounded p-1"
                        >
                            <option value="all">Tất cả</option>
                            <option value="Tiền mặt">Tiền mặt</option>
                            <option value="Chuyển khoản">Chuyển khoản</option>
                            <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                        </select>
                        <button
                            onClick={applyFilters}
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                            Lọc
                        </button>
                    </div>

                    <table className="min-w-full border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">Ngày</th>
                                <th className="border px-4 py-2 text-left">Khách hàng</th>
                                <th className="border px-4 py-2 text-left">Phương thức</th>
                                <th className="border px-4 py-2 text-right">Số tiền (VNĐ)</th>
                                <th className="border px-4 py-2 text-right">Thuế (VNĐ)</th>
                                <th className="border px-4 py-2 text-right">Giảm giá (VNĐ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-4">
                                        Không có giao dịch phù hợp
                                    </td>
                                </tr>
                            )}
                            {filteredTransactions.map((tx, idx) => (
                                <tr key={tx.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="border px-4 py-2">{new Date(tx.date).toLocaleDateString("vi-VN")}</td>
                                    <td className="border px-4 py-2">{customerNames[tx.customerId] ?? "Đang tải..."}</td>
                                    <td className="border px-4 py-2">{tx.method}</td>
                                    <td className="border px-4 py-2 text-right">{tx.amount.toLocaleString("vi-VN")}</td>
                                    <td className="border px-4 py-2 text-right">{tx.tax.toLocaleString("vi-VN")}</td>
                                    <td className="border px-4 py-2 text-right">{tx.discount.toLocaleString("vi-VN")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default RevenueDetailPage;
