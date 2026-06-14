import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Form() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [listening, setListening] = useState(false)
  const [name, setName] = useState('')
  const [cnic, setCnic] = useState('')
  const [age, setAge] = useState('')
  const [billAmount, setBillAmount] = useState('')

  const checkEligibility = (spokenText) => {
    const ageMatch = spokenText.match(/(\d{2})/)
    const ageFromText = ageMatch? parseInt(ageMatch[1]) : 0
    const widowRegex = /ب[ےی]?وہ|فوت|widow|intiqal/i
    const isWidow = widowRegex.test(spokenText)

    if (ageFromText >= 60 && isWidow) {
      setResult('✅ G Amma aap ahal hain')
    } else {
      setResult('❌ Maaf kijiye, ahal nahi hain')
    }
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setResult('Voice support nahi hai is browser mein')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'ur-PK'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      setText(spokenText)
      checkEligibility(spokenText)
    }

    recognition.onerror = (event) => {
      setResult('Error: Mic allow karo phir try karo')
      setListening(false)
    }

    recognition.start()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult('Save ho raha hai...')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          cnic,
          age: parseInt(age),
          bill_amount: parseInt(billAmount), // API mein bill_amount chahiye
          voice_text: text
        })
      })
      const data = await response.json()
      setResult(data.success? '✅ Data save ho gaya' : '❌ Error: ' + data.error)

      if(data.success) {
        setName('')
        setCnic('')
        setAge('')
        setBillAmount('')
        setText('')
      }
    } catch (err) {
      setResult('❌ Server error: ' + err.message)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px'}}>
          <h1 style={{margin: 0, color: '#333', fontSize: '24px'}}>Baitulmaal</h1>
          <Link to="/admin" style={{
            textDecoration: 'none',
            color: '#667eea',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>Admin Panel →</Link>
        </div>

        <button
          onClick={startListening}
          disabled={listening}
          style={{
            width: '100%',
            padding: '14px',
            background: listening? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: listening? 'not-allowed' : 'pointer',
            marginBottom: '15px',
            transition: '0.3s'
          }}
        >
          {listening? '🎤 Sun raha hun...' : '🎤 Bol ke batao'}
        </button>

        {text && (
          <div style={{
            background: '#f3f4f6',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '10px',
            fontSize: '14px'
          }}>
            <b>Voice:</b> {text}
          </div>
        )}

        {result && (
          <div style={{
            background: result.includes('✅')? '#d1fae5' : '#fee2e2',
            color: result.includes('✅')? '#065f46' : '#991b1b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {result}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555'}}>Naam</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Muhammad Ali"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555'}}>CNIC</label>
            <input
              type="text"
              value={cnic}
              onChange={e => setCnic(e.target.value)}
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
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555'}}>Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
                placeholder="60"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555'}}>Bill Amount</label>
              <input
                type="number"
                value={billAmount}
                onChange={e => setBillAmount(e.target.value)}
                required
                placeholder="5000"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Submit Karo
          </button>
        </form>
      </div>
    </div>
  )
}