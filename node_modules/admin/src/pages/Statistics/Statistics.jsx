import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Package,
  Wallet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './Statistics.css';

const Statistics = ({ url }) => {
  const [summary, setSummary] = useState({
    today: { revenue: 0, orders: 0, prevRevenue: 0, prevOrders: 0 },
    week: { revenue: 0, orders: 0, prevRevenue: 0, prevOrders: 0 },
    month: { revenue: 0, orders: 0, prevRevenue: 0, prevOrders: 0 }
  });
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      const summaryRes = await axios.get(`${url}/api/statistics/summary`);
      const dailyRes = await axios.get(`${url}/api/statistics/daily`);
      const monthlyRes = await axios.get(`${url}/api/statistics/monthly`);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (dailyRes.data.success) setDailyData(dailyRes.data.data);
      if (monthlyRes.data.success) setMonthlyData(monthlyRes.data.data);

      setLoading(false);
    } catch (error) {
      toast.error("Error loading data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2).replace(/\.?0+$/, '')}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2).replace(/\.?0+$/, '')}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  const calculateChange = (current, previous) => {
    const prev = Number(previous) || 0;
    const curr = Number(current) || 0;

    // If both are 0, no change
    if (prev === 0 && curr === 0) return 0;

    // If previous is 0 but current has value, show 100% increase
    if (prev === 0 && curr > 0) return 100;

    // If previous has value but current is 0, show -100% decrease
    if (prev > 0 && curr === 0) return -100;

    // Normal calculation
    return ((curr - prev) / prev * 100).toFixed(1);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, colorFrom, colorTo, change }) => {
    const isPositive = change >= 0;

    return (
      <div
        className="stat-card"
        style={{
          '--card-color-from': colorFrom,
          '--card-color-to': colorTo
        }}
      >
        <div
          className="stat-icon"
          style={{
            backgroundColor: `${colorFrom}15`,
            color: colorFrom
          }}
        >
          <Icon size={28} strokeWidth={2} />
        </div>

        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>

        <div className="stat-change">
          <div className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(change)}%
          </div>
          <span className="change-text">{subtitle}</span>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    return (
      <div style={{
        background: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{
          marginBottom: '4px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#1a202c'
        }}>
          {payload[0].payload.name}
        </p>
        {payload.map((entry, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: entry.color
            }} />
            <span style={{ color: '#64748b' }}>
              {entry.name}: <strong style={{ color: '#1a202c' }}>{formatCurrency(entry.value)}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading data...</p>
      </div>
    );
  }

  const dailyChartData = dailyData.map(item => ({
    name: item.date,
    'Revenue': item.revenue
  }));

  const monthlyChartData = monthlyData.map(item => ({
    name: item.month,
    'Revenue': item.revenue
  }));

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1 className="stats-title">Revenue Statistics</h1>
        <p className="stats-subtitle">Business Activity Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Today's Orders"
          value={formatNumber(summary.today.orders)}
          subtitle="vs yesterday"
          icon={ShoppingCart}
          colorFrom="#6366f1"
          colorTo="#4f46e5"
          change={calculateChange(summary.today.orders, summary.today.prevOrders)}
        />

        <StatCard
          title="This Week's Revenue"
          value={formatCurrency(summary.week.revenue)}
          subtitle="vs last week"
          icon={TrendingUp}
          colorFrom="#10b981"
          colorTo="#059669"
          change={calculateChange(summary.week.revenue, summary.week.prevRevenue)}
        />

        <StatCard
          title="Today's Revenue"
          value={formatCurrency(summary.today.revenue)}
          subtitle="vs yesterday"
          icon={Wallet}
          colorFrom="#f59e0b"
          colorTo="#f97316"
          change={calculateChange(summary.today.revenue, summary.today.prevRevenue)}
        />

        <StatCard
          title="This Month's Revenue"
          value={formatCurrency(summary.month.revenue)}
          subtitle="vs last month"
          icon={Package}
          colorFrom="#8b5cf6"
          colorTo="#7c3aed"
          change={calculateChange(summary.month.revenue, summary.month.prevRevenue)}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">7-Day Revenue</h3>
            <p className="chart-subtitle">Recent daily trends</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">6-Month Revenue</h3>
            <p className="chart-subtitle">Recent monthly trends</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="Revenue"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Tables */}
      <div className="tables-grid">
        <div className="table-card">
          <div className="table-header">
            <h3 className="table-title">Daily Details</h3>
          </div>
          <div className="table-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.date}</td>
                    <td className="revenue-cell">{formatCurrency(item.revenue)}</td>
                    <td className="orders-cell">{item.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3 className="table-title">Monthly Details</h3>
          </div>
          <div className="table-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.month}</td>
                    <td className="revenue-cell">{formatCurrency(item.revenue)}</td>
                    <td className="orders-cell">{item.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
