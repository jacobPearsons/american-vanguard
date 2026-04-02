import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, studentId, description, email, phone, paymentType } = body

    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    const payment = await db.payment.create({
      data: {
        amount,
        studentId,
        description,
        reference,
        status: 'pending',
        paymentType: paymentType || 'school_fees',
      },
    })

    const paystackData = {
      email,
      amount: amount * 100,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/fees?payment=callback`,
      metadata: {
        studentId,
        paymentId: payment.id,
        paymentType,
      },
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData),
    })

    const paystackResponse = await response.json()

    if (!paystackResponse.status) {
      return NextResponse.json({ message: 'Payment initialization failed' }, { status: 400 })
    }

    return NextResponse.json({
      authorizationUrl: paystackResponse.data.authorization_url,
      reference,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ message: 'Reference required' }, { status: 400 })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()

    if (data.data.status === 'success') {
      await db.payment.updateMany({
        where: { reference },
        data: { status: 'completed', paidAt: new Date() },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}