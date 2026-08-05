import Header from "./_components/header"
import { Button } from "@/app/_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-items"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function Home() {
  //pega a sessao do usuario (usuario logado)
  const session = await getServerSession(authOptions)

  // Busca as barbearias no banco de dados
  const barbershops = await db.barberShop.findMany({})
  const popularbarbershop = await db.barberShop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  const confimedBookings = session?.user
    ? await db.booking.findMany({
        where: {
          userId: session?.user.id,
          date: {
            gte: new Date(),
          },
        },
        include: {
          sevice: {
            include: {
              barberShop: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      })
    : []

  return (
    <div>
      {/* Header */}
      <Header />

      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "Bem vindo!"}
        </h2>
        <span className="text-sm capitalize text-gray-400">
          {format(new Date(), "EEEE, dd ", { locale: ptBR })}
        </span>
        <span className="text-sm text-gray-400">de </span>
        <span className="text-sm capitalize text-gray-400">
          {format(new Date(), "MMMM", { locale: ptBR })}
        </span>

        {/* Busca */}
        <div className="mt-6">
          <Search />
        </div>

        {/* Busca rápida */}
        <div className="-mx-5 mt-6 flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.title}
              variant="secondary"
              className="shrink-0 gap-2 rounded-full"
              render={<Link href={`/barbershops?service=${option.title}`} />}
            >
              {option.imageUrl && (
                <Image
                  src={option.imageUrl}
                  width={16}
                  height={16}
                  alt={option.title}
                />
              )}
              {option.title}
            </Button>
          ))}
        </div>

        {/* Banner */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende nos melhores com FSW Barber"
          />
        </div>

        {/* Agendamento Ativo */}
        {confimedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confimedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        {/* Barbearias Recomendadas */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="-mx-7 flex gap-2 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        {/* Barbearias Populares */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="-mx-7 flex gap-2 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {popularbarbershop.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}
