import React, { useState, useEffect, useCallback } from 'react';

function ViewResumes({ refreshTrigger }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/resumes/all');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResumes(data.resumes || []);
    } catch (err) {
      setError('Cannot reach backend. Ensure Spring Boot is running on :8080.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResumes(); }, [fetchResumes, refreshTrigger]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete resume for "${name}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== id));
        if (selected?.id === id) setSelected(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch {
      alert('Network error during delete.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = resumes.filter(r => {
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.skills?.toLowerCase().includes(q)
    );
  });

  const skillBadges = (skillStr) => {
    if (!skillStr) return null;
    return skillStr.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
      <span key={i} className="badge badge-sky" style={{ marginRight: 4, marginBottom: 4 }}>
        {skill}
      </span>
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h2 className="section-title">All Resumes</h2>
          <p className="section-sub">{'// '}{resumes.length} candidate{resumes.length !== 1 ? 's' : ''} in the database</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchResumes} disabled={loading}>
          {loading ? <span className="spinner" style={{ borderTopColor: 'var(--text-muted)', borderColor: 'var(--border2)' }} /> : '↻'} Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          <span>✗</span> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && resumes.length === 0 && (
        <div className="card">
          {[1,2,3].map(i => (
            <div key={i} style={{
              height: 54, background: 'var(--surface2)', borderRadius: 8,
              marginBottom: 12, opacity: 1 - i * 0.2,
              animation: 'pulse 1.4s ease-in-out infinite',
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && resumes.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📄</div>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No resumes yet</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
            Upload your first resume to get started
          </p>
        </div>
      )}

      {/* Content */}
      {resumes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 24 }}>
          {/* List panel */}
          <div>
            {/* Search */}
            <div style={{ marginBottom: 16 }}>
              <input
                className="form-input"
                placeholder="Search by name, email, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 400 }}
              />
            </div>

            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                No resumes match your search.
              </div>
            )}

            {filtered.map(r => (
              <div
                key={r.id}
                className="card"
                style={{
                  marginBottom: 12,
                  cursor: 'pointer',
                  border: selected?.id === r.id ? '1px solid var(--sky)' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                  padding: '20px 24px',
                }}
                onClick={() => setSelected(selected?.id === r.id ? null : r)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--sky), var(--indigo))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0,
                    }}>
                      {(r.name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                      <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--text-muted)' }}>
                        {r.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={e => { e.stopPropagation(); handleDelete(r.id, r.name); }}
                      disabled={deleting === r.id}
                      style={{ padding: '6px 12px' }}
                    >
                      {deleting === r.id ? <span className="spinner" style={{ borderTopColor: 'var(--rose)', borderColor: 'rgba(251,113,133,0.3)', width:14, height:14 }} /> : '✕'}
                    </button>
                  </div>
                </div>

                {/* Skills preview */}
                {r.skills && (
                  <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                    {skillBadges(r.skills)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div>
              <div className="card" style={{ position: 'sticky', top: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Profile Detail</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                </div>

                {/* Avatar */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--sky), var(--indigo))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 28, color: '#fff', margin: '0 auto 12px',
                    boxShadow: '0 0 24px rgba(56,189,248,0.25)',
                  }}>
                    {(selected.name || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: 'var(--sky)', marginTop: 4 }}>
                    {selected.email}
                  </div>
                </div>

                <DetailRow label="ID" value={<span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text-dim)', wordBreak: 'break-all' }}>{selected.id}</span>} />
                <DetailRow label="Uploaded" value={formatDate(selected.uploadedAt)} mono />

                {selected.skills && (
                  <div style={{ marginBottom: 16 }}>
                    <div className="form-label" style={{ marginBottom: 8 }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>{skillBadges(selected.skills)}</div>
                  </div>
                )}

                {selected.experience && <DetailRow label="Experience" value={selected.experience} />}
                {selected.education && <DetailRow label="Education" value={selected.education} />}
                {selected.summary && <DetailRow label="Summary" value={selected.summary} />}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="form-label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{
        fontSize: 13,
        color: 'var(--text)',
        lineHeight: 1.5,
        fontFamily: mono ? "'DM Mono', monospace" : undefined,
      }}>
        {value || '—'}
      </div>
    </div>
  );
}

export default ViewResumes;
