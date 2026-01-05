import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Eye, Check, X, FileText } from 'lucide-react';

const MOCK_REPORTERS = [
    { id: 1, name: 'Sarah Connor', email: 'sarah@news.com', status: 'Pending', bio: 'Experienced local news reporter.', articles: 0, applied: '2025-12-28' },
    { id: 2, name: 'John Doe', email: 'john@news.com', status: 'Approved', bio: 'Tech enthusiast covering gadgets.', articles: 12, applied: '2025-11-10' },
    { id: 3, name: 'Emily Clarke', email: 'emily@news.com', status: 'Rejected', bio: 'Blogger turned reporter.', articles: 0, applied: '2025-12-01' },
];

export default function ReporterManagement() {
    const [reporters, setReporters] = useState(MOCK_REPORTERS);
    const [selectedReporter, setSelectedReporter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (reporter) => {
        setSelectedReporter(reporter);
        setIsModalOpen(true);
    };

    const updateStatus = (id, newStatus) => {
        setReporters(reporters.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setIsModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'danger';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Reporter Management</h1>
                <p className="text-secondary">Review applications and manage reporter access</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Articles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reporters.map((reporter) => (
                        <TableRow key={reporter.id}>
                            <TableCell>
                                <div style={{ fontWeight: 500 }}>{reporter.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{reporter.email}</div>
                            </TableCell>
                            <TableCell>{reporter.applied}</TableCell>
                            <TableCell>{reporter.articles}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusColor(reporter.status)}>{reporter.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(reporter)}>
                                    <Eye size={18} style={{ marginRight: '4px' }} /> View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Reporter Application Details"
            >
                {selectedReporter && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                            }}>
                                {selectedReporter.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{selectedReporter.name}</h3>
                                <p style={{ color: '#64748b', margin: 0 }}>{selectedReporter.email}</p>
                                <Badge variant={getStatusColor(selectedReporter.status)} className="mt-2">
                                    {selectedReporter.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio / Experience</label>
                            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
                                {selectedReporter.bio}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Submitted Sample Articles</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href="https://example.com/aadhar.pdf" target="_blank">
                                        <FileText size={16} /> Aadhar Card
                                    </a>
                                </Button>

                                <Button variant="ghost" size="sm" asChild>
                                    <a href="https://example.com/pan.pdf" target="_blank">
                                        <FileText size={16} /> Pan Card
                                    </a>
                                </Button>

                            </div>
                        </div>

                        <div className="form-actions">
                            {selectedReporter.status === 'Pending' && (
                                <>
                                    <Button variant="danger" onClick={() => updateStatus(selectedReporter.id, 'Rejected')}>
                                        <X size={18} /> Reject
                                    </Button>
                                    <Button variant="primary" onClick={() => updateStatus(selectedReporter.id, 'Approved')}>
                                        <Check size={18} /> Approve Reporter
                                    </Button>
                                </>
                            )}
                            {selectedReporter.status !== 'Pending' && (
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
