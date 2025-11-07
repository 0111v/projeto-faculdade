import { NextResponse } from 'next/server'
import { ordersRepository } from '@/lib/repositories/orders.repo'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check if user is admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const orders = await ordersRepository.fetchAllOrders()
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Fetch all orders error:', error)
    return NextResponse.json(
      { error: error.message || 'Falha ao carregar pedidos' },
      { status: 400 }
    )
  }
}
