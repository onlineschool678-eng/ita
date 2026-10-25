import React, { useState, useEffect } from 'react'
import { bigganSeasons } from '../data/bigganLessons'

const BigganDashboard = ({ user, onGoHome, onLogout }) => {
  const userKey = user?.email || user?.id || 'default_student'
  
  // Storage Keys for Persistence
  const STORAGE_KEY_COMPLETED = `ita_science_completed_${userKey}`
  const STORAGE_KEY_PROFILE_PIC = `ita_profile_pic_${userKey}`
  const STORAGE_KEY_STUDENT_ID = `ita_student_id_${userKey}`
  const STORAGE_KEY_PINNED_NOTES = `ita_pinned_notes_${userKey}`

  // Profile States
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_PROFILE_PIC) || null
  })

  const [studentId] = useState(() => {
    let savedId = localStorage.getItem(STORAGE_KEY_STUDENT_ID)
    if (!savedId) {
      savedId = `ITA-SCI-${Math.floor(10000 + Math.random() * 90000)}`
      localStorage.setItem(STORAGE_KEY_STUDENT_ID, savedId)
    }
    return savedId
  })

  // Selected Subject & Lesson States
  const [activeSubject, setActiveSubject] = useState('physics')
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  // Generate 50 Lessons for each subject dynamically
  const generate50Lessons = (subjectName, prefix) => {
    return Array.from({ length: 50 }, (_, i) => {
      const lessonNum = i + 1
      const sampleContent = bigganSeasons[0]?.lessons[i % bigganSeasons[0]?.lessons.length]
      return {
        id: `${prefix}_les_${lessonNum}`,
        title: `লেসন ${lessonNum}: ${subjectName} মূলনীতি - পর্ব ${lessonNum}`,
        content: sampleContent?.content || `${subjectName}-এর লেসন ${lessonNum}-এ আপনাকে স্বাগতম!`,
        quiz: sampleContent?.quiz || [
          {
            question: `${subjectName} পাঠ ${lessonNum}-এর মূল বিষয় কোনটি?`,
            options: ["প্রয়োগিক লজিক", "পরীক্ষামূলক প্রমাণ", "থিওরিটিক্যাল বিশ্লেষণ", "সবগুলো"],
            answer: "সবগুলো"
          }
        ]
      }
    })
  }

  // Subjects with 50 Lessons Each
  const subjectsData = {
    physics: { name: '⚡ পদার্থবিজ্ঞান (Physics)', lessons: generate50Lessons('পদার্থবিজ্ঞান', 'phy') },
    chemistry: { name: '🧪 রসায়ন (Chemistry)', lessons: generate50Lessons('রসায়ন', 'chem') },
    biology: { name: '🧬 জীববিজ্ঞান (Biology)', lessons: generate50Lessons('জীববিজ্ঞান', 'bio') },
    electronics: { name: '🔌 ইলেকট্রনিক্স (Electronics)', lessons: generate50Lessons('ইলেকট্রনিক্স', 'elec') }
  }

  const [activeLesson, setActiveLesson] = useState(subjectsData.physics.lessons[0])
  const [showExam, setShowExam] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [examResult, setExamResult] = useState(null)

  // ================= 3 MINI TOOLS STATES =================
  const [toolTab, setToolTab] = useState('converter') // 'converter', 'cipher', 'notes'

  // Tool 1: Converter States
  const [convertType, setConvertType] = useState('length')
  const [fromValue, setFromValue] = useState(1)
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')
  const [convertedResult, setConvertedResult] = useState('')

  // Tool 2: Message Cipher States
  const [cipherInput, setCipherInput] = useState('')
  const [cipherShift, setCipherShift] = useState(3)
  const [cipherOutput, setCipherOutput] = useState('')

  // Tool 3: Yellow Sticky Notes States
  const [pinnedNotes, setPinnedNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PINNED_NOTES)
      return saved ? JSON.parse(saved) : ['এখানে আপনার গবেষণার নোট সেভ রাখুন! 📌']
    } catch { return [] }
  })
  const [newNoteInput, setNewNoteInput] = useState('')

  // Save Notes & Completed Lessons
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedLessons))
    } catch (e) { console.error(e) }
  }, [completedLessons])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PINNED_NOTES, JSON.stringify(pinnedNotes))
    } catch (e) { console.error(e) }
  }, [pinnedNotes])

  // Conversion Logic
  useEffect(() => {
    const val = parseFloat(fromValue) || 0
    if (convertType === 'length') {
      let meters = val
      if (fromUnit === 'km') meters = val * 1000
      if (fromUnit === 'cm') meters = val / 100
      if (fromUnit === 'mile') meters = val * 1609.34
      if (fromUnit === 'feet') meters = val * 0.3048

      let res = meters
      if (toUnit === 'km') res = meters / 1000
      if (toUnit === 'cm') res = meters * 100
      if (toUnit === 'mile') res = meters / 1609.34
      if (toUnit === 'feet') res = meters / 0.3048
      setConvertedResult(res.toFixed(4))
    } else if (convertType === 'temp') {
      if (fromUnit === 'c' && toUnit === 'f') setConvertedResult(((val * 9/5) + 32).toFixed(2))
      else if (fromUnit === 'f' && toUnit === 'c') setConvertedResult(((val - 32) * 5/9).toFixed(2))
      else setConvertedResult(val.toString())
    } else if (convertType === 'data') {
      let bytes = val
      if (fromUnit === 'kb') bytes = val * 1024
      if (fromUnit === 'mb') bytes = val * 1024 * 1024
      if (fromUnit === 'gb') bytes = val * 1024 * 1024 * 1024

      let res = bytes
      if (toUnit === 'kb') res = bytes / 1024
      if (toUnit === 'mb') res = bytes / (1024 * 1024)
      if (toUnit === 'gb') res = bytes / (1024 * 1024 * 1024)
      setConvertedResult(res.toFixed(4))
    }
  }, [fromValue, fromUnit, toUnit, convertType])

  // Cipher Logic (Caesar Cipher)
  const handleCipherAction = (type) => {
    const shift = type === 'encrypt' ? parseInt(cipherShift) : (26 - (parseInt(cipherShift) % 26))
    const result = cipherInput.split('').map(char => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65)
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97)
      }
      return char
    }).join('')
    setCipherOutput(result)
  }

  // Note Handlers
  const handleAddNote = () => {
    if (newNoteInput.trim()) {
      setPinnedNotes([...pinnedNotes, newNoteInput.trim()])
      setNewNoteInput('')
    }
  }

  const handleDeleteNote = (index) => {
    setPinnedNotes(pinnedNotes.filter((_, i) => i !== index))
  }

  // Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result
        setProfilePic(base64Image)
        localStorage.setItem(STORAGE_KEY_PROFILE_PIC, base64Image)
        try {
          await fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.email, studentId, profilePic: base64Image })
          })
        } catch (err) { console.log('API sync skipped') }
      }
      reader.readAsDataURL(file)
    }
  }

  const totalLessonsCount = 200
  const progressPercent = Math.round((completedLessons.length / totalLessonsCount) * 100) || 0

  let currentBadge = { name: 'ব্রোঞ্জ 🥉', color: '#cd7f32' }
  if (progressPercent >= 75) currentBadge = { name: 'গোল্ড 🥇', color: '#f6ad55' }
  else if (progressPercent >= 40) currentBadge = { name: 'সিলভার 🥈', color: '#a0aec0' }

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  const handleExamSubmit = (correctAnswer) => {
    if (selectedAnswer === correctAnswer) {
      setExamResult('সঠিক উত্তর হয়েছে! 🎉')
      if (activeLesson) handleCompleteLesson(activeLesson.id)
    } else {
      setExamResult('ভুল উত্তর! আবার চেষ্টা করুন। ❌')
    }
  }

  return (
    <div style={{ background: '#000000', color: '#ef4444', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* ================= 1. TOP HORIZONTAL MENU / PROFILE BAR ================= */}
      <div style={{ 
        background: '#111827', 
        border: '1px solid #ef4444', 
        borderRadius: '12px', 
        padding: '15px 25px', 
        marginBottom: '25px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '15px',
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative', width: '55px', height: '55px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #ef4444', background: '#1f2937', flexShrink: 0 }}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: '#ef4444' }}>👤</div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
              title="প্রোফাইল ছবি পরিবর্তন করুন"
            />
          </div>
          <div>
            <h3 style={{ margin: '0', fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>
              {user?.full_name || user?.email || 'শিক্ষার্থী'}
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
              ID: <span style={{ color: '#fff' }}>{studentId}</span>
            </p>
          </div>
        </div>

        <div style={{ minWidth: '180px', flex: '1', maxWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#ffffff' }}>
            <span>কোর্স প্রোগ্রেস:</span>
            <b style={{ color: '#ef4444' }}>{progressPercent}%</b>
          </div>
          <div style={{ width: '100%', background: '#1f2937', height: '8px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ef4444' }}>
            <div style={{ width: `${progressPercent}%`, background: '#ef4444', height: '100%', transition: '0.4s' }}></div>
          </div>
        </div>

        <div style={{ background: '#000000', border: `1px solid ${currentBadge.color}`, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: currentBadge.color }}>
          🏆 ব্যাচ: {currentBadge.name}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onGoHome && (
            <button 
              onClick={onGoHome}
              style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
            >
              হোম
            </button>
          )}
          {onLogout && (
            <button 
              onClick={onLogout}
              style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
            >
              লগআউট
            </button>
          )}
        </div>
      </div>

      {/* ================= 2. MAIN DASHBOARD CONTENT ================= */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE: SUBJECTS & 50 LESSONS LIST */}
        <div style={{ flex: '1', minWidth: '300px', background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#ffffff', borderBottom: '1px solid #ef4444', paddingBottom: '8px' }}>
            বিজ্ঞান বিষয়সমূহ (৫০টি লেসন/বিষয়)
          </h3>

          {Object.keys(subjectsData).map((subKey) => {
            const sub = subjectsData[subKey]
            const isSubActive = activeSubject === subKey

            return (
              <div key={subKey} style={{ marginBottom: '12px' }}>
                <div 
                  onClick={() => setActiveSubject(subKey)}
                  style={{
                    padding: '12px 15px',
                    background: isSubActive ? '#ef4444' : '#1f2937',
                    color: '#ffffff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #ef4444'
                  }}
                >
                  <span>{sub.name}</span>
                  <span>{isSubActive ? '▲' : '▼'}</span>
                </div>

                {isSubActive && (
                  <div style={{ background: '#000000', padding: '10px', borderRadius: '0 0 8px 8px', marginTop: '4px', maxHeight: '350px', overflowY: 'auto', border: '1px solid #1f2937' }}>
                    {sub.lessons.map((lesson, idx) => {
                      const isDone = completedLessons.includes(lesson.id)
                      const isUnlocked = idx === 0 || completedLessons.includes(sub.lessons[idx - 1].id) || isDone

                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => {
                            if (isUnlocked) {
                              setActiveLesson(lesson)
                              setShowExam(false)
                              setExamResult(null)
                            } else {
                              alert('🔒 আগের লেসনটি সম্পন্ন করলে এটি আনলক হবে!')
                            }
                          }}
                          style={{
                            padding: '10px 12px',
                            margin: '6px 0',
                            background: activeLesson?.id === lesson.id ? '#1d4ed8' : '#2563eb',
                            color: '#ffffff',
                            borderRadius: '6px',
                            cursor: isUnlocked ? 'pointer' : 'not-allowed',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            opacity: isUnlocked ? 1 : 0.5,
                            boxShadow: activeLesson?.id === lesson.id ? '0 0 8px rgba(37, 99, 235, 0.8)' : 'none'
                          }}
                        >
                          <span>{lesson.title}</span>
                          <span>{isDone ? '✅' : isUnlocked ? '🔓' : '🔒'}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* RIGHT SIDE: 3 MINI TOOLS (Converter, Cipher, Sticky Notes) */}
        <div style={{ flex: '2', minWidth: '320px', background: '#111827', border: '1px solid #ef4444', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          
          {/* TOOL TABS HEADER */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #374151', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setToolTab('converter')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: toolTab === 'converter' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              🔄 Universal Converter
            </button>

            <button 
              onClick={() => setToolTab('cipher')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: toolTab === 'cipher' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              🔐 Cipher Tool
            </button>

            <button 
              onClick={() => setToolTab('notes')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: toolTab === 'notes' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              📌 Sticky Notes Wall
            </button>
          </div>

          {/* TAB 1: UNIVERSAL CONVERTER */}
          {toolTab === 'converter' && (
            <div style={{ background: '#000000', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
              <h3 style={{ color: '#ffffff', marginTop: 0, fontSize: '16px' }}>ইউনিভার্সাল ইউনিট কনভার্টার</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '5px' }}>টাইপ বেছে নিন:</label>
                <select 
                  value={convertType} 
                  onChange={(e) => {
                    setConvertType(e.target.value)
                    if (e.target.value === 'length') { setFromUnit('m'); setToUnit('km') }
                    if (e.target.value === 'temp') { setFromUnit('c'); setToUnit('f') }
                    if (e.target.value === 'data') { setFromUnit('mb'); setToUnit('gb') }
                  }}
                  style={{ width: '100%', padding: '8px', background: '#1f2937', color: '#fff', border: '1px solid #ef4444', borderRadius: '6px' }}
                >
                  <option value="length">দৈর্ঘ্য (Length - Meter, KM, Mile, Feet)</option>
                  <option value="temp">তাপমাত্রা (Temperature - Celsius, Fahrenheit)</option>
                  <option value="data">ডিজিটাল ডেটা (Data - KB, MB, GB)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="number" 
                  value={fromValue} 
                  onChange={(e) => setFromValue(e.target.value)} 
                  style={{ flex: 1, padding: '10px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '6px' }} 
                />

                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} style={{ padding: '10px', background: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '6px' }}>
                  {convertType === 'length' && <><option value="m">Meter</option><option value="km">KM</option><option value="cm">CM</option><option value="mile">Mile</option><option value="feet">Feet</option></>}
                  {convertType === 'temp' && <><option value="c">Celsius (°C)</option><option value="f">Fahrenheit (°F)</option></>}
                  {convertType === 'data' && <><option value="kb">KB</option><option value="mb">MB</option><option value="gb">GB</option></>}
                </select>

                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>➔</span>

                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} style={{ padding: '10px', background: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '6px' }}>
                  {convertType === 'length' && <><option value="km">KM</option><option value="m">Meter</option><option value="cm">CM</option><option value="mile">Mile</option><option value="feet">Feet</option></>}
                  {convertType === 'temp' && <><option value="f">Fahrenheit (°F)</option><option value="c">Celsius (°C)</option></>}
                  {convertType === 'data' && <><option value="gb">GB</option><option value="mb">MB</option><option value="kb">KB</option></>}
                </select>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#1f2937', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>ফলাফল:</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#ffffff', fontSize: '22px' }}>{convertedResult} {toUnit.toUpperCase()}</h2>
              </div>
            </div>
          )}

          {/* TAB 2: CIPHER ENCRYPTION / DECRYPTION */}
          {toolTab === 'cipher' && (
            <div style={{ background: '#000000', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
              <h3 style={{ color: '#ffffff', marginTop: 0, fontSize: '16px' }}>সিক্রেট সাইফার এন্ক্রিপশন ও ডিক্রিিপশন</h3>
              
              <textarea 
                rows="3" 
                placeholder="এখানে আপনার গোপন মেসেজ লিখুন..." 
                value={cipherInput} 
                onChange={(e) => setCipherInput(e.target.value)} 
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '6px', marginBottom: '12px' }}
              />

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>Key Shift:</span>
                <input 
                  type="number" 
                  value={cipherShift} 
                  onChange={(e) => setCipherShift(e.target.value)} 
                  style={{ width: '70px', padding: '6px', background: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '4px' }} 
                />
                <button onClick={() => handleCipherAction('encrypt')} style={{ padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔒 Encrypt</button>
                <button onClick={() => handleCipherAction('decrypt')} style={{ padding: '8px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔓 Decrypt</button>
              </div>

              {cipherOutput && (
                <div style={{ padding: '12px', background: '#1f2937', borderRadius: '6px', borderLeft: '4px solid #2563eb', wordBreak: 'break-all' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>আউটপুট:</span>
                  <p style={{ margin: '4px 0 0 0', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>{cipherOutput}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: YELLOW STICKY NOTES WALL */}
          {toolTab === 'notes' && (
            <div style={{ background: '#000000', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
              <h3 style={{ color: '#ffffff', marginTop: 0, fontSize: '16px' }}>স্টুডেন্ট পিন্‌ড নোটস ওয়াল 📌</h3>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="নতুন নোট পিন করুন..." 
                  value={newNoteInput} 
                  onChange={(e) => setNewNoteInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  style={{ flex: 1, padding: '10px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '6px' }} 
                />
                <button onClick={handleAddNote} style={{ padding: '10px 18px', background: '#eab308', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Pin Note</button>
              </div>

              {/* Yellow Notes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', maxHeight: '280px', overflowY: 'auto' }}>
                {pinnedNotes.map((note, index) => (
                  <div key={index} style={{ background: '#fef08a', color: '#854d0e', padding: '14px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', position: 'relative', fontWeight: '600', fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                    <button 
                      onClick={() => handleDeleteNote(index)} 
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                      title="নোট মুছুন"
                    >
                      ✕
                    </button>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default BigganDashboard