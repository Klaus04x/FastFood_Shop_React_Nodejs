import orderModel from "../models/orderModel.js";

// Get statistics for today, this week, and this month
const getStatistics = async (req, res) => {
    try {
        const now = new Date();

        // Start of today (00:00:00)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Start of yesterday
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        // Start of this week (Monday)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        // Start of last week (7 days before this week)
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        // Start of this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Start of last month
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Get paid orders only
        const paidOrders = await orderModel.find({ payment: true });

        // Calculate today's revenue and orders
        const todayRevenue = paidOrders
            .filter(order => new Date(order.date) >= startOfToday)
            .reduce((sum, order) => sum + order.amount, 0);
        const todayOrders = paidOrders.filter(order => new Date(order.date) >= startOfToday).length;

        // Calculate yesterday's revenue and orders
        const yesterdayRevenue = paidOrders
            .filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startOfYesterday && orderDate < startOfToday;
            })
            .reduce((sum, order) => sum + order.amount, 0);
        const yesterdayOrders = paidOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startOfYesterday && orderDate < startOfToday;
        }).length;

        // Calculate this week's revenue and orders
        const weekRevenue = paidOrders
            .filter(order => new Date(order.date) >= startOfWeek)
            .reduce((sum, order) => sum + order.amount, 0);
        const weekOrders = paidOrders.filter(order => new Date(order.date) >= startOfWeek).length;

        // Calculate last week's revenue and orders
        const lastWeekRevenue = paidOrders
            .filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startOfLastWeek && orderDate < startOfWeek;
            })
            .reduce((sum, order) => sum + order.amount, 0);
        const lastWeekOrders = paidOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startOfLastWeek && orderDate < startOfWeek;
        }).length;

        // Calculate this month's revenue and orders
        const monthRevenue = paidOrders
            .filter(order => new Date(order.date) >= startOfMonth)
            .reduce((sum, order) => sum + order.amount, 0);
        const monthOrders = paidOrders.filter(order => new Date(order.date) >= startOfMonth).length;

        // Calculate last month's revenue and orders
        const lastMonthRevenue = paidOrders
            .filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startOfLastMonth && orderDate < startOfMonth;
            })
            .reduce((sum, order) => sum + order.amount, 0);
        const lastMonthOrders = paidOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startOfLastMonth && orderDate < startOfMonth;
        }).length;

        res.json({
            success: true,
            data: {
                today: {
                    revenue: todayRevenue,
                    orders: todayOrders,
                    prevRevenue: yesterdayRevenue,
                    prevOrders: yesterdayOrders
                },
                week: {
                    revenue: weekRevenue,
                    orders: weekOrders,
                    prevRevenue: lastWeekRevenue,
                    prevOrders: lastWeekOrders
                },
                month: {
                    revenue: monthRevenue,
                    orders: monthOrders,
                    prevRevenue: lastMonthRevenue,
                    prevOrders: lastMonthOrders
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Get daily revenue for the last 7 days
const getDailyRevenue = async (req, res) => {
    try {
        const now = new Date();
        const dailyData = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

            const orders = await orderModel.find({
                payment: true,
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            const revenue = orders.reduce((sum, order) => sum + order.amount, 0);

            dailyData.push({
                date: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: revenue,
                orders: orders.length
            });
        }

        res.json({ success: true, data: dailyData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Get monthly revenue for the last 6 months
const getMonthlyRevenue = async (req, res) => {
    try {
        const now = new Date();
        const monthlyData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const orders = await orderModel.find({
                payment: true,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            const revenue = orders.reduce((sum, order) => sum + order.amount, 0);

            monthlyData.push({
                month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                revenue: revenue,
                orders: orders.length
            });
        }

        res.json({ success: true, data: monthlyData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { getStatistics, getDailyRevenue, getMonthlyRevenue };
