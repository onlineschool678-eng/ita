import React, { useState, useEffect } from 'react'
import { neon } from '@neondatabase/serverless'

// Neon Database Connection String
const DATABASE_URL = "postgresql://neondb_owner:npg_BArOdMIs4hP1@ep-wandering-dream-b5q413mu-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
const sql = neon(DATABASE_URL)

const AdminPanel = ({ onBack }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingEmail, setUpdatingEmail] = useState(null)

  // Course Selection Map State
  const [selectedCourseMap, setSelectedCourseMap] = useState({})

  // Model Test Question Form States
  const [selectedSubject, setSelectedSubject] = useState('bangla')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available subjects for model test
  const subjectList = [
    { id: 'bangla', name: '📚 বাংলা' },
    { id: 'english', name: '🇬🇧 ইংরেজি' },
    { id: 'gk', name: '🌍 সাধারণ জ্ঞান' },
    { id: 'science', name: '🧪 বিজ্ঞান' },
    { id: 'ict', name: '💻 তথ্য ও যোগাযোগ প্রযুক্তি (ICT)' }
  ]

  // Page Load
  useEffect(() => {
    const setupApp = async () => {
      await initModelTestTable()
      await fetchUsersFromDatabase()
    }
    setupApp()
  }, [])

  // Create Model Test Table if not exists
  const initModelTestTable = async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS model_test_questions (
          id SERIAL PRIMARY KEY,
          subject_id VARCHAR(50) DEFAULT 'general',
          question TEXT NOT NULL,
          options JSONB NOT NULL,
          correct_answer INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
      await sql`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS enrolled_course VARCHAR(50) DEFAULT 'madrasa';
      `
    } catch (error) {
      console.error("Model Test Table Initialization Error:", error)
    }
  }

  // Fetch Users
  const fetchUsersFromDatabase = async () => {
    setLoading(true)
    try {
      const result = await sql`SELECT * FROM users ORDER BY created_at DESC;`
      setUsers(result)

      // Initialize selected course map for each user
      const initialMap = {}
      result.forEach(u => {
        initialMap[u.email] = u.enrolled_course || 'madrasa'
      })
      setSelectedCourseMap(initialMap)
    } catch (error) {
      console.error("Neon DB Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Active/Inactive Toggle with Enrolled Course
  const handleToggleActive = async (userItem) => {
    const nextStatus = !userItem.is_active
    const nextPaymentStatus = nextStatus ? 'paid' : 'unpaid'
    const targetCourse = selectedCourseMap[userItem.email] || 'madrasa'
    
    setUpdatingEmail(userItem.email)

    try {
      await sql`
        UPDATE users 
        SET is_active = ${nextStatus}, 
            payment_status = ${nextPaymentStatus},
            enrolled_course = ${targetCourse}
        WHERE email = ${userItem.email};
      `

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.email === userItem.email
            ? { ...u, is_active: nextStatus, payment_status: nextPaymentStatus, enrolled_course: targetCourse }
            : u
        )
      )

      alert(`গট ইট! ইউজার (${userItem.full_name || userItem.email}) সফলভাবে '${targetCourse === 'biggan' ? 'বিজ্ঞান ড্যাশবোর্ড' : 'মাদ্রাসা টু বিশ্ববিদ্যালয়'}' কোর্সে ${nextStatus ? 'ACTIVE & PAID' : 'INACTIVE'} করা হয়েছে!`)
    } catch (error) {
      console.error("Database Update Error:", error)
      alert("Database-এ আপডেট ব্যর্থ হয়েছে!")
    } finally {
      setUpdatingEmail(null)
    }
  }

  // Option text change handler
  const handleOptionChange = (idx, value) => {
    const updatedOptions = [...options]
    updatedOptions[idx] = value
    setOptions(updatedOptions)
  }

  // Direct Model Test Question Insert into Database
  const handleAddModelTestQuestion = async (e) => {
    e.preventDefault()

    if (!questionText.trim()) {
      alert("অনুগ্রহ করে প্রশ্ন টাইপ করুন!")
      return
    }

    if (options.some(opt => !opt.trim())) {
      alert("অনুগ্রহ করে ৪টি অপশনই সঠিকভাবে পূরণ করুন!")
      return
    }

    setIsSubmitting(true)

    try {
      const optionsJson = JSON.stringify(options)

      await sql`
        INSERT INTO model_test_questions (subject_id, question, options, correct_answer)
        VALUES (${selectedSubject}, ${questionText.trim()}, ${optionsJson}::jsonb, ${correctAnswer});
      `

      alert("🎉 সফলভাবে মডেল টেস্টের প্রশ্ন ডেটাবেজে যুক্ত হয়েছে!")

      // Reset Form
      setQuestionText('')
      setOptions(['', '', '', ''])
      setCorrectAnswer(0)
    } catch (error) {
      console.error("Model Test Insert Error:", error)
      alert("প্রশ্ন সেভ করতে সমস্যা হয়েছে! ইন্টারনেট বা DB কানেকশন চেক করুন।")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#4fd1c5' }}>👑 ITA অ্যাডমিন প্যানেল</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#a0aec0' }}>সরাসরি Neon PostgreSQL ডেটাবেজ সিঙ্কed</p>
        </div>
        
        <button 
          onClick={onBack}
          style={{ padding: '10px 18px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          মেনুতে ফিরে যান
        </button>
      </div>

      {/* NEW: DIRECT MODEL TEST QUESTION ADD SECTION */}
      <div style={{ background: '#1a202c', borderRadius: '10px', padding: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid #2d3748' }}>
        <h3 style={{ marginTop: 0, color: '#f6ad55', borderBottom: '1px solid #2d3748', paddingBottom: '10px' }}>
          📝 মডেল টেস্টের প্রশ্ন ব্যাংক ম্যানেজমেন্ট (Direct Database Insert)
        </h3>

        <form onSubmit={handleAddModelTestQuestion}>
          {/* Subject Selector */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e0', marginBottom: '5px', fontWeight: 'bold' }}>
              বিষয় নির্বাচন করুন (Subject):
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#2d3748', color: '#fff', border: '1px solid #4a5568', borderRadius: '6px', outline: 'none' }}
            >
              {subjectList.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e0', marginBottom: '5px', fontWeight: 'bold' }}>
              প্রশ্ন লিখুন (Question):
            </label>
            <input
              type="text"
              placeholder="যেমন: 'আমার পথ' প্রবন্ধে প্রাবন্ধিকের প্রধান লক্ষ্য কী ছিল?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              style={{ width: '100%', padding: '11px', background: '#2d3748', color: '#fff', border: '1px solid #4a5568', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* 4 Options Input Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            {options.map((opt, idx) => (
              <div key={idx}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0aec0', marginBottom: '4px' }}>
                  অপশন {idx + 1}:
                </label>
                <input
                  type="text"
                  placeholder={`অপশন ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  style={{ width: '100%', padding: '9px', background: '#2d3748', color: '#fff', border: '1px solid #4a5568', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          {/* Correct Option Dropdown */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e0', marginBottom: '5px', fontWeight: 'bold' }}>
              সঠিক উত্তর কোনটা? (Correct Answer):
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', background: '#2d3748', color: '#fff', border: '1px solid #4a5568', borderRadius: '6px', outline: 'none' }}
            >
              {options.map((opt, idx) => (
                <option key={idx} value={idx}>
                  অপশন {idx + 1}: {opt ? opt : `(অপশন ${idx + 1})`}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              background: '#38a169',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'ডেটাবেজে সেভ হচ্ছে...' : '📥 ডেটাবেজে মডেল টেস্টের প্রশ্ন সেভ করুন'}
          </button>
        </form>
      </div>

      {/* User Table Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>🔄 Neon Database থেকে ইউজার ডেটা লোড হচ্ছে...</h3>
        </div>
      ) : (
        <div style={{ background: '#1a202c', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#2d3748', color: '#cbd5e0' }}>
                <th style={{ padding: '14px' }}>নাম / ইউজার</th>
                <th style={{ padding: '14px' }}>ইমেইল</th>
                <th style={{ padding: '14px' }}>কোর্স নির্বাচন</th>
                <th style={{ padding: '14px' }}>পেমেন্ট স্ট্যাটাস</th>
                <th style={{ padding: '14px' }}>অ্যাকাউন্ট স্ট্যাটাস</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>অ্যাকশন (Approve)</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>কোনো ইউজার পাওয়া যায়নি।</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.email} style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '14px', fontWeight: 'bold', color: '#e2e8f0' }}>
                      {u.full_name || 'N/A'}
                    </td>
                    <td style={{ padding: '14px', color: '#cbd5e0' }}>{u.email}</td>
                    
                    {/* Course Selection Dropdown */}
                    <td style={{ padding: '14px' }}>
                      <select
                        value={selectedCourseMap[u.email] || 'madrasa'}
                        onChange={(e) => setSelectedCourseMap({ ...selectedCourseMap, [u.email]: e.target.value })}
                        style={{ padding: '6px 8px', background: '#2d3748', color: '#fff', border: '1px solid #4a5568', borderRadius: '4px', outline: 'none', fontSize: '13px' }}
                      >
                        <option value="madrasa">🎓 মাদ্রাসা টু বিশ্ববিদ্যালয়</option>
                        <option value="biggan">🧪 বিজ্ঞান ড্যাশবোর্ড</option>
                      </select>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        fontSize: '12px',
                        background: u.payment_status === 'paid' ? 'rgba(72, 187, 120, 0.2)' : 'rgba(229, 62, 62, 0.2)',
                        color: u.payment_status === 'paid' ? '#48bb78' : '#f56565' 
                      }}>
                        {u.payment_status ? u.payment_status.toUpperCase() : (u.is_active ? 'PAID' : 'UNPAID')}
                      </span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{ 
                        padding: '5px 12px', 
                        borderRadius: '12px', 
                        background: u.is_active ? '#2f855a' : '#c53030', 
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {u.is_active ? `ACTIVE (${u.enrolled_course || 'madrasa'})` : 'INACTIVE'}
                      </span>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <button 
                        disabled={updatingEmail === u.email}
                        onClick={() => handleToggleActive(u)}
                        style={{ 
                          padding: '8px 16px', 
                          background: u.is_active ? '#e53e3e' : '#38a169', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '5px', 
                          cursor: updatingEmail === u.email ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          opacity: updatingEmail === u.email ? 0.6 : 1
                        }}
                      >
                        {updatingEmail === u.email 
                          ? 'Updating DB...' 
                          : (u.is_active ? 'Deactivate' : 'Approve & Activate')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel