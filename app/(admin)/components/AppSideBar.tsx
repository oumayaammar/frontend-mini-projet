"use client"
import { Calendar, ChevronUp, Home, MessageCircle, Newspaper, Plus, Projector, User2, Users2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
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
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { clearAuthSession, getStoredAuthUser, getUserDisplayName } from "@/lib/auth-client";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';



const items = [
  {
    title: "Home",
    url: "/admin-dashboard",
    icon: Home,
  },
  {
    title: "Messages",
    url: "/inbox",
    icon: MessageCircle,
  },
  {
    title: "Time Tables",
    url: "/timeTablesManagement",
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
                  {item.title === "Message" && (
                    <SidebarMenuBadge>2</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))} 
            </SidebarMenu>
            
            {/* NESTED : News */}
        <SidebarGroup>
          <SidebarGroupLabel>News</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/news-managment">
                    <Newspaper />
                    See All News
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/news-managment/add-news">
                        <Plus />
                        Add News
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
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
                  <Link href="/coursesManagement">
                    <Projector />
                    See All Courses
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/coursesManagement/create">
                        <Plus />
                        Add Course
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* NESTED : Users  */}
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/users">
                    <Users2 />
                    See All Users
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
                  <Link href="/user">Account</Link>
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