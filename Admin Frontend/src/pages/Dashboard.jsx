import { Users, Newspaper, UserCheck, Activity } from 'lucide-react';
import clsx from 'clsx';
import './Dashboard.css';

const stats = [
    { label: 'Total Users', value: '12,345', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Reporters', value: '24', change: '+4', icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Active Communities', value: '86', change: '+2', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'New Articles', value: '142', change: '+18%', icon: Newspaper, color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="text-secondary">Welcome back, Admin</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card glass-panel">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">{stat.label}</p>
                                <h3 className="stat-value">{stat.value}</h3>
                            </div>
                            <div className={clsx('stat-icon', stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="stat-footer">
                            <span className="stat-change text-green-600">{stat.change}</span>
                            <span className="text-secondary text-sm">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-grid">
                <div className="chart-card glass-panel">
                    <h3>User Growth</h3>
                    <div className="chart-placeholder">Chart Area</div>
                </div>
                <div className="chart-card glass-panel">
                    <h3>Recent Content</h3>
                    <div className="chart-placeholder">Chart Area</div>
                </div>
            </div>
        </div>
    );
}
