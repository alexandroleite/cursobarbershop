"use client"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Prisma } from "@prisma/client"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"
import BookingSummary from "./booking-summary"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      sevice: {
        include: {
          barberShop: true
        }
      }
    }
  }>
}

//TODO: receber agendamentos como prop
const BookingItem = ({ booking }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const {
    sevice: { barberShop },
  } = booking
  const isConfirmed = isFuture(booking.date)

  // deletar reserva no banco
  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      setIsSheetOpen(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva. Tente novamente.")
    }
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }
  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger className="w-full min-w-[90%]">
        {/* agendamentos */}

        <Card className="min-w-[90%]">
          <CardContent className="flex justify-between p-0">
            {/* esquerda */}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                className="w-fit rounded-xl"
                variant={isConfirmed ? "default" : "secondary"}
              >
                {isConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h3 className="font-semibold">{booking.sevice.name}</h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                    alt="avatar"
                  />
                </Avatar>
                <p className="text-sm">{booking.sevice.barberShop.name}</p>
              </div>
            </div>

            {/* div direita */}
            <div className="flex flex-col justify-center gap-2 border-l-2 border-solid px-5">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[85%]">
        <SheetHeader>
          <SheetTitle className="text-left">Informações da reserva</SheetTitle>
        </SheetHeader>

        <div className="relative mr-5 mt-6 flex h-[180px] w-full items-end">
          <Image
            alt={`Mapa da barbearia ${booking.sevice.barberShop.name}`}
            src="/map.png"
            fill
            className="rounded-xl object-cover"
          />

          <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <Avatar>
                <AvatarImage src={barberShop.imageUrl} />
              </Avatar>
              <div>
                <h3 className="font-bold">{barberShop.name}</h3>
                <p className="text-xs">{barberShop.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-2 mt-6">
          <Badge
            className="w-fit rounded-xl"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <div className="mb-3 mt-6">
            <BookingSummary
              barbershop={barberShop}
              service={booking.sevice}
              selectedDate={booking.date}
            />
          </div>

          <div className="space-y-3 p-2">
            {barberShop.phones.map((phone, index) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </div>
        <SheetFooter className="mt-6">
          <div className="flex w-full flex-row items-center gap-3">
            <SheetClose
              className="flex-1"
              render={
                <Button className="w-full" variant="outline">
                  Voltar
                </Button>
              }
            />
            {isConfirmed && (
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="destructive" className="w-full flex-1">
                      Cancelar Reserva
                    </Button>
                  }
                />

                <DialogContent className="w-[90%] rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Tem certeza que deseja cancelar?</DialogTitle>
                    <DialogDescription>
                      A reserva será apagada permanentemente. Esta ação não pode
                      ser desfeita.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex flex-row gap-3">
                    {/* Somente o botão de Voltar usa o DialogClose */}
                    <DialogClose
                      className="flex-1"
                      render={
                        <Button variant="secondary" className="w-full">
                          Voltar
                        </Button>
                      }
                    />

                    {/* O botão Confirmar fica direto no flex-1 para tratar o clique */}
                    <DialogClose
                      render={
                        <Button
                          variant="destructive"
                          className="w-full flex-1"
                          onClick={handleCancelBooking}
                        >
                          Confirmar
                        </Button>
                      }
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BookingItem
