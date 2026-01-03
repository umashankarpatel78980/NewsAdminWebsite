import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Flag, AlertTriangle, MessageSquare } from 'lucide-react';

const MOCK_REPORTS = [
    { id: 1, type: 'Spam', target: 'Comment #1234', reporter: 'user123', status: 'Pending', severity: 'Low' },
    { id: 2, type: 'Harassment', target: 'User: BobSmith', reporter: 'alice_j', status: 'Investigating', severity: 'High' },
    { id: 3, type: 'Fake News', target: 'Article: Aliens Land', reporter: 'fact_checker', status: 'Resolved', severity: 'Medium' },
];

import Modal from '../components/ui/Modal';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Reports() {
    const [reports, setReports] = useState(MOCK_REPORTS);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            case 'Low': return 'info';
            default: return 'default';
        }
    };

    const handleReview = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleAction = (id, action) => {
        // Simulate API action
        setReports(reports.map(r => r.id === id ? { ...r, status: action === 'dismiss' ? 'Dismissed' : 'Resolved' } : r));
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="page-header">
                <h1>Reports & Moderation</h1>
                <p className="text-secondary">Handle user complaints and content violations</p>
            </div>

            <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '50%', color: '#991b1b' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{reports.filter(r => r.status !== 'Resolved' && r.status !== 'Dismissed').length}</div>
                        <div style={{ color: '#64748b' }}>Open Reports</div>
                    </div>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '50%', color: '#1e40af' }}>
                        <Flag size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{reports.filter(r => r.severity === 'High' && r.status !== 'Resolved').length}</div>
                        <div style={{ color: '#64748b' }}>Action Required</div>
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Target Content</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell>
                                <div style={{ fontWeight: 500 }}>{report.type}</div>
                            </TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={14} color="#94a3b8" />
                                    {report.target}
                                </div>
                            </TableCell>
                            <TableCell>{report.reporter}</TableCell>
                            <TableCell>
                                <Badge variant={getSeverityColor(report.severity)}>{report.severity}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={report.status === 'Resolved' ? 'success' : report.status === 'Dismissed' ? 'default' : 'warning'}>
                                    {report.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="primary" size="sm" onClick={() => handleReview(report)}>Review</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Review Report Details"
            >
                {selectedReport && (
                    <div>
                        <div className="form-group">
                            <label className="form-label">Report Type</label>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedReport.type}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reported Content</label>
                            <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '0.5rem' }}>
                                "{selectedReport.target}"
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reporter Notes</label>
                            <p style={{ color: '#64748b' }}>User {selectedReport.reporter} flagged this as {selectedReport.severity} severity.</p>
                        </div>

                        <div className="form-actions">
                            <Button variant="ghost" onClick={() => handleAction(selectedReport.id, 'dismiss')}>
                                <XCircle size={18} style={{ marginRight: '8px' }} />
                                Dismiss Report
                            </Button>
                            <Button variant="danger" onClick={() => handleAction(selectedReport.id, 'ban')}>
                                <AlertTriangle size={18} style={{ marginRight: '8px' }} />
                                Take Action (Ban/Delete)
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
