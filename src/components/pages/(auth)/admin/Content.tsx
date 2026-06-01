'use client';

import { useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  UsersIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import useClientItems from './client-monitoring/hooks/useGetClientItems';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ─── Avatar helpers ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-pink-500',
];

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─── Time remaining format ────────────────────────────────────────────────────

function formatTimeRemaining(days: number | null): string {
  if (days === null) return '—';
  if (days === 0) return 'Expired';
  if (days > 30) {
    const months = Math.round(days / 30);
    return `${months} Month${months > 1 ? 's' : ''}`;
  }
  return `${days} Days`;
}

// ─── Phase badge logic ────────────────────────────────────────────────────────

type PhaseBadge = {
  label: string;
  className: string;
};

function getPhaseBadge(sub: any): PhaseBadge {
  if (!sub) {
    return { label: 'No Subscription', className: 'bg-gray-100 text-gray-600' };
  }
  const { status, is_trial, days_remaining } = sub;

  if (status === 'Active' && is_trial) {
    return { label: 'Free Trial Period', className: 'bg-purple-100 text-purple-700' };
  }
  if (status === 'Active' && !is_trial) {
    return { label: 'Active Usage', className: 'bg-green-100 text-green-700' };
  }
  if (status === 'Expiring Soon' && days_remaining > 14) {
    return { label: '1 Month Warning', className: 'bg-yellow-100 text-yellow-700' };
  }
  if (status === 'Expiring Soon' && days_remaining <= 14) {
    return { label: 'Final Warning', className: 'bg-red-100 text-red-700' };
  }
  if (status === 'Expired') {
    return { label: 'View Only Mode', className: 'bg-red-100 text-red-800' };
  }
  return { label: 'No Subscription', className: 'bg-gray-100 text-gray-600' };
}

// ─── Actions column ───────────────────────────────────────────────────────────

function ActionsCell({ sub }: { sub: any }) {
  if (!sub) {
    return <span className="text-gray-400 text-lg tracking-widest">•••</span>;
  }
  const { status, days_remaining } = sub;

  if (status === 'Active') {
    return <span className="text-gray-400 text-lg tracking-widest">•••</span>;
  }
  if (status === 'Expiring Soon' && days_remaining > 14) {
    return (
      <button
        onClick={() => {}}
        className="px-3 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700 font-medium hover:bg-yellow-200 transition-colors"
      >
        Send Reminder
      </button>
    );
  }
  if (status === 'Expiring Soon' && days_remaining <= 14) {
    return (
      <button
        onClick={() => {}}
        className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
      >
        Urgent Email
      </button>
    );
  }
  if (status === 'Expired') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {}}
          className="px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors"
        >
          Reactivate
        </button>
        <button
          onClick={() => {}}
          className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
        >
          Support
        </button>
      </div>
    );
  }
  return <span className="text-gray-400 text-lg tracking-widest">•••</span>;
}

// ─── Automation events panel data ─────────────────────────────────────────────

const EVENTS = [
  {
    dot: 'bg-blue-500',
    label: 'Email Sent: Renewal Reminder',
    sub: 'To: Apex Pro Ltd • 2m ago',
  },
  {
    dot: 'bg-red-500',
    label: 'Locked: View-Only Mode',
    sub: 'Client: Lunar Media • 1h ago',
  },
  {
    dot: 'bg-green-500',
    label: 'Sub Activated: New Client',
    sub: 'Client: Horizon Devs • 3h ago',
  },
];

