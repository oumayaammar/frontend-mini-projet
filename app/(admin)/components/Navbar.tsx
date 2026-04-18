"use client"
import {  LogOut, Moon, Settings, User ,Sun } from 'lucide-react'
import Link from 'next/link'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { useTheme } from "next-themes"
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { CommandWithShortcuts } from '@/components/SearchBar'





const Navbar = () => {
  const { setTheme } = useTheme()
  return (
    
    <nav className='w-full h-10 bg-secondary  flex items-center justify-between px-4' >
      
      <SidebarTrigger />
      
      <div className='text-sm  flex items-center  gap-4 px-4'>
        <Link href="/admin-dashboard" >Dashboard</Link>
        <CommandWithShortcuts/>
        {/* Theme Toggle */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>Prof</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" >
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem> 
                <User className="w-[1.2rem] h-[1.2rem] mr-1" />
                <p>Profile</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-[1.2rem] h-[1.2rem] mr-1"  />
                <p>Settings</p>
              </DropdownMenuItem>
              <DropdownMenuItem variant='destructive'>
                <LogOut className="w-[1.2rem] h-[1.2rem] mr-1" />
                <p>Logout</p>
              </DropdownMenuItem>

            </DropdownMenuGroup>
            
          </DropdownMenuContent>
        </DropdownMenu>
        
      
      </div>
      
    </nav>
  )
}

export default Navbar