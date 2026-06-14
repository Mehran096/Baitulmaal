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

  // Edit Modal ke liye state
  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState({ id: '', name: '', age: '', bill_amount: '', cnic: '' })

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

  // Edit modal open karo
  const openEditModal = (app) => {
    setEditData({
      id: app.id,
      name: app.name,
      age: app.age,
      cnic: app.cnic,
      bill_amount: app.bill_amount
    })
    setEditModal(true)
  }

  // Edit save karo
  const saveEdit = async () => {
    const res = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    })
    if (res.ok) {
      alert('✅ Data update ho gaya')
      setEditModal(false)
      fetchApps()
    } else {
      alert('❌ Update failed')
    }
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
    <div style={{padding: '20px', maxWidth: '1200px', margin: 'auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
        <h1 style={{fontWeight: 'bold', fontSize: '24px'}}>Baitulmaal - Admin Panel</h1>
        <div>
          <Link to="/" style={{marginRight: '15px', color: '#667eea', textDecoration: 'none'}}>Home</Link>
          <button onClick={logout} style={{padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Logout</button>
        </div>
      </div>

      <SearchBox search={search} setSearch={setSearch} setPage={setPage} />
      
      <p style={{marginBottom: '15px'}}>Total Records: {total}</p>

      {/* Desktop Table */}
      <div style={{display: 'none'}} className="desktop-table">
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f3f4f6'}}>
              <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>Naam</th>
              <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>CNIC</th>
              <th style={{padding: '12px', border: '1px solid #ddd'}}>Age</th>
              <th style={{padding: '12px', border: '1px solid #ddd'}}>Bill</th>
              
              <th style={{padding: '12px', border: '1px solid #ddd'}}>Voice</th>
              <th style={{padding: '12px', border: '1px solid #ddd'}}>Status</th>
              <th style={{padding: '12px', border: '1px solid #ddd'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id}>
                <td style={{padding: '12px', border: '1px solid #ddd'}}>{app.name}</td>
                <td style={{padding: '12px', border: '1px solid #ddd'}}>{app.cnic}</td>
                <td style={{padding: '12px', border: '1px solid #ddd', textAlign: 'center'}}>{app.age}</td>
                <td style={{padding: '12px', border: '1px solid #ddd', textAlign: 'center'}}>{app.bill_amount}</td>
                <td style={{padding: '12px', border: '1px solid #ddd', textAlign: 'center'}}>{app.voice_text}</td>
                <td style={{padding: '12px', border: '1px solid #ddd', textAlign: 'center'}}>
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td style={{padding: '12px', border: '1px solid #ddd', textAlign: 'center'}}>
                  <button onClick={() => openEditModal(app)} style={{marginRight: '5px', padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                  <button onClick={() => deleteApp(app.id)} style={{padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {apps.map(app => (
          <div key={app.id} style={{border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '12px', background: 'white'}}>
            <p><b>Naam:</b> {app.name}</p>
            <p><b>CNIC:</b> {app.cnic}</p>
            <p><b>Age:</b> {app.age} | <b>Bill:</b> {app.bill_amount}</p>
            <p><b>Status:</b> 
              <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)} style={{marginLeft: '8px'}}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </p>
            <div style={{marginTop: '10px', display: 'flex', gap: '8px'}}>
              <button onClick={() => openEditModal(app)} style={{flex: 1, padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px'}}>Edit</button>
              <button onClick={() => deleteApp(app.id)} style={{flex: 1, padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} setPage={setPage} total={total} perPage={perPage} />

      {/* Edit Modal */}
      {editModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
          <div style={{background: 'white', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '400px'}}>
            <h3 style={{marginBottom: '15px'}}>Edit Record</h3>
            <input type="text" placeholder="Naam" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
            <input type="number" placeholder="Bill Amount" value={editData.bill_amount} onChange={(e) => setEditData({...editData, bill_amount: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px'}} />
            <input type="number" placeholder="Age" value={editData.age} onChange={(e) => setEditData({...editData, age: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
            <input  type="text" placeholder="cnic"  value={editData.cnic}  onChange={(e) => setEditData({...editData, cnic: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
             {/* <input
             
             
              onChange={(e) => setEditData({...editData, cnic: e.target.value})}
              required
              placeholder="xxxxx-xxxxxxx-x"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            /> */}
             
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={saveEdit} style={{flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px'}}>Save</button>
              <button onClick={() => setEditModal(false)} style={{flex: 1, padding: '10px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-table { display: block !important; }
          .mobile-cards { display: none !important; }
        }
      `}</style>
    </div>
  )
}