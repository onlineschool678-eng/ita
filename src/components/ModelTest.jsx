import React, { useState, useEffect } from 'react'
import { neon } from '@neondatabase/serverless'

const DATABASE_URL = "postgresql://neondb_owner:npg_BArOdMIs4hP1@ep-wandering-dream-b5q413mu-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
const sql = neon(DATABASE_URL)

const ModelTest = ({ onBack }) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // ১০ মিনিটের টাইমার (১০ মিনিট = ৬০০ সেকেন্ড)
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    fetchModelTestQuestions()
  }, [])

  // টাইমার কাউন্টডাউন লজিক
  useEffect(() => {
    if (loading || isSubmitted || questions.length === 0) return

    if (timeLeft <= 0) {
      handleExamSubmit() // সময় শেষ হলে অটোমেটিক সাবমিট
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, loading, isSubmitted, questions])

  // Neon DB থেকে র্যান্ডম ২০টি প্রশ্ন লোড করার ফংশন
  const fetchModelTestQuestions = async () => {
    setLoading(true)
    try {
      // model_test_questions টেবিল তৈরি না থাকলে তৈরি করবে
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

      // ডেটাবেজ থেকে র্যান্ডম ২০টি প্রশ্ন তুলে আনা (RANDOM() Query)
      const result = await sql`
        SELECT * FROM model_test_questions ORDER BY RANDOM() LIMIT 20;
      `
      setQuestions(result)
    } catch (error) {
      console.error("Model Test Questions Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // অপশন সিলেক্ট করা
  const handleSelectOption = (qId, optionIndex) => {
    if (isSubmitted) return
    setUserAnswers({
      ...userAnswers,
      [qId]: optionIndex
    })
  }

  // এক্সাম সাবমিট করার ফংশন
  const handleExamSubmit = () => {
    let calculatedScore = 0
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) {
        calculatedScore += 1
      }
    })
    setScore(calculatedScore)
    setIsSubmitted(true)
  }

  // সময়কে minute:second ফরম্যাটে কনভার্ট করা
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div style={{ background: '#1a202c', padding: '25px', borderRadius: '10px', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #3182ce', paddingBottom: '15px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#f6ad55' }}>📝 ২০ মার্কস মডেল টেস্ট</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#a0aec0' }}>মোট প্রশ্ন: ২০টি | সময়: ১০ মিনিট</p>
        </div>

        {/* Floating Timer */}
        {!loading && questions.length > 0 && !isSubmitted && (
          <div style={{ background: timeLeft < 60 ? '#e53e3e' : '#2b6cb0', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px' }}>
            ⏱️ সময় বাকি: {formatTime(timeLeft)}
          </div>
        )}

        <button 
          onClick={onBack}
          style={{ padding: '8px 16px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← ড্যাশবোর্ডে ফিরে যান
        </button>
      </div>

      {/* Loading View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>🔄 ডেটাবেজ থেকে মডেল টেস্টের প্রশ্ন লোড হচ্ছে...</h3>
        </div>
      ) : questions.length === 0 ? (
        /* Empty View */
        <div style={{ textAlign: 'center', padding: '40px', background: '#2d3748', borderRadius: '8px' }}>
          <h3>⚠️ ডেটাবেজে কোনো মডেল টেস্টের প্রশ্ন পাওয়া যায়নি!</h3>
          <p style={{ color: '#a0aec0' }}>অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে মডেল টেস্টের প্রশ্ন যুক্ত করুন।</p>
        </div>
      ) : (
        /* Question List */
        <div>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ background: '#2d3748', padding: '15px 20px', borderRadius: '8px', marginBottom: '15px' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: 0 }}>
                {idx + 1}. {q.question}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {q.options && q.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[q.id] === oIdx
                  const isCorrect = q.correct_answer === oIdx

                  let optionBg = '#1a202c'
                  if (isSubmitted) {
                    if (isCorrect) optionBg = '#2f855a' // সঠিক উত্তর - সবুজ
                    else if (isSelected) optionBg = '#c53030' // ভুল পছন্দ - লাল
                  } else if (isSelected) {
                    optionBg = '#3182ce' // সিলেক্টেড - নীল
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      style={{
                        padding: '10px 12px',
                        background: optionBg,
                        borderRadius: '6px',
                        cursor: isSubmitted ? 'default' : 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: isSelected ? '1px solid #63b3ed' : '1px solid transparent'
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`q_${q.id}`} 
                        checked={isSelected}
                        onChange={() => {}}
                        disabled={isSubmitted} 
                      />
                      <span>{opt}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Exam Result / Submit Button */}
          {!isSubmitted ? (
            <button
              onClick={handleExamSubmit}
              style={{
                width: '100%',
                padding: '14px',
                background: '#38a169',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              ✅ মডেল টেস্ট জমা দিন (Submit Exam)
            </button>
          ) : (
            <div style={{ background: '#2b6cb0', padding: '20px', borderRadius: '8px', textAlign: 'center', marginTop: '20px' }}>
              <h2 style={{ margin: 0 }}>🎉 ফলাফল: ২০-এর মধ্যে পেয়েছেন {score} মার্কস!</h2>
              <p style={{ margin: '10px 0 0 0' }}>উপরে সবুজ রঙ্গে সঠিক উত্তর এবং লাল রঙ্গে ভুল উত্তর দেখানো হয়েছে।</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ModelTest