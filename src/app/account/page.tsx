'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, MapPin, Package, Heart, LogOut, Plus, ShieldCheck, Edit3, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useOrdersStore } from '@/lib/store/useOrdersStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { formatPKR } from '@/lib/utils';
import { OrderAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store/useUIStore';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthReady, logout, updateProfile, addAddress, removeAddress } = useAuthStore();
  const { orders } = useOrdersStore();
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Edit profile state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  // New address state
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newProvince, setNewProvince] = useState('Punjab');

  if (!isAuthReady) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#e5ece3] border-t-[#14402a] animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#52685a]">Loading your account...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#14402a] mx-auto mb-4">
          <User className="w-8 h-8 opacity-60" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#14402a]">Sign in to Your Account</h2>
        <p className="text-xs text-[#52685a] mt-1 mb-6">
          Access your past orders, manage delivery addresses, and view saved plants.
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="px-8 py-3 rounded-full bg-[#14402a] text-white text-xs font-bold hover:bg-[#1b5539] transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, phone: editPhone });
    showToast('Profile details updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const address: OrderAddress = {
      fullName: user.name,
      phone: user.phone || '+92 300 0000000',
      email: user.email,
      streetAddress: newStreet,
      city: newCity,
      province: newProvince,
    };

    addAddress(address);
    setIsAddingAddress(false);
    setNewStreet('');
    showToast('Address added to your address book!');
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5ece3]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#14402a] text-white font-serif text-2xl font-bold flex items-center justify-center border-4 border-white shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#14402a]">
              {user.name}
            </h1>
            <p className="text-xs text-[#52685a]">{user.email} · {user.phone}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-[#e5ece3] shadow-sm space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'profile' ? 'bg-[#14402a] text-white' : 'text-[#2a3f33] hover:bg-[#f4f7f2]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'addresses' ? 'bg-[#14402a] text-white' : 'text-[#2a3f33] hover:bg-[#f4f7f2]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user.addresses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'orders' ? 'bg-[#14402a] text-white' : 'text-[#2a3f33] hover:bg-[#f4f7f2]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <Link
            href="/wishlist"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#2a3f33] hover:bg-[#f4f7f2] transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistCount})</span>
          </Link>
        </aside>

        {/* Content Area (9 cols) */}
        <main className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece3] shadow-md">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="text-lg font-serif font-bold text-[#14402a] pb-3 border-b border-[#f0f4ee]">
                Personal Profile Details
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Mobile Phone (Pakistan)</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#14402a] text-white text-xs font-bold hover:bg-[#1b5539] transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ee]">
                <h3 className="text-lg font-serif font-bold text-[#14402a]">
                  Delivery Address Book
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#eaf0e7] text-[#14402a] text-xs font-bold hover:bg-[#d8e5d4]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-[#f8faf7] border border-[#d6e2d3] space-y-3">
                  <h4 className="text-xs font-bold text-[#14402a] uppercase">New Address Details</h4>
                  <div>
                    <label className="block text-xs font-semibold text-[#172b21] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 12, Street 4, F-7/2"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172b21] mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172b21] mb-1">Province</label>
                      <input
                        type="text"
                        required
                        value={newProvince}
                        onChange={(e) => setNewProvince(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#14402a] text-white text-xs font-bold"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#fafbf9] border border-[#edf3ec] space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#14402a]">Address #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAddress(idx)}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-[#2a3f33]">{addr.streetAddress}</p>
                    <p className="text-xs font-semibold text-[#52685a]">{addr.city}, {addr.province}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#14402a] pb-3 border-b border-[#f0f4ee]">
                Past Orders ({orders.length})
              </h3>
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#f8faf7] border border-[#edf3ec]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172b21]">Order #{order.id}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52685a] mt-0.5">
                      {order.items.length} item(s) · Total: {formatPKR(order.total)}
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs font-bold text-[#14402a] hover:underline"
                  >
                    View Status &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
