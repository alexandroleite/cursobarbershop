"use client"

import { BarberShop, BarberShopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
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
import { useEffect, useMemo, useState } from "react"
import { isPast, startOfDay, set, isToday } from "date-fns"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-booking"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { createBooking } from "../_actions/create-booking"
import BookingSummary from "./booking-summary"

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

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(
      set(new Date(), {
        hours: hour,
        minutes: minute,
        seconds: 0,
        milliseconds: 0,
      }),
    )
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }
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
  const { data } = useSession()
  const [selectedDay, setSelectDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, service.id])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime]) // <-- Ajustado e fechado corretamente!

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
    setSelectedTime(undefined)
  }

  const handleTimeSelected = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return
      await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })

      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  return (
    <>
      <Card>
        <div className="flex items-center gap-3 p-3">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

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

                <SheetContent className="flex h-full flex-col overflow-x-hidden px-0">
                  <SheetHeader className="px-5 pb-2 text-left">
                    <SheetTitle>Fazer reserva</SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Calendário */}
                    <div className="border-b border-solid px-3 pb-2">
                      <Calendar
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        mode="single"
                        locale={ptBR}
                        disabled={{ before: startOfDay(new Date()) }}
                        classNames={{
                          months: "w-full space-y-3",
                          month: "w-full space-y-3",
                          month_grid: "w-full border-collapse space-y-1",
                          weekdays: "flex w-full justify-between",
                          weekday:
                            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center capitalize",
                          week: "flex w-full mt-1 justify-between",
                          day: "h-8 w-full p-0 font-normal flex-1 flex items-center justify-center rounded-md",
                          today:
                            "rounded-md bg-accent text-accent-foreground font-bold",
                          selected:
                            "rounded-md bg-primary text-primary-foreground",
                          caption_label: "capitalize font-medium text-sm",
                        }}
                      />
                    </div>

                    {/* Lista de Horários */}
                    {selectedDay && (
                      <div className="flex items-center gap-2 overflow-x-auto border-b border-solid py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {timeList && timeList.length > 0 ? (
                          timeList.map((time, index) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className={`h-8 shrink-0 rounded-full px-3 text-xs ${
                                index === 0 ? "ml-5" : ""
                              } ${index === timeList.length - 1 ? "mr-5" : ""}`}
                              onClick={() => handleTimeSelected(time)}
                            >
                              {time}
                            </Button>
                          ))
                        ) : (
                          <p className="px-5 text-xs text-muted-foreground">
                            Não há horários disponíveis para este dia.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Resumo */}
                    {selectedDate && (
                      <div className="my-auto px-5 py-3">
                        <BookingSummary
                          barbershop={barbershop}
                          service={service}
                          selectedDate={selectedDate}
                        />
                      </div>
                    )}
                  </div>

                  {/* Botão de Confirmar no Rodapé */}
                  {selectedTime && selectedDay && (
                    <SheetFooter className="border-t border-solid p-5">
                      <SheetClose
                        render={
                          <Button
                            className="w-full"
                            onClick={handleCreateBooking}
                          >
                            Confirmar
                          </Button>
                        }
                      />
                    </SheetFooter>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
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
