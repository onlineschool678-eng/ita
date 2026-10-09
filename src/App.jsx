import React, { useState, useEffect } from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'

// Safe Image Fallback (Vite compatible)
import itaLogo from './assets/ita-logo.jpg'

// safe/optional import handler
import * as PaymentGatewayModule from './components/PaymentGateway'
import * as WelcomeModalModule from './components/WelcomeModal'
import * as MadrasaDashboardModule from './components/MadrasaDashboard'
import * as BigganDashboardModule from './components/BigganDashboard'
import AdminPanel from './components/AdminPanel'

const PaymentGateway = PaymentGatewayModule.default || (() => <div style={{padding: '20px', color: 'red'}}>Payment Component Error</div>)
const WelcomeModal = WelcomeModalModule.default || (() => <div style={{padding: '20px', color: 'red'}}>Welcome Modal Error</div>)
const MadrasaDashboard = MadrasaDashboardModule.default || (() => <div style={{padding: '20px', color: 'red'}}>Madrasa Dashboard Error</div>)
const BigganDashboard = BigganDashboardModule.default || (() => <div style={{padding: '20px', color: 'red'}}>Biggan Dashboard Error</div>)

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStream, setSelectedStream] = useState('')
  const [user, setUser] = useState(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Secret Admin Access States
  const [clickCount, setClickCount] = useState(0)

  // Secret Keyboard Shortcut Handler (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        const password = prompt('অ্যাডমিন পাসওয়ার্ড দিন:')
        if (password === 'admin123') {
          setCurrentPage('admin')
        } else if (password) {
          alert('ভুল পাসওয়ার্ড!')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Logo Click Secret Handler (5 Clicks)
  const handleLogoClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 5) {
      setClickCount(0)
      const password = prompt('অ্যাডমিন পাসওয়ার্ড দিন:')
      if (password === 'admin123') {
        setCurrentPage('admin')
      } else if (password) {
        alert('ভুল পাসওয়ার্ড!')
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

  const handleStartCourse = (streamName) => {
    setSelectedStream(streamName)
    if (!user) {
      setCurrentPage('signup')
    } else if (!user.is_active) {
      setCurrentPage('payment')
    } else {
      setShowWelcomeModal(true)
      setCurrentPage('dashboard')
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    if (!userData.is_active) {
      setCurrentPage('payment')
    } else {
      setShowWelcomeModal(true)
      setCurrentPage('dashboard')
    }
  }

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="navbar">
        <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="logo-image-container">
            <img 
              src={itaLogo} 
              alt="ITA লোগো" 
              className="logo-img" 
              onError={(e) => { e.target.style.display = 'none' }} 
            />
          </div>
          <div className="logo-text">
            <h1>ইন্টারন্যাশনাল ট্রোভা একাডেমি</h1>
            <p>শিক্ষার মাধ্যমে সমৃদ্ধ আগামী গঠন</p>
          </div>
        </div>

        {/* Header Right Nav Options */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>স্বাগতম, {user.full_name || user.email}</span>
              <button 
                onClick={handleLogout}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '5px', 
                  border: 'none', 
                  background: '#e53e3e', 
                  color: '#fff', 
                  cursor: 'pointer',
                  fontWeight: 'bold' 
                }}
              >
                লগআউট
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentPage('login')} 
                style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}
              >
                লগইন
              </button>
              <button 
                onClick={() => setCurrentPage('signup')} 
                style={{ padding: '8px 16px', borderRadius: '5px', border: 'none', background: '#3182ce', color: '#fff', cursor: 'pointer' }}
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

      {/* Main Home Content */}
      {currentPage === 'home' && (
        <>
          <section className="hero">
            <h2>ইন্টারন্যাশনাল ট্রোভা একাডেমিতে আপনাকে স্বাগতম</h2>
            <p>প্রতিটি শিক্ষার্থীর জন্য একটি ক্লাসিক ও আধুনিক শিক্ষামূলক প্ল্যাটফর্ম</p>
          </section>

          <main className="cards-container">
            <div className="card">
              <div className="card-badge">Course 01</div>
              <div className="card-icon"></div>
              <h3>মাদ্রাসা টু বিশ্ববিদ্যালয়</h3>
              <p>
                মাদ্রাসা ব্যাকগ্রাউন্ডের শিক্ষার্থীদের জন্য বিশ্ববিদ্যালয় ভর্তি নিশ্চিতকরণে সঠিক দিকনির্দেশনা এবং বিশেষ অ্যাকাডেমিক কেয়ার।
              </p>
              <button 
                className="start-btn" 
                onClick={() => handleStartCourse('madrasa_to_university')}
              >
                যাত্রা শুরু করুন <span>→</span>
              </button>
            </div>

            <div className="card">
              <div className="card-badge">Course 02</div>
              <div className="card-icon"></div>
              <h3>বিজ্ঞান আমার অধিকার</h3>
              <p>
                সহজ ভাষায় বিজ্ঞানের জটিল বিষয় শিক্ষাদান, প্র্যাকটিক্যাল জ্ঞান বৃদ্ধি এবং বিজ্ঞানকে সবার দোরগোড়ায় পৌঁছে দেওয়ার বিশেষ উদ্যোগ।
              </p>
              <button 
                className="start-btn" 
                onClick={() => handleStartCourse('biggan_amar_odhikar')}
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
        />
      )}

      {/* Login Section */}
      {currentPage === 'login' && (
        <Login 
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleAuthSuccess}
        />
      )}

      {/* Payment Section */}
      {currentPage === 'payment' && (
        <PaymentGateway 
          user={user} 
          onPaymentSuccess={(updatedUser) => {
            setUser(updatedUser || { ...user, payment_status: 'pending_approval', is_active: false })
          }} 
        />
      )}

      {/* Welcome Modal Popup */}
      {showWelcomeModal && (
        <WelcomeModal 
          user={user} 
          courseType={user?.enrolled_course || selectedStream} 
          onStart={() => setShowWelcomeModal(false)} 
        />
      )}

      {/* Dashboard Section */}
      {currentPage === 'dashboard' && (
        user && user.is_active ? (
          (user.enrolled_course === 'biggan' || selectedStream === 'biggan_amar_odhikar') ? (
            <BigganDashboard user={user} />
          ) : (
            <MadrasaDashboard user={user} />
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
            <h2>আপনার অ্যাকাউন্টটি এখনো অ্যাডমিন কর্তৃক অ্যাক্টিভ করা হয়নি!</h2>
            <p>পেমেন্ট যাচাইকরণের পর অ্যাডমিন অ্যাক্টিভ করলে ড্যাশবোর্ড দেখা যাবে।</p>
          </div>
        )
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} ইন্টারন্যাশনাল ট্রোভা একাডেমি (ITA)। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  )
}

export default App