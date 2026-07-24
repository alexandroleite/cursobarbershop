import { BarberShopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardAction } from "./ui/card"

interface ServiceItemProps {
  service: BarberShopService
}
const ServiceItem = ({ service }: ServiceItemProps) => {
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
        <div className="space-y-2">
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
            <Button variant="secondary" size="sm">
              Reservar
            </Button>
          </div>
        </div>
      </CardAction>
    </Card>
  )
}

export default ServiceItem
