"use client"
import { BarberShop, BarberShopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardAction, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { startOfDay, format, set } from "date-fns"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-booking"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { createBooking } from "../_actions/create-booking"

interface ServiceItemProps {
  service: BarberShopService
  barbershop: Pick<BarberShop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

// verifica horarios disponiveis
const getTimeList = (bookings: Booking[]) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minute,
    )

    if (hasBookingOnCurrentTime) {
      return false
    }
    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [signInDialogIsOpen, SetSignInDialogIsOpen] = useState(false)

  const { data } = useSession() //pega o usuario logado

  const [selectDay, setSelectDay] = useState<Date | undefined>(undefined)

  // state para guardar a hora selecionada
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectDay) return
      const bookings = await getBookings({
        date: selectDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectDay, service.id])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return SetSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectDay(date)
  }
  const handleTimeSelected = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectDay || !selectedTime) return

      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])

      const newDate = set(selectDay, {
        hours: hour,
        minutes: minute,
      })

      // Caso a Server Action NÃO precise mais do userId enviado pelo cliente:
      await createBooking({
        serviceId: service.id,
        date: newDate,
      })

      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  return (
    <>
      <Card>
        <CardAction className="flex items-center gap-3 p-3">
          {/* image */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* direita */}
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

            {/* preço e botao */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer reserva</SheetTitle>
                  </SheetHeader>
                  {/* calendario */}
                  <div className="border-b border-solid px-3">
                    <Calendar
                      selected={selectDay}
                      onSelect={handleDateSelect}
                      mode="single"
                      locale={ptBR}
                      disabled={{ before: startOfDay(new Date()) }}
                      classNames={{
                        months: "w-full space-y-4",
                        month: "w-full space-y-4",
                        month_grid: "w-full border-collapse space-y-1",
                        weekdays: "flex w-full justify-between",
                        weekday:
                          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center capitalize",
                        week: "flex w-full mt-2 justify-between",
                        day: "h-9 w-full p-0 font-normal flex-1 flex items-center justify-center rounded-md", // rounded-md no botão base
                        today:
                          "rounded-md bg-accent text-accent-foreground font-bold", // arredonda e destaca o dia atual
                        selected:
                          "rounded-md bg-primary text-primary-foreground", // garante que o selecionado fique arredondado
                        caption_label: "capitalize font-medium text-sm",
                      }}
                    />
                  </div>

                  {/* horarios */}
                  {/* Container dos Horários */}
                  {selectDay && (
                    <div className="flex items-center gap-2 overflow-x-auto border-b border-solid pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {getTimeList(dayBookings).map((time, index) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className={`shrink-0 rounded-full ${
                            index === 0 ? "ml-5" : ""
                          } ${index === TIME_LIST.length - 1 ? "mr-5" : ""}`}
                          onClick={() => handleTimeSelected(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  {selectedTime && selectDay && (
                    // selecao
                    <div className="px-3">
                      <Card>
                        <CardContent className="space-y-3 p-3">
                          {/* o nome do serviço */}
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <p className="text-sm font-bold">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </p>
                          </div>
                          {/* seleçao da data */}
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Data</h2>
                            <p className="text-sm">
                              {format(selectDay, "d 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                          {/* selçao do horario */}
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Horario</h2>
                            <p className="text-sm">{selectedTime}</p>
                          </div>
                          {/* nome da barbearia */}
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Barbearia</h2>
                            <p className="text-sm">{barbershop.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <SheetFooter className="px-0">
                    <SheetClose
                      render={
                        <Button
                          onClick={handleCreateBooking}
                          disabled={!selectDay || !selectedTime}
                        >
                          Confirmar
                        </Button>
                      }
                    />
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardAction>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => SetSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
