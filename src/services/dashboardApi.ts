// services/dashboardApi.ts
import { orderApi } from "./orderApi";
import { productApi } from "./productApi";
import { userApi } from "./userApi";

class DashboardApiService {
  async getStats() {
    const [orders, products, users] = await Promise.all([
      orderApi.getAllOrders(),
      productApi.getAll(),
      userApi.getAllUsers(),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );

    return {
      totalOrders: orders.length,
      totalProducts: products.length,
      totalRevenue,
      totalCustomers: users.length,
    };
  }

  async getRecentOrders() {
    return await orderApi.getRecentOrders(5);
  }
}

export const dashboardApi = new DashboardApiService();
