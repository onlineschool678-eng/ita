import React, { useState } from 'react'
import { banglaAllTopics } from '../data/madrasa/bangla'
import ModelTest from './ModelTest'

const MadrasaDashboard = ({ user }) => {
  const safeBanglaTopics = banglaAllTopics || []

  // Track completed lessons and passed exam topic IDs
  const [completedLessons, setCompletedLessons] = useState([])
  const [passedExams, setPassedExams] = useState([])
  
  // Selected Subject & Topic
  const [openSubject, setOpenSubject] = useState('bangla')
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [showModelTest, setShowModelTest] = useState(false)

  // Slide Navigation State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Quiz submission states
  const [userAnswers, setUserAnswers] = useState({})
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const activeTopic = safeBanglaTopics[activeTopicIndex] || null

  const subjects = [
    { id: 'bangla', name: '📚 বাংলা', count: safeBanglaTopics.length, data: safeBanglaTopics },
    { id: 'english', name: '🇬🇧 ইংরেজি', count: 0, data: [] },
    { id: 'gk', name: '🌍 সাধারণ জ্ঞান', count: 0, data: [] },
    { id: 'science', name: '🧪 বিজ্ঞান', count: 0, data: [] },
    { id: 'ict', name: '💻 তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', count: 0, data: [] },
  ]

  const progressPercent = safeBanglaTopics.length > 0 
    ? Math.round((passedExams.length / safeBanglaTopics.length) * 100) 
    : 0

  const handleMarkLessonComplete = (topicId) => {
    if (!completedLessons.includes(topicId)) {
      setCompletedLessons([...completedLessons, topicId])
    }
  }

  const handleOptionSelect = (questionId, optionIdx) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIdx
    })
  }

  const handleExamSubmit = () => {
    if (!activeTopic) return
    
    let correctCount = 0
    const questions = activeTopic.examQuestions || []
    
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1
      }
    })

    setScore(correctCount)
    setExamSubmitted(true)

    if (!passedExams.includes(activeTopic.id)) {
      setPassedExams([...passedExams, activeTopic.id])
    }
  }

  const handleSelectTopic = (index) => {
    setActiveTopicIndex(index)
    setShowModelTest(false)
    setUserAnswers({})
    setExamSubmitted(false)
    setScore(0)
    setCurrentSlideIndex(0)
  }

  // Current Slide Object Safe Extraction
  const currentSlide = activeTopic?.slides?.[currentSlideIndex] || null

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ flex: '1', background: '#1a202c', padding: '20px', borderRadius: '10px', minWidth: '300px' }}>
        <h3 style={{ borderBottom: '2px solid #3182ce', paddingBottom: '10px', marginTop: 0 }}>
          🎓 মাদ্রাসা টু বিশ্ববিদ্যালয়
        </h3>
        
        {/* Progress Bar */}
        <div style={{ margin: '15px 0', background: '#2d3748', padding: '12px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
            <span>কোর্স প্রোগ্রেস:</span>
            <b>{progressPercent}%</b>
          </div>
          <div style={{ width: '100%', background: '#4a5568', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, background: '#48bb78', height: '100%', transition: '0.4s' }}></div>
          </div>
        </div>

        {/* Model Test Button */}
        <button
          onClick={() => setShowModelTest(true)}
          style={{
            width: '100%',
            padding: '12px',
            background: showModelTest ? '#e53e3e' : '#dd6b20',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            marginBottom: '15px'
          }}
        >
          📝 ২০ মার্কস মডেল টেস্ট
        </button>

        {/* SUBJECT DROPDOWNS */}
        {subjects.map((sub) => {
          const isOpen = openSubject === sub.id
          return (
            <div key={sub.id} style={{ marginBottom: '10px', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                onClick={() => setOpenSubject(isOpen ? null : sub.id)}
                style={{
                  background: isOpen ? '#2b6cb0' : '#2d3748',
                  padding: '12px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  borderRadius: '6px'
                }}
              >
                <span>{sub.name}</span>
                <span style={{ fontSize: '12px', color: '#cbd5e0' }}>
                  {sub.count > 0 ? `(${sub.count}টি টপিক)` : ''} {isOpen ? '▲' : '▼'}
                </span>
              </div>

              {isOpen && (
                <div style={{ background: '#171923', padding: '8px', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                  {sub.data.length > 0 ? (
                    sub.data.map((topic, index) => {
                      const isUnlocked = index === 0 || passedExams.includes(sub.data[index - 1]?.id)
                      const isActive = activeTopicIndex === index && !showModelTest && openSubject === 'bangla'
                      const isPassed = passedExams.includes(topic.id)

                      return (
                        <div
                          key={topic.id || index}
                          onClick={() => {
                            if (isUnlocked) {
                              handleSelectTopic(index)
                            } else {
                              alert('🔒 এই টপিকটি দেখার আগে আগের টপিকের এক্সাম শেষ করতে হবে!')
                            }
                          }}
                          style={{
                            padding: '10px 12px',
                            margin: '4px 0',
                            background: isActive ? '#3182ce' : isUnlocked ? '#2d3748' : '#1a202c',
                            color: isUnlocked ? '#fff' : '#718096',
                            borderRadius: '5px',
                            cursor: isUnlocked ? 'pointer' : 'not-allowed',
                            fontSize: '13px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            opacity: isUnlocked ? 1 : 0.6
                          }}
                        >
                          <span>{topic.topicName}</span>
                          <span>
                            {isPassed ? '✅' : isUnlocked ? '🔓' : '🔒'}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ padding: '10px', fontSize: '12px', color: '#a0aec0', textAlign: 'center' }}>
                      শীঘ্রই টপিকগুলো যুক্ত করা হবে...
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: '2', background: '#1a202c', padding: '25px', borderRadius: '10px' }}>
        {showModelTest ? (
          <ModelTest 
            allSubjectsData={safeBanglaTopics} 
            onBack={() => setShowModelTest(false)} 
          />
        ) : activeTopic ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: '#3182ce', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                {activeTopic.category || 'বাংলা'}
              </span>
              <span style={{ fontSize: '13px', color: '#a0aec0' }}>
                টপিক {activeTopicIndex + 1} / {safeBanglaTopics.length}
              </span>
            </div>

            <h2 style={{ marginTop: '12px', color: '#fff', borderBottom: '1px solid #4a5568', paddingBottom: '10px' }}>
              {activeTopic.topicName}
            </h2>

            {/* 📖 SLIDE-BASED LESSON NOTES SECTION */}
            {activeTopic.slides && activeTopic.slides.length > 0 ? (
              <div style={{ background: '#2d3748', padding: '20px', borderRadius: '8px', margin: '15px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #4a5568', paddingBottom: '10px' }}>
                  <h4 style={{ color: '#48bb78', margin: 0 }}>
                    📖 {currentSlide?.title || 'লেসন নোটস'}
                  </h4>
                  <span style={{ fontSize: '12px', background: '#3182ce', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    স্লাইড {currentSlideIndex + 1} / {activeTopic.slides.length}
                  </span>
                </div>

                {/* Slide Content Display */}
                <div style={{ background: '#1a202c', padding: '20px', borderRadius: '6px', minHeight: '200px', lineHeight: '1.8' }}>
                  {currentSlide?.content ? (
                    Array.isArray(currentSlide.content) ? (
                      currentSlide.content.map((point, idx) => (
                        <p key={idx} style={{ margin: '8px 0', color: '#cbd5e0', fontSize: '15px' }}>
                          • {typeof point === 'string' ? point.replace(/\*\*/g, '') : point}
                        </p>
                      ))
                    ) : (
                      <p style={{ color: '#cbd5e0' }}>{String(currentSlide.content)}</p>
                    )
                  ) : (
                    <p style={{ color: '#a0aec0' }}>কোনো কন্টেন্ট পাওয়া যায়নি।</p>
                  )}
                </div>

                {/* Slide Control Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                    style={{
                      padding: '10px 18px',
                      background: currentSlideIndex === 0 ? '#4a5568' : '#3182ce',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ← আগের স্লাইড
                  </button>

                  {currentSlideIndex < activeTopic.slides.length - 1 ? (
                    <button
                      onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                      style={{
                        padding: '10px 18px',
                        background: '#3182ce',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      পরের স্লাইড →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkLessonComplete(activeTopic.id)}
                      style={{
                        padding: '10px 20px',
                        background: completedLessons.includes(activeTopic.id) ? '#38a169' : '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {completedLessons.includes(activeTopic.id) 
                        ? 'পড়া সম্পন্ন হয়েছে ✓ (কুইজ আনলকড)' 
                        : 'পড়া সম্পন্ন করুন (Mark as Complete) 📖'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Fallback for Standard Lessons */
              activeTopic.lessons?.length > 0 && (
                <div style={{ background: '#2d3748', padding: '20px', borderRadius: '8px', lineHeight: '1.8', margin: '15px 0' }}>
                  <h4 style={{ color: '#48bb78', margin: '0 0 10px 0' }}>📖 লেসন নোটস</h4>
                  {activeTopic.lessons.map((les, idx) => (
                    <div key={les.id || idx} style={{ marginBottom: '15px' }}>
                      <h5 style={{ margin: '5px 0', fontSize: '16px', color: '#e2e8f0' }}>{les.title}</h5>
                      <p style={{ whiteSpace: 'pre-line', color: '#cbd5e0', margin: 0 }}>{les.content}</p>
                    </div>
                  ))}

                  <button
                    onClick={() => handleMarkLessonComplete(activeTopic.id)}
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      background: completedLessons.includes(activeTopic.id) ? '#38a169' : '#3182ce',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      width: '100%'
                    }}
                  >
                    {completedLessons.includes(activeTopic.id) 
                      ? 'পড়া সম্পন্ন হয়েছে ✓ (এক্সাম আনলকড)' 
                      : 'পড়া সম্পন্ন করুন (Mark as Complete) 📖'}
                  </button>
                </div>
              )
            )}

            {/* Topic Exam Section */}
            <div style={{ background: '#2d3748', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
              <h4 style={{ color: '#f6ad55', margin: '0 0 15px 0' }}>✍️ টপিক এক্সাম (কুইজ)</h4>

              {!completedLessons.includes(activeTopic.id) ? (
                <div style={{ padding: '20px', background: '#1a202c', textAlign: 'center', borderRadius: '6px', color: '#e53e3e' }}>
                  🔒 পরীক্ষা দেওয়ার জন্য আগে উপরের <b>"পড়া সম্পন্ন করুন"</b> বাটনে ক্লিক করুন।
                </div>
              ) : (
                <div>
                  {activeTopic.examQuestions?.map((q, idx) => (
                    <div key={q.id || idx} style={{ background: '#1a202c', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                      <p style={{ fontWeight: 'bold', marginTop: 0 }}>{idx + 1}. {q.question}</p>
                      
                      {q.options?.map((opt, oIdx) => {
                        const isSelected = userAnswers[q.id] === oIdx
                        const isCorrect = q.correctAnswer === oIdx
                        
                        let optionBg = '#2d3748'
                        if (examSubmitted) {
                          if (isCorrect) optionBg = '#2f855a'
                          else if (isSelected) optionBg = '#c53030'
                        }

                        return (
                          <label 
                            key={oIdx} 
                            style={{ 
                              display: 'block', 
                              margin: '8px 0', 
                              padding: '10px', 
                              background: optionBg, 
                              borderRadius: '5px', 
                              cursor: examSubmitted ? 'default' : 'pointer' 
                            }}
                          >
                            <input 
                              type="radio" 
                              name={`quiz_${q.id}`} 
                              checked={isSelected}
                              disabled={examSubmitted}
                              onChange={() => handleOptionSelect(q.id, oIdx)} 
                            /> {opt}
                          </label>
                        )
                      })}
                    </div>
                  ))}

                  {!examSubmitted ? (
                    <button
                      onClick={handleExamSubmit}
                      style={{
                        padding: '12px 24px',
                        background: '#48bb78',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        width: '100%'
                      }}
                    >
                      উত্তর জমা দিন (Submit Exam)
                    </button>
                  ) : (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#1a202c', borderRadius: '6px', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#48bb78' }}>
                        🎉 আপনার ফলাফল: {score} / {activeTopic.examQuestions?.length || 0}
                      </h3>
                      <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px' }}>
                        পরবর্তী টপিকটি এখন Unlock 🔓 হয়েছে! আপনি বাঁপাশের সাইডবার থেকে পরের টপিক পড়তে পারেন।
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>একটি সাবজেক্ট বা টপিক নির্বাচন করুন।</p>
        )}
      </div>

    </div>
  )
}

export default MadrasaDashboard