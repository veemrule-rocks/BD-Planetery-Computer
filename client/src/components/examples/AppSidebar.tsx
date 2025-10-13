import { AppSidebar } from '../AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AppSidebarExample() {
  const style = {
    '--sidebar-width': '16rem',
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold">Main Content Area</h2>
          <p className="text-muted-foreground mt-2">Click on sidebar items to navigate</p>
        </div>
      </div>
    </SidebarProvider>
  )
}
