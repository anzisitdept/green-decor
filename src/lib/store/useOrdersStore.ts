'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CartItem, OrderAddress, PaymentMethod, OrderStatus } from '@/types';

interface OrdersStore {
  orders: Order[];
  createOrder: (
    items: CartItem[],
    shippingAddress: OrderAddress,
    paymentMethod: PaymentMethod,
    subtotal: number,
    shippingFee: number,
    discount: number,
    total: number,
    userId?: string
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
}

const mockInitialOrders: Order[] = [
  {
    id: 'GD-89241',
    userId: 'usr-demo-1',
    items: [
      {
        product: {
          id: 'prod-1',
          name: 'Variegated Monstera Deliciosa (Swiss Cheese)',
          slug: 'variegated-monstera-deliciosa',
          category: 'plants',
          categoryLabel: 'Plants & Planters',
          price: 4800,
          salePrice: 4200,
          images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80'],
          stock: 14,
          rating: 4.9,
          reviewCount: 38,
          shortDescription: 'Iconic split-leaf tropical statement plant in premium artisan pot.',
          description: '',
          tags: ['Indoor', 'Best Seller'],
          inStock: true,
        },
        quantity: 1,
      },
      {
        product: {
          id: 'prod-9',
          name: 'Green Shield™ Organic Cold-Pressed Neem Oil Spray',
          slug: 'green-shield-organic-neem-oil-spray',
          category: 'plant-care',
          categoryLabel: 'Plant Care Products',
          price: 850,
          salePrice: 720,
          images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'],
          stock: 50,
          rating: 4.9,
          reviewCount: 88,
          shortDescription: 'Ready-to-use organic foliar spray against aphids & mites.',
          description: '',
          tags: ['Organic'],
          inStock: true,
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Hamza Khan',
      phone: '+92 333 8951222',
      email: 'hamza.khan@example.com',
      streetAddress: 'House 42, Sector Y, Phase 3, DHA',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54792',
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    subtotal: 4920,
    shippingFee: 0,
    discount: 0,
    total: 4920,
    status: 'shipped',
    trackingNumber: 'TCS-9941829410',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    statusHistory: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: 'Order successfully received.',
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        note: 'Items verified and inspected at Lahore Green Decor Nursery.',
      },
      {
        status: 'processing',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: 'Packed securely in protective plant crate.',
      },
      {
        status: 'shipped',
        timestamp: new Date(Date.now() - 86400000 * 0.4).toISOString(),
        note: 'Handed to courier for delivery to DHA Phase 3, Lahore.',
      },
    ],
  },
];

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: mockInitialOrders,

      createOrder: (
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        discount,
        total,
        userId
      ) => {
        const orderId = `GD-${Math.floor(10000 + Math.random() * 90000)}`;
        const trackingNumber = `TCS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const now = new Date().toISOString();

        const newOrder: Order = {
          id: orderId,
          userId: userId || 'guest',
          items,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          subtotal,
          shippingFee,
          discount,
          total,
          status: 'placed',
          trackingNumber,
          createdAt: now,
          statusHistory: [
            {
              status: 'placed',
              timestamp: now,
              note: 'Order placed successfully. Thank you for choosing Green Decor!',
            },
          ],
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id.toLowerCase() === orderId.toLowerCase());
      },

      updateOrderStatus: (orderId, status, note) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id.toLowerCase() === orderId.toLowerCase()) {
              const newHistory = [
                ...order.statusHistory,
                {
                  status,
                  timestamp: new Date().toISOString(),
                  note: note || `Status changed to ${status}`,
                },
              ];
              return { ...order, status, statusHistory: newHistory };
            }
            return order;
          }),
        }));
      },
    }),
    {
      name: 'green-decor-orders',
    }
  )
);
