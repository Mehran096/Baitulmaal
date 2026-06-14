import { useEffect, useState } from 'react'

function SearchBox({ search, setSearch, setPage }) {
  const [input, setInput] = useState(search)

  // Debounce: 500ms rukne ke baad search call hogi
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(input.toLowerCase().trim()) // trim bhi laga diya space hatane ke liye
      setPage(1) // search karte hi page 1 pe le jao
    }, 500) // 500ms = 0.5 second, 1000 mat likhna

    return () => clearTimeout(timer) // agar user wapis type kare to timer cancel
  }, [input, setSearch, setPage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearch(input.toLowerCase().trim())
      setPage(1)
    }
  }

  return (
    <input
      type="text"
      placeholder="Naam ya CNIC likho... khali karo to sara data wapis aa jayega"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "16px"
      }}
    />
  )
}

export default SearchBox