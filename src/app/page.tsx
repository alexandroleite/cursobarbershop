import { SearchIcon } from "lucide-react"
import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import Image from "next/image"
import { Card, CardContent } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"

export default function Home() {
  return (
    <div>
      {/* header */}
      <Header />

      <div className="p-5">
        <h2 className="text-xl font-bold">Olá Alexandro!</h2>
        <p>Quarta-feira, 22 de julho.</p>

        {/* busca */}
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        {/* banner */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende nos melhores com FSW Barber"
          />
        </div>

        {/* agendamentos */}

        <Card className="mt-6">
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
      </div>
    </div>
  )
}
