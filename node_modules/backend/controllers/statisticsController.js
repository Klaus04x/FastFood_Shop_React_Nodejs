import orderModel from "../models/orderModel.js";

// Get statistics for today, this week, and this month
const getStatistics = async (req, res) => {
    try {
        const now = new Date();

        // Start of today (00:00:00)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Start of this week (Monday)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        // Start of this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get paid orders only
        const paidOrders = await orderModel.find({ payment: true });

        // Calculate today's revenue
        const todayRevenue = paidOrders
            .filter(order => new Date(order.date) >= startOfToday)
            .reduce((sum, order) => sum + order.amount, 0);

        // Calculate this week's revenue
        const weekRevenue = paidOrders
            .filter(order => new Date(order.date) >= startOfWeek)
            .reduce((sum, order) => sum + order.amount, 0);

        // Calculate this month's revenue
        const monthRevenue = paidOrders
            .filter(order => new Date(order.date) >= startOfMonth)
            .reduce((sum, order) => sum + order.amount, 0);

        // Count orders
        const todayOrders = paidOrders.filter(order => new Date(order.date) >= startOfToday).length;
        const weekOrders = paidOrders.filter(order => new Date(order.date) >= startOfWeek).length;
        const monthOrders = paidOrders.filter(order => new Date(order.date) >= startOfMonth).length;

        res.json({
            success: true,
            data: {
                today: {
                    revenue: todayRevenue,
                    orders: todayOrders
                },
                week: {
                    revenue: weekRevenue,
                    orders: weekOrders
                },
                month: {
                    revenue: monthRevenue,
                    orders: monthOrders
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
