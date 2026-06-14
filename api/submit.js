import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, cnic, age, bill_amount, voice_text } = req.body

  // 1. CNIC ka format check karo - 13 digit
  if (!cnic || cnic.length !== 13 || !/^\d+$/.test(cnic)) {
    return res.status(400).json({ error: 'CNIC 13 digit number hona chahiye bina dash ke' })
  }

  // 2. Check karo ke ye CNIC pehle submit hua hai ya nahi
  const { data: existing, error: checkError } = await supabase
    .from('applications')
    .select('id')
    .eq('cnic', cnic)
    .single()

  if (existing) {
    return res.status(409).json({ 
      error: 'Ye CNIC pehle hi submit ho chuka hai. Ek CNIC se sirf 1 dafa apply kar sakte hain.' 
    })
  }

  // 3. Agar CNIC naya hai to data insert karo
  const { data, error } = await supabase
    .from('applications')
    .insert([{ name, cnic, age, bill_amount, voice_text, status: 'pending' }])
    .select()

  if (error) {
    // Agar phir bhi unique error aa jaye to
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ye CNIC pehle se mojood hai' })
    }
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ success: true, data })
}