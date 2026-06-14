import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Form from './Form'
import Login from './Login'
import Admin from './Admin'

function App() {
   
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App