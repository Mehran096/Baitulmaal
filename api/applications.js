import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Saari applications fetch karo
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data })
  }

  if (req.method === 'PATCH') {
    // Status update karo: pending → approved/rejected
    const { id, status } = req.body
    
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, data })
  }
}