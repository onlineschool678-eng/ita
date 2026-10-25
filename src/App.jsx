import React, { useState, useEffect } from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'

// Safe Image Fallback (Vite compatible)
import itaLogo from './assets/ita-logo.jpg'

// safe/optional import handler
import * as WelcomeModalModule from './components/WelcomeModal'
import * as BigganDashboardModule from './components/BigganDashboard'
import AdminPanel from './components/AdminPanel'

const WelcomeModal = WelcomeModalModule.default || (() => <div style={{padding: '20px', color: 'red'}}>Welcome Modal Error</div>)
const BigganDashboard = BigganDashboardModule.default || (() => <div style={{padding: '20px', color: 'red'}}>Biggan Dashboard Error</div>)

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStream, setSelectedStream] = useState('biggan_amar_odhikar')
  const [user, setUser] = useState(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Secret Admin Access States
  const [clickCount, setClickCount] = useState(0)

  // Secret Keyboard Shortcut Handler (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        const password = prompt('Enter the code:')
        if (password === 'error407') {
          setCurrentPage('admin')
        } else if (password) {
          alert('Wrong code')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Logo Click Secret Handler (5 Clicks for Admin / Normal Click goes to Home)
  const handleLogoClick = () => {
    // Normal click goes to Home
    setCurrentPage('home')

    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 5) {
      setClickCount(0)
      const password = prompt('Enter the code:')
      if (password === 'error407') {
        setCurrentPage('admin')
      } else if (password) {
        alert('Wrong code')
      }
    } else {
      setTimeout(() => setClickCount(0), 3000)
    }
  }

  // Logout function
  const handleLogout = () => {
    setUser(null)
    setCurrentPage('home')
    setShowWelcomeModal(false)
  }

  // Handle Free Course Start (No Payment required)
  const handleStartCourse = (streamName) => {
    setSelectedStream(streamName)
    if (!user) {
      setCurrentPage('signup')
    } else {
      setShowWelcomeModal(true)
      setCurrentPage('dashboard')
    }
  }

  // Auth Success Handler (Sets user as active immediately)
  const handleAuthSuccess = (userData) => {
    const activeUser = {
      ...userData,
      is_active: true,
      enrolled_course: 'biggan_amar_odhikar'
    }
    setUser(activeUser)
    setShowWelcomeModal(true)
    setCurrentPage('dashboard')
  }

  return (
    <div className="app-container" style={{ background: '#0b0f19', color: '#f7fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* Header Section */}
      <header className="navbar" style={{ background: '#111827', borderBottom: '1px solid #1f2937', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-image-container" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #3b82f6', flexShrink: 0 }}>
            <img 
              src={itaLogo} 
              alt="ITA Logo" 
              className="logo-img" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none' }} 
            />
          </div>
          <div className="logo-text">
            <h1 style={{ fontSize: '16px', margin: '0', color: '#ffffff', fontWeight: '800', letterSpacing: '0.5px' }}>
              ইন্টারন্যাশনাল ট্রোভা একাডেমি
            </h1>
            <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: '#ef4444', fontWeight: '600' }}>
              বিজ্ঞান আমার অধিকার ⚡
            </p>
          </div>
        </div>

        {/* Header Right Nav Options */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Quick Home Button */}
          <button 
            onClick={() => setCurrentPage('home')}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #3b82f6', background: 'transparent', color: '#60a5fa', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
          >
            হোম
          </button>

          {user ? (
            <>
              <span style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '13px' }}>স্বাগতম, {user.full_name || user.email}</span>
              <button 
                onClick={handleLogout}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  background: '#ef4444', 
                  color: '#fff', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                লগআউট
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentPage('login')} 
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #4b5563', background: 'transparent', color: '#f3f4f6', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                লগইন
              </button>
              <button 
                onClick={() => setCurrentPage('signup')} 
                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)' }}
              >
                সাইন আপ
              </button>
            </>
          )}
        </div>
      </header>

      {/* Admin Panel Section */}
      {currentPage === 'admin' && (
        <AdminPanel onBack={() => setCurrentPage('home')} />
      )}

      {/* Main Home Content - Cyber Science Theme */}
      {currentPage === 'home' && (
        <>
          <section className="hero" style={{ textAlign: 'center', padding: '50px 15px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderBottom: '1px solid #1f2937' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', color: '#ffffff', marginBottom: '12px', fontWeight: 'bold', lineHeight: '1.3' }}>
              বিজ্ঞান সবার জন্য, <span style={{ color: '#ef4444' }}>বিজ্ঞান আমার অধিকার</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#94a3b8', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              জটিল বিজ্ঞানকে সহজ পরীক্ষা, লজিক এবং রিয়েল-ওয়ার্ল্ড অ্যাপ্লিকেশন দিয়ে শেখার সর্বাধুনিক ডিজিটাল প্ল্যাটফর্ম।
            </p>
          </section>

          <main className="cards-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px 15px', flex: '1' }}>
            <div className="card" style={{ 
              background: '#111827', 
              border: '1px solid #374151', 
              borderRadius: '12px', 
              padding: '25px', 
              maxWidth: '480px', 
              width: '100%',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(37, 99, 235, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="card-badge" style={{ position: 'absolute', top: '15px', right: '15px', background: '#2563eb', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                FREE ACCESS 🔓
              </div>
              <h3 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '15px', borderLeft: '4px solid #ef4444', paddingLeft: '10px' }}>
                বিজ্ঞান আমার অধিকার
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
                মুখস্থ বিদ্যা বাদ দিয়ে বিজ্ঞানের মূল রহস্য উদঘাটন করুন। পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান এবং আধুনিক প্রযুক্তির সার্থক মেলবন্ধনে সাজানো আমাদের এই এক্সক্লুসিভ কোর্স।
              </p>
              <button 
                className="start-btn" 
                onClick={() => handleStartCourse('biggan_amar_odhikar')}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  fontSize: '15px', 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                }}
              >
                যাত্রা শুরু করুন <span>→</span>
              </button>
            </div>
          </main>
        </>
      )}

      {/* Signup Section */}
      {currentPage === 'signup' && (
        <Signup 
          selectedStream={selectedStream} 
          onSwitchToLogin={() => setCurrentPage('login')} 
          onSignupSuccess={handleAuthSuccess}
        />
      )}

      {/* Login Section */}
      {currentPage === 'login' && (
        <Login 
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleAuthSuccess}
        />
      )}

      {/* Welcome Modal Popup */}
      {showWelcomeModal && (
        <WelcomeModal 
          user={user} 
          courseType={selectedStream} 
          onStart={() => setShowWelcomeModal(false)} 
        />
      )}

      {/* Dashboard Section (Direct Access for all Logged-in Users) */}
      {currentPage === 'dashboard' && user && (
        <BigganDashboard user={user} />
      )}

      {/* Footer */}
      <footer className="footer" style={{ textAlign: 'center', padding: '15px', background: '#111827', borderTop: '1px solid #1f2937', color: '#6b7280', fontSize: '13px', marginTop: 'auto' }}>
        <p>© {new Date().getFullYear()} ইন্টারন্যাশনাল ট্রোভা একাডেমি (ITA)। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  )
}

export default App