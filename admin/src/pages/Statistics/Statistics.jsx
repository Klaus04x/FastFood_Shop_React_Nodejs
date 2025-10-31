import React, { useEffect, useState } from 'react'
import './Statistics.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Statistics = ({ url }) => {
    const [summary, setSummary] = useState({
        today: { revenue: 0, orders: 0 },
        week: { revenue: 0, orders: 0 },
        month: { revenue: 0, orders: 0 }
    });
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {
        try {
            const summaryRes = await axios.get(`${url}/api/statistics/summary`);
            const dailyRes = await axios.get(`${url}/api/statistics/daily`);
            const monthlyRes = await axios.get(`${url}/api/statistics/monthly`);

            if (summaryRes.data.success) {
                setSummary(summaryRes.data.data);
            }
            if (dailyRes.data.success) {
                setDailyData(dailyRes.data.data);
            }
            if (monthlyRes.data.success) {
                setMonthlyData(monthlyRes.data.data);
            }
            setLoading(false);
        } catch (error) {
            toast.error("Error fetching statistics");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStatistics();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    if (loading) {
        return <div className='statistics'><p>Loading statistics...</p></div>
    }

    return (
        <div className='statistics'>
            <h2>Revenue Statistics</h2>

            {/* Summary Cards */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-label">Today</div>
                    <div className="stat-value">{formatCurrency(summary.today.revenue)}</div>
                    <div className="stat-orders">{summary.today.orders} orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">This Week</div>
                    <div className="stat-value">{formatCurrency(summary.week.revenue)}</div>
                    <div className="stat-orders">{summary.week.orders} orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">This Month</div>
                    <div className="stat-value">{formatCurrency(summary.month.revenue)}</div>
                    <div className="stat-orders">{summary.month.orders} orders</div>
                </div>
            </div>

            {/* Daily Revenue Table */}
            <div className="stats-section">
                <h3>Daily Revenue (Last 7 Days)</h3>
                <div className="stats-table">
                    <div className="stats-table-format title">
                        <b>Date</b>
                        <b>Revenue</b>
                        <b>Orders</b>
                    </div>
                    {dailyData.map((item, index) => (
                        <div key={index} className='stats-table-format'>
                            <p>{item.date}</p>
                            <p>{formatCurrency(item.revenue)}</p>
                            <p>{item.orders}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Revenue Table */}
            <div className="stats-section">
                <h3>Monthly Revenue (Last 6 Months)</h3>
                <div className="stats-table">
                    <div className="stats-table-format title">
                        <b>Month</b>
                        <b>Revenue</b>
                        <b>Orders</b>
                    </div>
                    {monthlyData.map((item, index) => (
                        <div key={index} className='stats-table-format'>
                            <p>{item.month}</p>
                            <p>{formatCurrency(item.revenue)}</p>
                            <p>{item.orders}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Statistics
