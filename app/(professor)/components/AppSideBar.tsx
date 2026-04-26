"use client"
import { Calendar, ChevronUp, Home, Inbox, Newspaper, Projector, User2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from 'next/link';
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { clearAuthSession, getStoredAuthUser, getUserDisplayName } from "@/lib/auth-client";



const items = [
  {
    title: "Home",
    url: "/professor-dashboard",
    icon: Home,
  },
  {
    title: "Message",
    url: "/professor/messages",
    icon: Inbox,
  },
  {
    title: "Time Table",
    url: "/professor/timetable",
    icon: Calendar,
  },
];

const AppSideBar = () => {
  const router = useRouter();
  const displayName = useMemo(() => getUserDisplayName(getStoredAuthUser()), []);

  function handleLogout() {
    clearAuthSession();
    router.push("/sign-in");
  }

  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/professor-dashboard" className='flex items-center gap-2'>
                {/* add logo */}
                <span>School-Mang</span>
              </Link>
            </SidebarMenuButton>
            <SidebarSeparator/>
          </SidebarMenuItem>        
        </SidebarMenu>
      </SidebarHeader>
        
      <SidebarContent>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} 
            </SidebarMenu>
            
        <SidebarGroup>
          <SidebarGroupLabel>News</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/professor/news">
                    <Newspaper />
                    See All News
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* NESTED : Courses  */}
        <SidebarGroup>
          <SidebarGroupLabel>Courses</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/professor/courses">
                    <Projector />
                    See All Courses
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
          </SidebarGroupContent>
          <SidebarGroup />
      </SidebarContent>



      <SidebarFooter>
        <SidebarMenu> 
          <SidebarMenuItem>
            <DropdownMenu>  
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2/> {displayName} <ChevronUp className='ml-auto' /> 
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/professor/user">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>


    </Sidebar>
  )
}
  
export default AppSideBar