import { Cloud } from "lucide-react"

export function Header() {
  return (
    <div className="border-b border-border bg-gradient-to-r from-primary/5 via-card to-accent/5 backdrop-blur-sm">
      <div className="px-4 md:px-8 py-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Gestión de Proyectos
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-2">
              Programa de Ingeniería de Sistemas · Universidad de La Guajira
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-fit px-4 py-2.5 bg-accent/10 border border-accent/30 rounded-full mt-4 hover:bg-accent/15 transition-colors">
          <Cloud className="w-5 h-5 text-accent animate-pulse" />
          <span className="text-sm font-medium text-accent">Conectado a Google Sheets</span>
        </div>
      </div>
    </div>
  )
}

export default Header
