"use client"
import { BarberShop, BarberShopService } from "@prisma/client"
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
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { format, set } from "date-fns"
import CreateBooking from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

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

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession() //pega o usuario logado

  const [selectDay, setSelectDay] = useState<Date | undefined>(undefined)

  // state para guardar a hora selecionada
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const handleDateSelect = (date: Date | undefined) => {
    setSelectDay(date)
  }
  const handleTimeSelected = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      // Garante que o usuário está logado e possui ID
      if (!selectDay || !selectedTime || !data?.user?.id) {
        toast.error("Faça login para realizar uma reserva!")
        return
      }

      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])

      const newDate = set(selectDay, {
        hours: hour,
        minutes: minute,
      })

      // Como verificamos data?.user?.id no 'if', o TS sabe que aqui é obrigatoriamente string
      await CreateBooking({
        serviceId: service.id,
        userId: data.user.id,
        date: newDate,
      })

      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  return (
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

            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="secondary" size="sm">
                    Reservar
                  </Button>
                }
              />
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
                      selected: "rounded-md bg-primary text-primary-foreground", // garante que o selecionado fique arredondado
                      caption_label: "capitalize font-medium text-sm",
                    }}
                  />
                </div>

                {/* horarios */}
                {/* Container dos Horários */}
                {selectDay && (
                  <div className="flex items-center gap-2 overflow-x-auto border-b border-solid pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {TIME_LIST.map((time, index) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
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
                            {format(selectDay, "d 'de' MMMM", { locale: ptBR })}
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
  )
}

export default ServiceItem
