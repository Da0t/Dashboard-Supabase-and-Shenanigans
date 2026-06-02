import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function useReceipts() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('receipts')
      .select('id, transaction_ref, date, time, subtotal, tax_rate, tax_amount, total, payment_method, created_at')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setReceipts(data || [])
        setLoading(false)
      })

    const channel = supabase
      .channel('receipts-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'receipts' }, ({ new: row }) => {
        setReceipts(prev => [row, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { receipts, loading, error }
}
