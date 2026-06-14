import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // URL se page, limit, search le lo: /api/applications?page=1&limit=10&search=ali
    const { page = 1, limit = 10, search = '' } = req.query
    
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' }) // count bhi chahiye total ke liye
      .order('id', { ascending: false })
      .range(from, to)

    // Agar search likha hai to Naam ya CNIC mein filter karo
    if (search) {
      query = query.or(`name.ilike.%${search}%,cnic.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) return res.status(500).json({ error: error.message })
    
    // Frontend ko total count bhi bhejo pagination ke liye
    return res.status(200).json({ data, total: count })
  }

  if (req.method === 'PATCH') {
  // Admin data update karega: name, age, bill_amount, status
  const { id, name, age, bill_amount, cnic, status } = req.body

  const updateData = {}
  if (name) updateData.name = name
  if (age) updateData.age = parseInt(age)
  if (bill_amount) updateData.bill_amount = parseInt(bill_amount)
  if (cnic) updateData.cnic = parseInt(cnic)
  if (status) updateData.status = status

  const { data, error } = await supabase
    .from('applications')
    .update(updateData)
    .eq('id', id)
    .select()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ success: true, data })
}

  // DELETE ka code bhi yahan daal do
  if (req.method === 'DELETE') {
    const { id } = req.query
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }
}