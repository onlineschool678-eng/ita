import React, { useState } from 'react'
import { neon } from '@neondatabase/serverless'

function Login({ onSwitchToSignup, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL)

      // ডাটাবেজ থেকে ইউজার চেক করা
      const users = await sql`SELECT * FROM users WHERE email = ${formData.email} AND password_hash = ${formData.password}`
      
      if (users.length > 0) {
        setMessage('লগইন সফল হয়েছে!')
        if (onLoginSuccess) onLoginSuccess(users[0])
      } else {
        setMessage('ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে!')
      }

    } catch (error) {
      console.error("Neon DB Error:", error)
      setMessage('লগইন করতে সমস্যা হয়েছে! .env চেক করুন।')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h2 style={styles.title}>শিক্ষার্থী লগইন</h2>

        {message && <div style={styles.statusMessage}>{message}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>ইমেইল ঠিকানা</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>পাসওয়ার্ড</label>
            <input
              type="password"
              name="password"
              placeholder="পাসওয়ার্ড দিন"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'প্রসেসিং হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        <p style={styles.switchText}>
          একাউন্ট নেই? <span onClick={onSwitchToSignup} style={styles.switchLink}>সাইন আপ করুন</span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    minHeight: '70vh',
    backgroundColor: '#f4f6f9',
  },
  authCard: {
    background: '#ffffff',
    width: '100%',
    maxWidth: '420px',
    padding: '35px 30px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  title: {
    color: '#1a365d',
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  statusMessage: {
    backgroundColor: '#feefc3',
    color: '#744210',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  input: {
    padding: '12px 14px',
    fontSize: '15px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitBtn: {
    backgroundColor: '#1a365d',
    color: '#ffffff',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  switchText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#718096',
  },
  switchLink: {
    color: '#2b6cb0',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
}

export default Login