import React, { useState } from 'react'
import { neon } from '@neondatabase/serverless'

function Signup({ selectedStream, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedStream: selectedStream || 'madrasa_to_university'
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      alert("পাসওয়ার্ড দুটি মিলছে না!")
      return
    }

    setLoading(true)

    try {
      const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL)

      const existingUser = await sql`SELECT * FROM users WHERE email = ${formData.email}`
      
      if (existingUser.length > 0) {
        setMessage('এই ইমেইল দিয়ে ইতিমধ্যেই একাউন্ট খোলা আছে!')
        setLoading(false)
        return
      }

      await sql`
        INSERT INTO users (full_name, email, password_hash, selected_stream)
        VALUES (${formData.fullName}, ${formData.email}, ${formData.password}, ${formData.selectedStream})
      `

      setMessage('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।')
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', selectedStream: '' })

    } catch (error) {
      console.error("Neon DB Error:", error)
      setMessage('ডাটাবেজে তথ্য পাঠাতে সমস্যা হয়েছে!')
    } finally {
      setLoading(false)
    }
  }

  // কোর্স নাম বাংলায় দেখানোর জন্য
  const streamDisplayName = formData.selectedStream === 'madrasa_to_university' 
    ? 'মাদ্রাসা টু বিশ্ববিদ্যালয়' 
    : formData.selectedStream === 'biggan_amar_odhikar' 
    ? 'বিজ্ঞান আমার অধিকার' 
    : formData.selectedStream;

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h2 style={styles.title}>শিক্ষার্থী সাইন আপ</h2>
        
        {formData.selectedStream && (
          <div style={styles.selectedTag}>
            নির্বাচিত কোর্স: <strong>{streamDisplayName}</strong>
          </div>
        )}

        {message && <div style={styles.statusMessage}>{message}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>পূর্ণ নাম</label>
            <input
              type="text"
              name="fullName"
              placeholder="আপনার নাম লিখুন"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

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

          <div style={styles.formGroup}>
            <label style={styles.label}>পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="পাসওয়ার্ড পুনরায় লিখুন"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'প্রসেসিং হচ্ছে...' : 'একাউন্ট তৈরি করুন'}
          </button>
        </form>

        <p style={styles.switchText}>
          ইতিমধ্যে একাউন্ট আছে? <span onClick={onSwitchToLogin} style={styles.switchLink}>লগইন করুন</span>
        </p>
      </div>
    </div>
  )
}

// ইনলাইন স্টাইল (যাতে অন্য কোনো সিএসএস মিস হলেও ডিজাইন না ভাঙে)
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
    maxWidth: '450px',
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
    marginBottom: '15px',
  },
  selectedTag: {
    fontSize: '14px',
    color: '#1a365d',
    backgroundColor: '#ebf8ff',
    border: '1px solid #bee3f8',
    padding: '8px 14px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'inline-block',
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
    transition: 'background-color 0.2s',
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

export default Signup