import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"

//TODO: receber agendamentos como prop

const BookingItem = () => {
  return (
    <>
      {/* agendamentos */}
      <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
        Agendamentos
      </h2>
      <Card>
        <CardContent className="flex justify-between p-0">
          {/* esquerda */}
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit rounded-xl">Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo</h3>

            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                  alt="avatar"
                />
              </Avatar>
              <p className="text-sm">Barbearia FSW</p>
            </div>
          </div>

          {/* div direita */}
          <div className="flex flex-col justify-center gap-2 border-l-2 border-solid px-5">
            <p className="text-sm">Julho</p>
            <p className="text-2xl">22</p>
            <p className="text-sm">14:50</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
