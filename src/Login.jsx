import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass })
      })

      if(res.ok) {
        localStorage.setItem('adminAuth', 'true') // bas flag save
        navigate('/admin')
      } else {
        setError('❌ Galat username ya password bhai!')
      }
    } catch {
      setError('❌ Server error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '320px'
      }}>
        <h1 style={{textAlign: 'center', marginBottom: '24px'}}>Admin Login 🔒</h1>

        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={e => setUser(e.target.value)}
          required
          style={{width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
          style={{width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px'}}
        />

        <button style={{
          width: '100%', padding: '10px', background: 'black', color: 'white',
          border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          Login
        </button>

        {error && <p style={{color: 'red', marginTop: '12px', fontSize: '14px'}}>{error}</p>}
      </form>
    </div>
  )
}

export default Login