import React, { useState } from 'react'
import { bigganSeasons } from '../data/bigganLessons'

const BigganDashboard = ({ user }) => {
  const [completedLessons, setCompletedLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(bigganSeasons[0]?.lessons[0] || null)
  const [showExam, setShowExam] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [examResult, setExamResult] = useState(null)

  // Total Lessons Count
  const totalLessons = bigganSeasons.reduce((acc, season) => acc + season.lessons.length, 0)
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100) || 0

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  const handleExamSubmit = (correctAnswer) => {
    if (selectedAnswer === correctAnswer) {
      setExamResult('সঠিক উত্তর হয়েছে! 🎉')
    } else {
      setExamResult('ভুল উত্তর! আবার চেষ্টা করুন। ❌')
    }
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      {/* Sidebar: Lesson List */}
      <div style={{ flex: '1', background: '#1a202c', padding: '20px', borderRadius: '10px' }}>
        <h3>বিজ্ঞান আমার অধিকার</h3>
        
        {/* Progress Bar */}
        <div style={{ margin: '20px 0', background: '#2d3748', padding: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>কোর্স প্রোগ্রেস:</span>
            <b>{progressPercent}%</b>
          </div>
          <div style={{ width: '100%', background: '#4a5568', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, background: '#48bb78', height: '100%', transition: '0.3s' }}></div>
          </div>
        </div>

        {/* Chapters */}
        {bigganSeasons.map((season) => (
          <div key={season.id} style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#63b3ed' }}>{season.title}</h4>
            {season.lessons.map((lesson) => {
              const isDone = completedLessons.includes(lesson.id)
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => { setActiveLesson(lesson); setShowExam(false); setExamResult(null); }}
                  style={{
                    padding: '8px 12px',
                    margin: '5px 0',
                    background: activeLesson?.id === lesson.id ? '#3182ce' : '#2d3748',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{lesson.title}</span>
                  {isDone && <span style={{ color: '#48bb78' }}>✓</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Main Content Area: Text Lesson & Exam */}
      <div style={{ flex: '2', background: '#1a202c', padding: '25px', borderRadius: '10px' }}>
        {activeLesson ? (
          <div>
            <h2>{activeLesson.title}</h2>
            
            {!showExam ? (
              <>
                {/* Text Reading Area */}
                <div style={{ background: '#2d3748', padding: '20px', borderRadius: '8px', lineHeight: '1.8', whiteSpace: 'pre-line', margin: '20px 0' }}>
                  {activeLesson.content}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={() => handleCompleteLesson(activeLesson.id)}
                    style={{
                      padding: '10px 20px',
                      background: completedLessons.includes(activeLesson.id) ? '#38a169' : '#3182ce',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {completedLessons.includes(activeLesson.id) ? 'পড়া সম্পন্ন হয়েছে ✓' : 'Mark as Complete'}
                  </button>

                  <button 
                    onClick={() => setShowExam(true)}
                    style={{ padding: '10px 20px', background: '#d69e2e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    পরীক্ষা দিন (Take Exam) 📝
                  </button>
                </div>
              </>
            ) : (
              /* Exam Section */
              <div style={{ background: '#2d3748', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <h3>কুইজ পরীক্ষা</h3>
                {activeLesson.quiz && activeLesson.quiz.length > 0 ? (
                  activeLesson.quiz.map((q, idx) => (
                    <div key={idx}>
                      <p style={{ fontWeight: 'bold' }}>প্রশ্ন: {q.question}</p>
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="quiz" 
                            value={opt} 
                            onChange={(e) => setSelectedAnswer(e.target.value)} 
                          /> {opt}
                        </label>
                      ))}
                      <button 
                        onClick={() => handleExamSubmit(q.answer)}
                        style={{ marginTop: '15px', padding: '8px 16px', background: '#48bb78', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        উত্তর জমা দিন
                      </button>
                    </div>
                  ))
                ) : (
                  <p>এই পাঠের জন্য কোনো প্রশ্ন নেই।</p>
                )}

                {examResult && (
                  <div style={{ marginTop: '15px', fontWeight: 'bold', color: examResult.includes('সঠিক') ? '#48bb78' : '#e53e3e' }}>
                    {examResult}
                  </div>
                )}

                <button 
                  onClick={() => setShowExam(false)} 
                  style={{ marginTop: '20px', padding: '6px 12px', background: 'gray', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  ← পাঠে ফিরে যান
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>একটি পাঠ নির্বাচন করুন।</p>
        )}
      </div>

    </div>
  )
}

export default BigganDashboard