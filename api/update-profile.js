
// Backend Example (Node.js / Express)
app.post('/api/update-profile', async (req, res) => {
  const { email, studentId, profilePic } = req.body;
  try {
    const query = `
      UPDATE users 
      SET student_id = $1, profile_pic = $2 
      WHERE email = $3
      RETURNING *;
    `;
    const values = [studentId, profilePic, email];
    const result = await pool.query(query, values);
    
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'User paoa jayni' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});