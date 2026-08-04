"use client"
import { Button } from "./ui/button"
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage } from "./ui/avatar"
import SignInDialog from "./sign-in-dialog"

const SidebarSheet = () => {
  const { data } = useSession()

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
              {/* renderiza o login */}
              <DialogContent className="w-[90%]">
                <SignInDialog />
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

        <Button
          variant="ghost"
          className="justify-start gap-2"
          render={
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          }
        />
      </div>

      {/* renderia as opcoes das buscas dinamicamente */}
      <div className="flex flex-col gap-2 border-b border-solid px-2 pb-4">
        {quickSearchOptions.map((option) => (
          <SheetClose
            key={option.title}
            render={
              <Button
                variant="ghost"
                className="justify-start gap-2"
                render={
                  <Link href={`/barbershops?service=${option.title}`}>
                    <Image
                      alt={option.title}
                      src={option.imageUrl}
                      height={18}
                      width={18}
                    />
                    {option.title}
                  </Link>
                }
              ></Button>
            }
          />
        ))}
      </div>

      {/* botao sair da conta */}
      {data?.user && (
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
      )}
    </SheetContent>
  )
}

export default SidebarSheet
