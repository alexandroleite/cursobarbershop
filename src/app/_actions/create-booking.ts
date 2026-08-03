"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

// O userId pode ser omitido dos parâmetros já que pegamos da sessão
interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  // 1. Verifica se a sessão e o usuário existem
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  // 2. Cria o agendamento associando ao ID do usuário autenticado
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      date: params.date,
      userId: (session.user as { id: string }).id,
    },
  })

  // 3. Revalida a rota específica das reservas do usuário ou da barbearia
  revalidatePath("/bookings")
  revalidatePath("/", "layout") // Revalida o layout global se necessário
}
