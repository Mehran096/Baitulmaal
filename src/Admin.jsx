import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBox from './components/SearchBox'
import Pagination from './components/Pagination'

export default function Admin() {
  const [apps, setApps] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/login')
      return
    }
    fetchApps()
  }, [page, search])

  const fetchApps = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/applications?page=${page}&limit=${perPage}&search=${search}`)
      const { data, total } = await res.json()
      setApps(data || [])
      setTotal(total || 0)
    } catch (err) {
      console.log("Error:", err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    fetchApps()
  }

  const deleteApp = async (id) => {
    if (window.confirm("Pakka delete karna hai? Ye wapis nahi aayega")) {
      await fetch(`/api/applications?id=${id}`, { method: 'DELETE' })
      fetchApps()
    }
  }

  const logout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/login')
  }

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading data...</div>

  return (
    <div style={{padding: '30px', maxWidth: '1200px', margin: 'auto'}}>
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 style={{fontWeight: 'bold'}}>Baitulmaal - Admin Panel</h1>
        <div>
          <Link to="/" style={{marginRight: '15px', color: '#667eea', textDecoration: 'none'}}>Home</Link>
          <button onClick={logout} style={{padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
            Logout
          </button>
        </div>
      </div>

      <p style={{marginBottom: '20px'}}>Total Applications: <b>{total}</b></p>

     <SearchBox search={search} setSearch={setSearch} setPage={setPage} />

      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden'}}>
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
            {apps.length === 0 ? (
              <tr><td colSpan="7" style={{padding: '40px', textAlign: 'center', color: '#999'}}>Koi application nahi hai abhi</td></tr>
            ) : (
              apps.map(item => (
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
                      background: item.status === 'approved' ? '#d1fae5' : item.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                      color: item.status === 'approved' ? '#065f46' : item.status === 'rejected' ? '#991b1b' : '#92400e'
                    }}>
                      {item.status || 'pending'}
                    </span>
                  </td>
                  <td style={{padding: '12px', textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center'}}>
                    <button onClick={() => updateStatus(item.id, 'approved')} style={{background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}>Approve</button>
                    <button onClick={() => updateStatus(item.id, 'rejected')} style={{background: '#f59e0b', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}>Reject</button>
                    <button onClick={() => deleteApp(item.id)} style={{background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination total={total} perPage={perPage} page={page} setPage={setPage} />

    </div>
  )
}