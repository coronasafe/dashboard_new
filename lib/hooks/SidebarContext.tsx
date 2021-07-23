import React, { useMemo, useState } from "react"

type SidebarContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

export const SidebarContext = React.createContext<SidebarContextType>({
  isSidebarOpen: false,
  toggleSidebar: () => {
    console.log("NO")
  },
  closeSidebar: () => {},
})

export const SidebarProvider: React.FC = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const value = {
    isSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    closeSidebar: () => setIsSidebarOpen(false),
  }

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}
