"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import DashboardView from "@/components/views/dashboard-view"
import EstudiantesView from "@/components/views/estudiantes-view"
import DocentesView from "@/components/views/docentes-view"
import ProyectosView from "@/components/views/proyectos-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, BookOpen, FolderOpen } from "lucide-react"

type TabType = "dashboard" | "estudiantes" | "docentes" | "proyectos"

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />
      case "estudiantes":
        return <EstudiantesView />
      case "docentes":
        return <DocentesView />
      case "proyectos":
        return <ProyectosView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-sm">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="estudiantes"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Estudiantes</span>
            </TabsTrigger>
            <TabsTrigger
              value="docentes"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Docentes</span>
            </TabsTrigger>
            <TabsTrigger
              value="proyectos"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Proyectos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8 animate-in fade-in duration-300">
            {renderView()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
