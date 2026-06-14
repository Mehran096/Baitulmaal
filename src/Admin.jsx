import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Admin() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Login check - token nahi, flag check
    if (!localStorage.getItem('adminAuth')) {
      navigate('/login')
      return
    }

    // 2. Data fetch karo
    fetch('/api/applications')
     .then(res => res.json())
     .then(data => {
        setApps(data.data || [])
        setLoading(false)
      })
     .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [navigate])

  // 3. Approve/Reject button kaam
  const updateStatus = async (id, status) => {
    await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })

    // Table refresh kar do
    setApps(apps.map(a => a.id === id? {...a, status } : a))
  }

  const logout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/login')
  }

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading data...</div>

  return (
    <div style={{padding: '30px', maxWidth: '1200px', margin: 'auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>Baitulmaal - Admin Panel</h1>
        <div>
          <Link to="/" style={{marginRight: '15px', textDecoration: 'none', color: '#667eea'}}>Home</Link>
          <button onClick={logout} style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Logout
          </button>
        </div>
      </div>

      <p style={{marginBottom: '20px'}}>Total Applications: <b>{apps.length}</b></p>

      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <thead>
            <tr style={{background: '#667eea', color: 'white'}}>
              <th style={{padding: '14px', textAlign: 'left'}}>Naam</th>
              <th style={{padding: '14px', textAlign: 'left'}}>CNIC</th>
              <th style={{padding: '14px', textAlign: 'left'}}>Age</th>
              <th style={{padding: '14px', textAlign: 'left'}}>Bill</th>
              <th style={{padding: '14px', textAlign: 'left'}}>Voice Text</th>
              <th style={{padding: '14px', textAlign: 'center'}}>Status</th>
              <th style={{padding: '14px', textAlign: 'center'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0? (
              <tr>
                <td colSpan="7" style={{padding: '40px', textAlign: 'center', color: '#999'}}>Koi application nahi hai abhi</td>
              </tr>
            ) : (
              apps.map((item) => (
                <tr key={item.id} style={{borderBottom: '1px solid #f0f0f0'}}>
                  <td style={{padding: '12px'}}>{item.name}</td>
                  <td style={{padding: '12px'}}>{item.cnic}</td>
                  <td style={{padding: '12px'}}>{item.age}</td>
                  <td style={{padding: '12px'}}>{item.bill_amount}</td>
                  <td style={{padding: '12px', fontSize: '12px', maxWidth: '200px'}}>{item.voice_text}</td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: item.status === 'approved'? '#d1fae5' : item.status === 'rejected'? '#fee2e2' : '#fef3c7',
                      color: item.status === 'approved'? '#065f46' : item.status === 'rejected'? '#991b1b' : '#92400e'
                    }}>
                      {item.status || 'pending'}
                    </span>
                  </td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
                    <button
                      onClick={() => updateStatus(item.id, 'approved')}
                      style={{
                        padding: '6px 12px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontSize: '12px'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'rejected')}
                      style={{
                        padding: '6px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}