// ─── Chart helpers ────────────────────────────────────────────────────────────

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function buildChartData(clientItems: any[]) {
  const buckets = Array.from({ length: 7 }, () => ({
    active: 0,
    expiring: 0,
    expired: 0,
    trial: 0,
  }));

  for (const item of clientItems) {
    const dayIdx = new Date(item.created_at).getDay();
    const sub = item.subscription;
    if (!sub) continue;
    if (sub.status === 'Active' && !sub.is_trial) buckets[dayIdx].active += 1;
    else if (sub.status === 'Active' && sub.is_trial) buckets[dayIdx].trial += 1;
    else if (sub.status === 'Expiring Soon') buckets[dayIdx].expiring += 1;
    else if (sub.status === 'Expired') buckets[dayIdx].expired += 1;
  }

  return {
    labels: DAY_LABELS,
    datasets: [
      {
        label: 'Active',
        data: buckets.map((b) => b.active),
        backgroundColor: '#22c55e',
        borderRadius: 3,
      },
      {
        label: 'Trial',
        data: buckets.map((b) => b.trial),
        backgroundColor: '#a855f7',
        borderRadius: 3,
      },
      {
        label: 'Expiring',
        data: buckets.map((b) => b.expiring),
        backgroundColor: '#eab308',
        borderRadius: 3,
      },
      {
        label: 'Expired',
        data: buckets.map((b) => b.expired),
        backgroundColor: '#ef4444',
        borderRadius: 3,
      },
    ],
  };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { stepSize: 1 },
    },
  },
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

// ─── StatCard sub-component ───────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};

function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
      <div className={`p-2 rounded-lg ${iconBg} shrink-0`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Content = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useClientItems();

  const clientItems: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];

  // Stat card counts
  const totalClients = clientItems.length;
  const activeTrials = clientItems.filter(
    (c) => c.subscription?.is_trial && c.subscription?.status !== 'Expired'
  ).length;
  const expiringSoon = clientItems.filter(
    (c) => c.subscription?.status === 'Expiring Soon'
  ).length;
  const expired = clientItems.filter(
    (c) => c.subscription?.status === 'Expired'
  ).length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(clientItems.length / PAGE_SIZE));
  const paginatedItems = clientItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Chart data
  const chartData = buildChartData(clientItems);

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800">
        Client Subscription Monitoring Dashboard
      </h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Clients"
          value={totalClients}
          icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Active Trials"
          value={activeTrials}
          icon={<BeakerIcon className="w-6 h-6 text-purple-500" />}
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Expiring Soon"
          value={expiringSoon}
          icon={<ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />}
          iconBg="bg-orange-50"
        />
        <StatCard
          label="View-Only Mode"
          value={expired}
          icon={<LockClosedIcon className="w-6 h-6 text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* ── Client Lifecycle Monitoring Table ── */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Client Lifecycle Monitoring</h2>
          <button
            disabled
            className="px-4 py-2 text-sm rounded-lg bg-savoy-blue text-white opacity-50 cursor-not-allowed font-medium"
          >
            + Add Client
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Loading clients…
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-32 text-red-400 text-sm">
            Failed to load data.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Client
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Current Phase
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Plan
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Time Remaining
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item: any) => {
                      const badge = getPhaseBadge(item.subscription);
                      const initials = getInitials(item.name || '?');
                      const avatarColor = getAvatarColor(item.name || '?');
                      const daysRemaining = item.subscription?.days_remaining ?? null;
                      const planName = item.subscription?.plan_name ?? '—';

                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                              >
                                {initials}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 leading-tight">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-gray-600">{planName}</td>
                          <td className="py-3 pr-4 text-gray-600">
                            {formatTimeRemaining(daysRemaining)}
                          </td>
                          <td className="py-3">
                            <ActionsCell sub={item.subscription} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {page} of {totalPages} · {clientItems.length} clients
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                        p === page
                          ? 'bg-savoy-blue text-white border-savoy-blue'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom Row: Chart + Events ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lifecycle Health Trends chart */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Lifecycle Health Trends</h2>
          <div className="h-48">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: 'bg-green-500', label: 'Active' },
              { color: 'bg-purple-500', label: 'Trial' },
              { color: 'bg-yellow-500', label: 'Expiring' },
              { color: 'bg-red-500', label: 'Expired' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Events panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Automation Events</h2>
          <div className="flex-1 space-y-4">
            {EVENTS.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${event.dot}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{event.label}</p>
                  <p className="text-xs text-gray-400">{event.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            disabled
            className="mt-6 w-full py-2 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View All Logs
          </button>
        </div>
      </div>

    </div>
  );
};

export default Content;
