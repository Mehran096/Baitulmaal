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

  const { data, error } = await supabase
    .from('applications')
    .insert([{ name, cnic, age, bill_amount, voice_text, status: 'pending' }])
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ success: true, data })
}