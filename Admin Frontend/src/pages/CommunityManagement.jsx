import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Users, Settings, MessageSquare, Heart, Share2, Calendar, MapPin, Search, Check, AlertCircle, QrCode } from 'lucide-react';

// Mock Data
const MOCK_COMMUNITIES = [
    { id: 1, name: 'Tech Enthusiasts', members: 1250, type: 'Public', status: 'Active' },
    { id: 2, name: 'Local Farmers Market', members: 340, type: 'Public', status: 'Active' },
    { id: 3, name: 'Secret Society', members: 50, type: 'Private', status: 'Hidden' },
    { id: 4, name: 'Photography Club', members: 890, type: 'Public', status: 'Active' },
];

const MOCK_POSTS = [
    { id: 1, author: 'Alice Johnson', community: 'Tech Enthusiasts', content: 'Just launched my new AI project! Check it out.', type: 'Public', likes: 45, comments: 12, time: '2h ago', isFollowed: false },
    { id: 2, author: 'Bob Smith', community: 'Local Farmers Market', content: 'Fresh strawberries available this weekend!', type: 'Follow', likes: 23, comments: 5, time: '4h ago', isFollowed: false },
    { id: 3, author: 'Charlie Brown', community: 'Photography Club', content: 'Golden hour shots from yesterday.', type: 'Join', likes: 156, comments: 24, time: '1d ago', isJoined: false },
    { id: 4, author: 'System Admin', community: 'Global', content: 'Welcome to the new community features!', type: 'Public', likes: 200, comments: 0, time: '2d ago', isFollowed: true },
];

const MOCK_EVENTS = [
    { id: 1, title: 'Annual Tech Meetup', organizer: 'Tech Enthusiasts', date: '2026-02-15', location: 'Convention Center', category: 'Job', status: 'Upcoming' },
    { id: 2, title: 'Grand Bhandara', organizer: 'Local Community', date: '2026-01-20', location: 'City Temple', category: 'Bhandara', status: 'Upcoming' },
    { id: 3, title: 'Youth Rally', organizer: 'City Council', date: '2025-12-10', location: 'Downtown', category: 'Rally', status: 'Past' },
];

const MOCK_MEMBERS = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'Moderator' },
    { id: 3, name: 'Mike Ross', role: 'Member' },
    { id: 4, name: 'Rachel Zane', role: 'Member' },
    { id: 5, name: 'Harvey Specter', role: 'Member' },
    { id: 6, name: 'Louis Litt', role: 'Member' },
];

// Mock Users for Search
const MOCK_USERS_TO_ADD = [
    { id: 101, name: 'Alice Johnson' },
    { id: 102, name: 'Bob Smith' },
    { id: 103, name: 'Charlie Brown' },
    { id: 104, name: 'David Wilson' },
    { id: 105, name: 'Eve Davis' },
];

