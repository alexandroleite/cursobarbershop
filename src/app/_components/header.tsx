import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { CalendarIcon, HomeIcon, LogOutIcon, MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import { Avatar, AvatarImage } from "./ui/avatar"
import Link from "next/link"

const Header = () => {
  return (
    <Card className="rounded-none">
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Image alt="fsw Barber" src="/logo.png" height={18} width={120} />
        <Sheet>
          <SheetTrigger
            render={
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            }
          />

          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>

            {/* container avatar */}
            <div className="flex items-center gap-3 border-b border-solid px-2 pb-3">
              <Avatar>
                <AvatarImage src="/jin-woo.jpg" />
              </Avatar>
              <div>
                <p className="font-bold">Alexandro N Leite</p>
                <p className="text-xs">Alexandroleite@hotmail.com</p>
              </div>
            </div>

            {/* renderiza botao inicio e agendamento */}
            <div className="flex flex-col gap-2 border-b border-solid px-2 pb-4">
              <SheetClose
                render={
                  <Button
                    className="justify-start gap-2"
                    render={
                      <Link href="/">
                        <HomeIcon size={18} />
                        Inicio
                      </Link>
                    }
                  />
                }
              />

              <Button variant="ghost" className="justify-start gap-2">
                <CalendarIcon size={18} />
                Agendamentos
              </Button>
            </div>

            {/* renderia as opcoes das buscas dinamicamente */}
            <div className="flex flex-col gap-2 border-b border-solid px-2 pb-4">
              {quickSearchOptions.map((option) => (
                <Button
                  key={option.title}
                  variant="ghost"
                  className="justify-start gap-2"
                >
                  <Image
                    alt={option.title}
                    src={option.imageUrl}
                    height={18}
                    width={18}
                  />
                  {option.title}
                </Button>
              ))}
            </div>

            {/* botao sair da conta */}
            <div className="flex flex-col gap-2 px-2 pb-4">
              <Button variant="ghost" className="justify-start gap-2">
                <LogOutIcon size={18} />
                Sair da conta
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
