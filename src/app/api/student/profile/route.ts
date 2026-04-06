import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { profileUpdateSchema } from '@/lib/api-schemas'
import { ZodError } from 'zod'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const profileImage = formData.get('profileImage') as string | null
      const bio = formData.get('bio') as string | null
      const phone = formData.get('phone') as string | null
      const address = formData.get('address') as string | null
      const city = formData.get('city') as string | null
      const country = formData.get('country') as string | null
      const dateOfBirth = formData.get('dateOfBirth') as string | null

      const formDataObj = {
        profileImage: profileImage || undefined,
        bio: bio || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        country: country || undefined,
        dateOfBirth: dateOfBirth || undefined,
      }

      try {
        profileUpdateSchema.partial().parse(formDataObj)
      } catch (e) {
        if (e instanceof ZodError) {
          return errorResponse(e.errors[0].message, 400)
        }
      }

      const updateData: Record<string, unknown> = {}
      
      if (profileImage !== null) updateData.profileImage = profileImage
      if (bio !== null) updateData.bio = bio
      if (phone !== null) updateData.phone = phone
      if (address !== null) updateData.address = address
      if (city !== null) updateData.city = city
      if (country !== null) updateData.country = country
      if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)

      const user = await db.user.update({
        where: { clerkId: userId },
        data: updateData,
      })

      return NextResponse.json(user)
    } else {
      const body = await request.json()

      try {
        profileUpdateSchema.partial().parse(body)
      } catch (e) {
        if (e instanceof ZodError) {
          return errorResponse(e.errors[0].message, 400)
        }
      }

      const { profileImage, bio, phone, address, city, country, dateOfBirth } = body

      const updateData: Record<string, unknown> = {}
      
      if (profileImage !== undefined) updateData.profileImage = profileImage
      if (bio !== undefined) updateData.bio = bio
      if (phone !== undefined) updateData.phone = phone
      if (address !== undefined) updateData.address = address
      if (city !== undefined) updateData.city = city
      if (country !== undefined) updateData.country = country
      if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)

      const user = await db.user.update({
        where: { clerkId: userId },
        data: updateData,
      })

      return NextResponse.json(user)
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON', 400)
    }
    console.error('Error updating profile:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return errorResponse('Unauthorized', 401)
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return errorResponse('Internal server error', 500)
  }
}
