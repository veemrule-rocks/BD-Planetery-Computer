import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Map,
  Waves,
  Wind,
  Thermometer,
  Sprout,
  MapPinned,
  FileText,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Interactive Map",
    url: "/",
    icon: Map,
  },
  {
    title: "Flood Monitoring",
    url: "/flood",
    icon: Waves,
  },
  {
    title: "Cyclone Tracking",
    url: "/cyclone",
    icon: Wind,
  },
  {
    title: "Climate Data",
    url: "/climate",
    icon: Thermometer,
  },
  {
    title: "Land Use Analysis",
    url: "/landuse",
    icon: Sprout,
  },
  {
    title: "Border Regions",
    url: "/borders",
    icon: MapPinned,
  },
  {
    title: "Reports & Analytics",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <Map className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Bangladesh</span>
            <span className="text-xs text-muted-foreground">Environmental Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <p>Data Source: Microsoft Planetary Computer</p>
          <p className="mt-1">© 2025 Government of Bangladesh</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