export default function CommunityManagement() {
    const [activeTab, setActiveTab] = useState('posts');

    // Posts State
    const [posts, setPosts] = useState(MOCK_POSTS);

    // Community State
    const [communities, setCommunities] = useState(MOCK_COMMUNITIES);
    const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
    const [newCommunity, setNewCommunity] = useState({ name: '', type: 'Public', description: '' });
    const [selectedCommunityForMembers, setSelectedCommunityForMembers] = useState(null);

    // Member Search & Add State
    const [memberSearchTerm, setMemberSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);

    // Event State
    const [events, setEvents] = useState(MOCK_EVENTS);
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', organizer: '', date: '', location: '', category: 'Bhandara' });
    const [showQRCode, setShowQRCode] = useState(false);

    // --- Handlers ---

    // Post Handlers
    const handleFollowToggle = (postId) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, isFollowed: !p.isFollowed } : p));
    };

    const handleJoinToggle = (postId) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, isJoined: !p.isJoined } : p));
    };

    // Community Handlers
    const handleCreateCommunity = () => {
        if (!newCommunity.name.trim()) return;
        const id = communities.length + 1;
        // Start with 1 member (creator) + selected users
        const initialMembersCount = 1 + selectedUsersToAdd.length;
        setCommunities([...communities, { ...newCommunity, id, members: initialMembersCount, status: 'Active' }]);
        setIsCreateCommunityOpen(false);
        setNewCommunity({ name: '', type: 'Public', description: '' });
        setSelectedUsersToAdd([]);
        setUserSearchTerm('');
    };

    const handleDeleteCommunity = (id) => {
        if (confirm('Are you sure you want to dissolve this community?')) {
            setCommunities(communities.filter(c => c.id !== id));
        }
    };

    const handleToggleUserSelection = (user) => {
        if (selectedUsersToAdd.find(u => u.id === user.id)) {
            setSelectedUsersToAdd(selectedUsersToAdd.filter(u => u.id !== user.id));
        } else {
            setSelectedUsersToAdd([...selectedUsersToAdd, user]);
        }
    };

    // Event Handlers
    const handleCreateEventClick = (e) => {
        e.preventDefault();
        setShowQRCode(true);
    };

    const confirmPayment = () => {
        const eventToAdd = {
            id: events.length + 1,
            ...newEvent,
            status: 'Upcoming'
        };
        setEvents([eventToAdd, ...events]);
        setIsCreateEventOpen(false);
        setNewEvent({ title: '', organizer: '', date: '', location: '', category: 'Bhandara' });
        setShowQRCode(false);
        alert("Payment Confirmed! Community Event Created.");
    };

    // Filtered Members
    const filteredMembers = MOCK_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(memberSearchTerm.toLowerCase())
    );

    // Filtered Users to Add
    const filteredUsersToAdd = MOCK_USERS_TO_ADD.filter(u =>
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>Community Hub</h1>
                        <p className="text-secondary">Manage posts, members, and events</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {activeTab === 'members' && (
                            <Button onClick={() => setIsCreateCommunityOpen(true)}>
                                <Plus size={18} style={{ marginRight: '8px' }} /> Create Community
                            </Button>
                        )}
                        {activeTab === 'events' && (
                            <Button onClick={() => { setIsCreateEventOpen(true); setShowQRCode(false); }}>
                                <Plus size={18} style={{ marginRight: '8px' }} /> Create Event
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    {['posts', 'members', 'events'].map((tab) => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.75rem 0',
                                cursor: 'pointer',
                                fontWeight: 500,
                                color: activeTab === tab ? '#2563eb' : '#64748b',
                                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab === 'posts' ? 'Public Posts' : tab}
                        </div>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT */}

            {/* 1. PUBLIC POSTS */}
            {activeTab === 'posts' && (
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                    {posts.map(post => (
                        <div key={post.id} className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{post.author}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {post.community} • {post.time}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Badge variant="secondary">{post.type}</Badge>
                                    {post.type === 'Follow' && (
                                        <Button size="sm" variant={post.isFollowed ? 'secondary' : 'primary'} onClick={() => handleFollowToggle(post.id)}>
                                            {post.isFollowed ? 'Following' : 'Follow'}
                                        </Button>
                                    )}
                                    {post.type === 'Join' && (
                                        <Button size="sm" variant={post.isJoined ? 'secondary' : 'outline'} onClick={() => handleJoinToggle(post.id)}>
                                            {post.isJoined ? 'Joined' : 'Join'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <p style={{ marginBottom: '1rem', color: '#334155' }}>{post.content}</p>
                            <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                    <Heart size={16} /> {post.likes}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                    <MessageSquare size={16} /> {post.comments}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                    <Share2 size={16} /> Share
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. MEMBERS */}
            {activeTab === 'members' && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Community Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {communities.map((community) => (
                                <TableRow key={community.id}>
                                    <TableCell>
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                                            onClick={() => { setSelectedCommunityForMembers(community); setMemberSearchTerm(''); }}
                                        >
                                            <div style={{ padding: '0.5rem', background: '#e0e7ff', borderRadius: '0.375rem', color: '#4f46e5' }}>
                                                <Users size={18} />
                                            </div>
                                            <span style={{ fontWeight: 500, color: '#2563eb' }}>{community.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{community.type}</TableCell>
                                    <TableCell>{community.members.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={community.status === 'Active' ? 'success' : 'default'}>
                                            {community.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button variant="ghost" size="sm" title="Settings">
                                                <Settings size={18} />
                                            </Button>
                                            <Button variant="ghost" size="sm" title="Delete" className="text-danger" onClick={() => handleDeleteCommunity(community.id)}>
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>✕</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Member List Modal */}
                    <Modal
                        isOpen={!!selectedCommunityForMembers}
                        onClose={() => setSelectedCommunityForMembers(null)}
                        title={`Members of ${selectedCommunityForMembers?.name || 'Community'}`}
                    >
                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                <Search size={16} className="text-secondary" style={{ marginRight: '0.5rem' }} />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    style={{ width: '100%', outline: 'none', border: 'none' }}
                                    value={memberSearchTerm}
                                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                                />
                            </div>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map(member => (
                                    <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{member.name}</span>
                                        </div>
                                        <Badge variant={member.role === 'Admin' ? 'primary' : 'secondary'}>{member.role}</Badge>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>No members found.</p>
                            )}
                        </div>
                    </Modal>

                    {/* Create Community Modal */}
                    <Modal
                        isOpen={isCreateCommunityOpen}
                        onClose={() => setIsCreateCommunityOpen(false)}
                        title="Create New Community"
                    >
                        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Community Name</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                    placeholder="e.g. Global Tech News"
                                    value={newCommunity.name}
                                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Visibility Type</label>
                                <select
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                    value={newCommunity.type}
                                    onChange={(e) => setNewCommunity({ ...newCommunity, type: e.target.value })}
                                >
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Add Members</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Search users to add..."
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                    />
                                    <Button size="sm" variant="secondary" onClick={() => setUserSearchTerm('')}>Clear</Button>
                                </div>

                                {selectedUsersToAdd.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {selectedUsersToAdd.map(u => (
                                            <Badge key={u.id} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {u.name} <span style={{ cursor: 'pointer' }} onClick={() => handleToggleUserSelection(u)}>×</span>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {filteredUsersToAdd.map(user => {
                                        const isSelected = selectedUsersToAdd.find(u => u.id === user.id);
                                        return (
                                            <div
                                                key={user.id}
                                                style={{
                                                    padding: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    cursor: 'pointer', background: isSelected ? '#eff6ff' : 'transparent'
                                                }}
                                                onClick={() => handleToggleUserSelection(user)}
                                            >
                                                <span>{user.name}</span>
                                                {isSelected && <Check size={14} color="#2563eb" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <Button variant="secondary" onClick={() => setIsCreateCommunityOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateCommunity}>Create Community</Button>
                        </div>
                    </Modal>
                </>
            )}

            {/* 3. EVENTS */}
            {activeTab === 'events' && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Date & Location</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: '#f3e8ff', borderRadius: '0.375rem', color: '#9333ea' }}>
                                                <Calendar size={18} />
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{event.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{event.category}</Badge>
                                    </TableCell>
                                    <TableCell>{event.organizer}</TableCell>
                                    <TableCell>
                                        <div style={{ fontSize: '0.875rem' }}>{event.date}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={12} /> {event.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={event.status === 'Upcoming' ? 'success' : 'default'}>
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Create Event Modal */}
                    <Modal
                        isOpen={isCreateEventOpen}
                        onClose={() => { setIsCreateEventOpen(false); setShowQRCode(false); }}
                        title={showQRCode ? "Scan QR to Pay" : "Create Community Event"}
                    >
                        {!showQRCode ? (
                            <form onSubmit={handleCreateEventClick}>
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '4px', display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                                    <AlertCircle size={20} color="#ea580c" />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#9a3412', marginBottom: '0.25rem' }}>Payment Required</div>
                                        <div style={{ fontSize: '0.875rem', color: '#c2410c' }}>Creating an event requires a standard fee of ₹50 CR.</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Organizer</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                            value={newEvent.organizer}
                                            onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                                        <select
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                            value={newEvent.category}
                                            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        >
                                            <option value="Bhandara">Bhandara</option>
                                            <option value="Job">Job</option>
                                            <option value="Rally">Rally</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date</label>
                                        <input
                                            type="date"
                                            required
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                                        <input
                                            type="text"
                                            required
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <Button type="button" variant="secondary" onClick={() => setIsCreateEventOpen(false)}>Cancel</Button>
                                    <Button type="submit">Proceed to Payment</Button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600 }}>Scan QR to Pay ₹50</div>
                                <div style={{
                                    width: '200px',
                                    height: '200px',
                                    margin: '0 auto 1.5rem',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <QrCode size={160} color="#1e293b" />
                                    <div style={{ position: 'absolute', bottom: '-10px', background: '#2563eb', color: 'white', padding: '2px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>PAID VIA CR</div>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>The QR code is valid for 10 minutes. Please confirm after scanning.</p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <Button variant="secondary" onClick={() => setShowQRCode(false)}>Back</Button>
                                    <Button onClick={confirmPayment}>I have Paid</Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
}
