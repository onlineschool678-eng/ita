import React, { useState } from 'react'

const PaymentGateway = ({ user, onPaymentSuccess }) => {
  const [trxId, setTrxId] = useState('')
  const [submitted, setSubmitted] = useState(user?.payment_status === 'pending_approval' || false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!trxId) return alert('অনুগ্রহ করে Transaction ID দিন!')
    
    // Admin Review status set
    setSubmitted(true)
    onPaymentSuccess({ ...user, payment_status: 'pending_approval', is_active: false })
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '10px', color: '#333' }}>
      {!submitted ? (
        <>
          <h2>কোর্স পেমেন্ট করুন</h2>
          <p>বিকাশ/নগদ/রকেটে <b>৫০০ টাকা</b> পাঠান (Send Money): <b>01700000000</b></p>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>TrxID (ট্রানজেকশন আইডি):</label>
            <input 
              type="text" 
              value={trxId} 
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="Ex: 8N7A6D5E" 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              পেমেন্ট নিশ্চিত করুন
            </button>
          </form>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h3 style={{ color: '#d69e2e' }}>⏳ পেমেন্ট যাচাই করা হচ্ছে!</h3>
          <p>আপনার পেমেন্ট ট্রানজেকশন আইডি সফলভাবে জমা হয়েছে। অ্যাডমিন যাচাই করে অ্যাকাউন্ট অ্যাক্টিভ করে দিলে আপনি কোর্স এক্সেস করতে পারবেন।</p>
        </div>
      )}
    </div>
  )
}

export default PaymentGateway