import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"

const Header = () => {
  return (
    <Card className="rounded-none">
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Image alt="fsw Barber" src="/logo.png" height={18} width={120} />
        </Link>
        <Sheet>
          <SheetTrigger
            render={
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            }
          />

          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
