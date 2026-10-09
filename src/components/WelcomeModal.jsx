import React from 'react'

const WelcomeModal = ({ user, courseType, onStart }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '400px',
        color: '#333'
      }}>
        <h2>অভিনন্দন {user?.full_name || 'শিক্ষার্থী'}! 🎉</h2>
        <p>আপনার কোর্স এনরোলমেন্ট সফল হয়েছে।</p>
        <button 
          onClick={onStart}
          style={{
            padding: '10px 20px',
            background: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          ড্যাশবোর্ডে প্রবেশ করুন
        </button>
      </div>
    </div>
  )
}

export default WelcomeModal