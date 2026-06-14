function Pagination({ total, perPage, page, setPage }) {
  const totalPages = Math.ceil(total / perPage)
  
  if(totalPages <= 1) return null

  return (
    <div style={{display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px"}}>
      <button 
        onClick={() => setPage(p => Math.max(1, p-1))}
        disabled={page === 1}
        style={{padding: "8px 12px", cursor: "pointer"}}
      >
        Prev
      </button>
      
      <span style={{padding: "8px 12px"}}>Page {page} / {totalPages}</span>
      
      <button 
        onClick={() => setPage(p => Math.min(totalPages, p+1))}
        disabled={page === totalPages}
        style={{padding: "8px 12px", cursor: "pointer"}}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination