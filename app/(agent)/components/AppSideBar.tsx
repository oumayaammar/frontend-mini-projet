"use client"
import { Calendar, ChevronDown, ChevronUp, Home, Inbox, Newspaper, Plus, Projector, Search, Settings,User2 ,Users2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from 'next/link';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



const items = [
  {
    title: "Home",
    url: "/agent-dashboard",
    icon: Home,
  },
  {
    title: "Message",
    url: "/agent/inbox",
    icon: Inbox,
  },
];

const AppSideBar = () => {
  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
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
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))} 
            </SidebarMenu>
            
        <SidebarGroup>
          <SidebarGroupLabel>News</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/agent/news">
                    <Newspaper />
                    See All News
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
                  <User2/> Oumaya Ammar <ChevronUp className='ml-auto' /> 
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>


    </Sidebar>
  )
}
  
export default AppSideBar