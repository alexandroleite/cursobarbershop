"use client"
import { Button } from "./ui/button"
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage } from "./ui/avatar"

const SidebarSheet = () => {
  const { data } = useSession()

  // funcao para logim
  const handleLoginWidhGoogleClick = () => signIn("google")
  // funçao para logout
  const handleLogoutWidhGoogleClick = () => signOut()

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      {/* container avatar */}
      <div className="flex items-center justify-between gap-3 border-b border-solid px-2 pb-3">
        {/* se tiver login */}
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data?.user?.image ?? ""} />
            </Avatar>

            <div>
              <p className="font-bold">{data.user.name}</p>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </div>
        ) : (
          // se nao tiver logim rendira abaixo
          <>
            <h2 className="font-bold">Olá faça seu login</h2>

            <Dialog>
              <DialogTrigger
                render={
                  <Button size="icon">
                    <LogInIcon size={18} />
                  </Button>
                }
              />

              <DialogContent className="w-[90%]">
                <DialogHeader>
                  <DialogTitle>Faça login na plataforma</DialogTitle>
                  <DialogDescription>
                    Conecte-se usando sua conta do Google
                  </DialogDescription>
                  <Button
                    variant="outline"
                    className="gap-1 font-bold"
                    onClick={handleLoginWidhGoogleClick}
                  >
                    <Image
                      src="/google.svg"
                      height={18}
                      width={18}
                      alt="Fazer login com o google"
                    />
                    Google
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )}
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
        <Button
          variant="ghost"
          className="justify-start gap-2"
          onClick={handleLogoutWidhGoogleClick}
        >
          <LogOutIcon size={18} />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  )
}

export default SidebarSheet
