import { useState } from 'react';
import { Search, Filter, Shield, Ban, Trash2, Plus, Upload, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

// Mock Data
const MOCK_USERS = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', status: 'Active', joined: '2025-10-12', headline: 'Software Engineer', location: 'New York, USA' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Reporter', status: 'Active', joined: '2025-09-15', headline: 'Journalist at Daily News', location: 'London, UK' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Banned', joined: '2025-11-01', headline: 'Student', location: 'Toronto, Canada' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'Admin', status: 'Active', joined: '2025-08-20', headline: 'System Administrator', location: 'San Francisco, USA' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'User', status: 'Inactive', joined: '2025-12-05', headline: 'Freelance Designer', location: 'Berlin, Germany' },
];

export default function UserManagement() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Add User State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'User',
        status: 'Active',
        headline: '',
        location: '',
        about: '',
        currentPosition: '',
        education: '',
        profileImage: null
    });

    // Derived state for filtered users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Banned': return 'danger';
            case 'Inactive': return 'default';
            default: return 'default';
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Name,Email,Role,Status,Joined,Headline,Location\n"
            + users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status},${u.joined},"${u.headline || ''}","${u.location || ''}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAction = (id, action) => {
        if (action === 'delete') {
            if (confirm('Are you sure you want to delete this user?')) {
                setUsers(users.filter(u => u.id !== id));
            }
        } else if (action === 'block') {
            setUsers(users.map(u => u.id === id ? { ...u, status: 'Banned' } : u));
        } else if (action === 'activate') {
            setUsers(users.map(u => u.id === id ? { ...u, status: 'Active' } : u));
        }
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        const userToAdd = {
            id: users.length + 1,
            ...newUser,
            joined: new Date().toISOString().split('T')[0],
            // Create a fake URL for the uploaded image if present
            profileImageUrl: newUser.profileImage ? URL.createObjectURL(newUser.profileImage) : null
        };
        setUsers([userToAdd, ...users]);
        setNewUser({
            name: '', email: '', role: 'User', status: 'Active',
            headline: '', location: '', about: '', currentPosition: '', education: '', profileImage: null
        });
        setIsAddUserOpen(false);
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewUser({ ...newUser, profileImage: e.target.files[0] });
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <h1>User Management</h1>
                    <p className="text-secondary">Manage system users and their roles</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button onClick={() => setIsAddUserOpen(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Add User
                    </Button>
                    <Button variant="secondary" onClick={handleExport}>Export Users</Button>
                </div>
            </div>

            {/* Filters & Actions */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="search-bar" style={{ flex: 1, minWidth: '250px', backgroundColor: 'white' }}>
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Button variant={filterRole !== 'All' ? 'primary' : 'secondary'} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        <Filter size={18} style={{ marginRight: '8px' }} />
                        {filterRole === 'All' ? 'Filter Role' : filterRole}
                    </Button>

                    {isFilterOpen && (
                        <div className="glass-panel dropdown-menu" style={{
                            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                            padding: '0.5rem', minWidth: '160px', zIndex: 10, background: 'white',
                            borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}>
                            {['All', 'User', 'Reporter', 'Admin'].map(role => (
                                <div
                                    key={role}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        background: filterRole === role ? '#f1f5f9' : 'transparent',
                                        color: filterRole === role ? '#1e293b' : '#64748b',
                                        fontWeight: filterRole === role ? '600' : '400',
                                        transition: 'background 0.2s'
                                    }}
                                    onClick={() => { setFilterRole(role); setIsFilterOpen(false); }}
                                >
                                    {role}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User Info</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 600, color: '#475569', overflow: 'hidden'
                                        }}>
                                            {user.profileImageUrl ? (
                                                <img src={user.profileImageUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                                            {user.headline && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user.headline}</div>}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {user.role === 'Admin' && <Shield size={14} color="#6366f1" />}
                                        {user.role}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                                </TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {user.status === 'Banned' ? (
                                            <Button variant="ghost" size="sm" title="Unban" onClick={() => handleAction(user.id, 'activate')}>
                                                <Shield size={18} color="green" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" title="Ban" onClick={() => handleAction(user.id, 'block')}>
                                                <Ban size={18} color="orange" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" title="Delete" onClick={() => handleAction(user.id, 'delete')}>
                                            <Trash2 size={18} color="red" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className="text-center" colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                                No users found matching your search.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                title="Create User Profile"
            >
                <form onSubmit={handleAddUser} style={{ overflowY: 'auto' }}>
                    {/* Profile Image Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1',
                            overflow: 'hidden'
                        }}>
                            {newUser.profileImage ? (
                                <img
                                    src={URL.createObjectURL(newUser.profileImage)}
                                    alt="Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Upload size={32} color="#94a3b8" />
                            )}
                        </div>
                        <div>
                            <label className="button-secondary" style={{
                                padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer',
                                background: 'white', border: '1px solid #e2e8f0', fontSize: '0.875rem'
                            }}>
                                Choose Image
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </label>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Minimum 400x400 px recommended
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name *</label>
                            <input
                                type="text"
                                required
                                placeholder='Ex: John Doe'
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email *</label>
                            <input
                                type="email"
                                required
                                placeholder='john@example.com'
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Headline</label>
                        <input
                            type="text"
                            placeholder='Ex: Software Engineer at Tech Corp'
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                            value={newUser.headline}
                            onChange={(e) => setNewUser({ ...newUser, headline: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                <Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                Current Position
                            </label>
                            <input
                                type="text"
                                placeholder='Role & Company'
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={newUser.currentPosition}
                                onChange={(e) => setNewUser({ ...newUser, currentPosition: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                <GraduationCap size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                Education
                            </label>
                            <input
                                type="text"
                                placeholder='School / University'
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={newUser.education}
                                onChange={(e) => setNewUser({ ...newUser, education: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder='City, Country'
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                            value={newUser.location}
                            onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>About</label>
                        <textarea
                            rows={3}
                            placeholder='Brief professional summary...'
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', resize: 'vertical' }}
                            value={newUser.about}
                            onChange={(e) => setNewUser({ ...newUser, about: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="User">User</option>
                                <option value="Reporter">Reporter</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                value={newUser.status}
                                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Banned">Banned</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <Button type="button" variant="secondary" onClick={() => setIsAddUserOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create User
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
