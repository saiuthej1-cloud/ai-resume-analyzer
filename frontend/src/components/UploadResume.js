import React, { useState } from 'react';

const INITIAL_FORM = {
  name: '',
  email: '',
  skills: '',
  experience: '',
  education: '',
  summary: '',
};

function UploadResume({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [rawJson, setRawJson] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.skills.trim()) e.skills = 'Skills are required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    setAlert(null);

    let payload;
    if (jsonMode) {
      try {
        payload = JSON.parse(rawJson);
      } catch {
        setAlert({ type: 'error', msg: 'Invalid JSON — please fix the syntax and try again.' });
        return;
      }
    } else {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      payload = { ...form };
    }

    setLoading(true);
    try {
      const res = await fetch('/api/resumes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({
          type: 'error',
          msg: data.message || data.error || 'Failed to upload resume.',
        });
      } else {
        setAlert({
          type: 'success',
          msg: `Resume for "${data.resume?.name || 'candidate'}" uploaded successfully!`,
        });
        setForm(INITIAL_FORM);
        setRawJson('');
        setErrors({});
        if (onSuccess) setTimeout(onSuccess, 1200);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        msg: 'Cannot reach backend. Is Spring Boot running on :8080?',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    if (jsonMode) {
      setRawJson(
        JSON.stringify(
          {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            skills: 'Java, Spring Boot, React, PostgreSQL, Docker',
            experience: '5 years of backend development at FinTech startups',
            education: 'B.Tech Computer Science, IIT Bombay',
            summary: 'Passionate engineer with strong distributed systems background',
          },
          null,
          2
        )
      );
    } else {
      setForm({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        skills: 'Java, Spring Boot, React, PostgreSQL, Docker',
        experience: '5 years of backend development at FinTech startups',
        education: 'B.Tech Computer Science, IIT Bombay',
        summary: 'Passionate engineer with strong distributed systems background',
      });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 className="section-title">Upload Resume</h2>
        <p className="section-sub">{"// Add a new candidate profile to the analyzer"}</p>
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn btn-sm ${!jsonMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setJsonMode(false)}
            >
              Form
            </button>
            <button
              className={`btn btn-sm ${jsonMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setJsonMode(true)}
            >
              {'{ } JSON'}
            </button>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={loadSample}>
            Load Sample
          </button>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
            <span>{alert.type === 'success' ? '✓' : '✗'}</span>
            {alert.msg}
          </div>
        )}

        {!jsonMode && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                className={`form-input ${errors.name ? 'error' : ''}`}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Jane Smith"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. jane@company.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group full">
              <label className="form-label">
                Skills <span className="required">*</span>
              </label>
              <input
                className={`form-input ${errors.skills ? 'error' : ''}`}
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g. Java, Spring Boot, React, SQL"
              />
              {errors.skills && <span className="field-error">{errors.skills}</span>}
            </div>

            <div className="form-group full">
              <label className="form-label">Experience</label>
              <textarea
                className="form-textarea"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Describe work experience..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Education</label>
              <input
                className="form-input"
                name="education"
                value={form.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech CS, IIT Delhi"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Summary</label>
              <input
                className="form-input"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                placeholder="One-line professional summary"
              />
            </div>
          </div>
        )}

        {jsonMode && (
          <div className="form-group full">
            <label className="form-label">Raw JSON Payload</label>
            <textarea
              className="form-textarea"
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              placeholder={`{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "skills": "Java, Spring Boot, React"\n}`}
              rows={12}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.6 }}
            />
          </div>
        )}

        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Uploading…
              </>
            ) : (
              '⊕ Submit Resume'
            )}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setForm(INITIAL_FORM);
              setRawJson('');
              setErrors({});
              setAlert(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            ℹ
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
                color: 'var(--sky)',
              }}
            >
              Required JSON Format
            </p>
            <pre
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                background: 'var(--surface2)',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
{`{
  "name":       "John Doe",
  "email":      "john@example.com",
  "skills":     "Java, React, SQL",
  "experience": "...",
  "education":  "...",
  "summary":    "..."
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadResume;