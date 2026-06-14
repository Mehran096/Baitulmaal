export default function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { user, pass } = req.body
  const adminUser = process.env.ADMIN_USER
  const adminPass = process.env.ADMIN_PASS
  
  if(user === adminUser && pass === adminPass) {
    return res.status(200).json({ success: true })
  }
  
  return res.status(401).json({ error: 'Unauthorized' })
}