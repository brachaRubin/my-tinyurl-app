import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ClickBySourceChart from './ClickBySourceChart';
import ClicksByDayOfWeekChart from './ClicksByDayOfWeekChart';
import TotalClicksPerLinkChart from './TotalClicksPerLinkChart';
import Modal from './Modal';



interface LinksResponse {
    data: {
        links: any[]; // Replace any with your actual link type if you have it
    };
}

interface AppContentProps {
  hideAuthForms?: boolean;
}

export default function AppContent({ hideAuthForms }: AppContentProps) {
    const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
    const [selectedDayLinkId, setSelectedDayLinkId] = useState<string | null>(null);
    const [showDayChart, setShowDayChart] = useState(false);
    const [showTotalClicksChart, setShowTotalClicksChart] = useState(false);
    const [targetValues, setTargetValues] = useState([{ name: '', value: '' }]);
    const { user } = useContext(AuthContext);
    const [links, setLinks] = useState<any[]>([]);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [longUrl, setLongUrl] = useState('');
    const [creating, setCreating] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const token = localStorage.getItem('token') || '';

    const fetchLinks = async () => {
        setLoadingLinks(true);
        try {
            const res = await axios.get<LinksResponse>('http://localhost:3000/api/links/mylinks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLinks(res.data.data.links);
        } catch {
            setLinks([]);
        }
        setLoadingLinks(false);
    };

    useEffect(() => {
        if (user) {
            fetchLinks();
        }
    }, [user, token]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            // Filter out empty target values
            const filteredTargetValues = targetValues.filter(tv => tv.name && tv.value);
            await axios.post('http://localhost:3000/api/links', {
                originalUrl: longUrl,
                targetValues: filteredTargetValues
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLongUrl('');
            setTargetValues([{ name: '', value: '' }]);
            // Refetch links after creating
            await fetchLinks();
        } catch (err) {
            alert('Failed to create short URL');
            console.log(err);
        }
        setCreating(false);
    };

    if (!user && !hideAuthForms) {
        return (
            <>
                <h2>welcome to TinyURL Dashboard</h2>
                <p>Effortlessly create, manage, and analyze your short links.</p>
                <p>Login or register above to get started!</p>
                <div style={{ color: '#888', fontSize: 15 }}>
                    Secure, simple, and powerful URL shortening for everyone.
                </div>
            </>
        );
    }
    if (!user && hideAuthForms) {
        return null;
    }

    if (loadingLinks) return <div>Loading your links...</div>;

    return (
        <>
            {user && (
                <>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        style={{ background: '#283593', color: 'white', border: 'none', borderRadius: 8, padding: '13px 36px', fontWeight: 700, fontSize: 18, margin: '0 auto 36px auto', display: 'block', boxShadow: '0 2px 12px rgba(40,53,147,0.08)', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                        + Create New Short URL
                    </button>
                    <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
                        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(40,53,147,0.08)', padding: 28, minWidth: 350, maxWidth: 500 }}>
                            <h2 style={{ color: '#283593', marginBottom: 18, textAlign: 'center' }}>Create a Short URL</h2>
                            <form onSubmit={async (e) => {
                                await handleCreate(e);
                                setCreateModalOpen(false);
                            }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <input
                                    value={longUrl}
                                    onChange={e => setLongUrl(e.target.value)}
                                    placeholder="Paste your long URL here"
                                    required
                                    style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d9e6', fontSize: 16, background: '#f5f6fa' }}
                                />
                                <div>
                                    <strong style={{ color: '#283593' }}>Target Values:</strong>
                                    {targetValues.map((tv, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                            <input
                                                style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d9e6', fontSize: 15, background: '#f5f6fa', marginRight: 4, flex: 1 }}
                                                placeholder="Target Name"
                                                value={tv.name}
                                                onChange={e => {
                                                    const arr = [...targetValues];
                                                    arr[idx].name = e.target.value;
                                                    setTargetValues(arr);
                                                }}
                                            />
                                            <input
                                                style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d9e6', fontSize: 15, background: '#f5f6fa', marginRight: 4, flex: 1 }}
                                                placeholder="Target Value"
                                                value={tv.value}
                                                onChange={e => {
                                                    const arr = [...targetValues];
                                                    arr[idx].value = e.target.value;
                                                    setTargetValues(arr);
                                                }}
                                            />
                                            <button type="button" onClick={() => setTargetValues(targetValues.filter((_, i) => i !== idx))} style={{ background: '#ff5252', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 500 }}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setTargetValues([...targetValues, { name: '', value: '' }])} style={{ background: '#283593', color: 'white', border: 'none', borderRadius: 6, padding: '7px 16px', marginTop: 4, cursor: 'pointer', fontWeight: 500 }}>
                                        Add Target
                                    </button>
                                </div>
                                <button type="submit" disabled={creating} style={{ background: '#283593', color: 'white', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: 17, marginTop: 8, cursor: creating ? 'not-allowed' : 'pointer', boxShadow: creating ? 'none' : '0 2px 8px rgba(40,53,147,0.08)' }}>
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                            </form>
                        </div>
                    </Modal>
                </>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '32px 0 18px 0' }}>
                <button type="button" onClick={() => { setShowDayChart(false); setShowTotalClicksChart(false); }} style={{ background: showDayChart || showTotalClicksChart ? '#e3e7f7' : '#283593', color: showDayChart || showTotalClicksChart ? '#283593' : 'white', border: 'none', borderRadius: 7, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>
                    Show Per-Link Stats
                </button>
                <button type="button" onClick={() => { setShowDayChart(true); setShowTotalClicksChart(false); }} style={{ background: showDayChart ? '#283593' : '#e3e7f7', color: showDayChart ? 'white' : '#283593', border: 'none', borderRadius: 7, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>
                    Show Clicks by Day of Week
                </button>
                <button type="button" onClick={() => { setShowDayChart(false); setShowTotalClicksChart(true); }} style={{ background: showTotalClicksChart ? '#283593' : '#e3e7f7', color: showTotalClicksChart ? 'white' : '#283593', border: 'none', borderRadius: 7, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>
                    Show Total Clicks Pie
                </button>
            </div>
            <h2 style={{ color: '#283593', margin: '32px 0 18px 0', textAlign: 'center' }}>Your Links</h2>
            {links.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', fontSize: 18, margin: '32px 0' }}>No links found for your account.</div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', marginBottom: 32 }}>
                    {links.map(link => (
                        <div key={link._id} style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 12px rgba(40,53,147,0.07)', padding: 18, minWidth: 320, maxWidth: 420, flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontSize: 15, color: '#283593', fontWeight: 600, wordBreak: 'break-all' }}>{`http://localhost:3000/${link._id}`}</div>
                            <div style={{ fontSize: 14, color: '#444', wordBreak: 'break-all', marginBottom: 6 }}>{link.originalUrl}</div>
                            {Array.isArray(link.targetValues) && link.targetValues.length > 0 && (
                                <div style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>
                                    <strong>Target:</strong> {link.targetValues.map((tv: { name: string; value: string }) => `${tv.name}=${tv.value}`).join(', ')}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => setSelectedLinkId(link._id)} style={{ background: '#e3e7f7', color: '#283593', border: 'none', borderRadius: 6, padding: '7px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>
                                    See Stats
                                </button>
                                <button onClick={() => setSelectedDayLinkId(link._id)} style={{ background: '#e3e7f7', color: '#283593', border: 'none', borderRadius: 6, padding: '7px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>
                                    Show Clicks by Day
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showDayChart ? (
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(40,53,147,0.08)', padding: 28, margin: '0 auto 32px auto', maxWidth: 700 }}>
                    <h2 style={{ color: '#283593', marginBottom: 18, textAlign: 'center' }}>Clicks by Day of Week (All Links)</h2>
                    <ClicksByDayOfWeekChart links={links} />
                </div>
            ) : showTotalClicksChart ? (
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(40,53,147,0.08)', padding: 28, margin: '0 auto 32px auto', maxWidth: 700, position: 'relative' }}>
                    <button onClick={() => setShowTotalClicksChart(false)} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#283593', cursor: 'pointer', zIndex: 1, fontWeight: 700, lineHeight: 1 }}>×</button>
                    <h2 style={{ color: '#283593', marginBottom: 18, textAlign: 'center' }}>Total Clicks Per Link (Pie Chart)</h2>
                    <TotalClicksPerLinkChart links={links} />
                </div>
            ) : selectedDayLinkId ? (
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(40,53,147,0.08)', padding: 28, margin: '0 auto 32px auto', maxWidth: 700 }}>
                    <h2 style={{ color: '#283593', marginBottom: 18, textAlign: 'center' }}>Clicks by Day for: {`http://localhost:3000/${selectedDayLinkId}`}</h2>
                    <ClicksByDayOfWeekChart links={links.filter(link => link._id === selectedDayLinkId)} />
                    <button onClick={() => setSelectedDayLinkId(null)} style={{ margin: '18px auto 0 auto', display: 'block', background: '#283593', color: 'white', border: 'none', borderRadius: 7, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>Close</button>
                </div>
            ) : selectedLinkId ? (
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(40,53,147,0.08)', padding: 28, margin: '0 auto 32px auto', maxWidth: 700, position: 'relative' }}>
                    <button onClick={() => setSelectedLinkId(null)} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#283593', cursor: 'pointer', zIndex: 1, fontWeight: 700, lineHeight: 1 }}>×</button>
                    <h2 style={{ color: '#283593', marginBottom: 18, textAlign: 'center' }}>Stats for: {`http://localhost:3000/${selectedLinkId}`}</h2>
                    <ClickBySourceChart linkId={selectedLinkId} token={token} />
                </div>
            ) : null}
        </>
    );
}