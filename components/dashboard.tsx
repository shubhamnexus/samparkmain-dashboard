"use client"

import { useState } from "react"
import { LayoutDashboard, BarChart2, PieChart, FileText, Settings, ChevronLeft, Activity } from "lucide-react"

import { ProgramSummary } from "./ProgramSummary"
import { ProgramGoals } from "./ProgramGoals"
import { LiveUpdates } from "./LiveUpdates"
import { ProgramOverview } from "./ProgramOverview"
import { ReportGenerator } from "./ReportGenerator"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [partner, setPartner] = useState("edutech")
  const [state, setState] = useState("andhra-pradesh")
  const [period, setPeriod] = useState("all")
  const [currentView, setCurrentView] = useState("summary")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white px-6 shadow-sm backdrop-blur-sm bg-white/80">
        <div className="flex items-center gap-2">
          <div className="text-orange-500 text-xl bg-orange-50 p-1 rounded-lg">🎓</div>
          <div className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sampark Dashboard
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="https://dmdashboard.samparksmartshala.org/static/media/logo-black.03df822f383fee06ef8e6e4fb67324de.svg" alt="Logo" className="h-48 w-48" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={cn(
          "relative transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-0" : "w-64"
        )}>
          <div className={cn(
            "absolute inset-y-0 left-0 flex-shrink-0 border-r bg-white/80 backdrop-blur-sm",
            isSidebarCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"
          )}>
            <nav className="flex flex-col p-4 h-full">
              <div className="space-y-2">
                <a
                  href="#"
                  onClick={() => setCurrentView("summary")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 ${
                    currentView === "summary" ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm" : ""
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className={cn("transition-opacity duration-300", 
                    isSidebarCollapsed ? "opacity-0" : "opacity-100"
                  )}>Program Summary</span>
                </a>
                <a
                  href="#"
                  onClick={() => setCurrentView("goals")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 ${
                    currentView === "goals" ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm" : ""
                  }`}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span className={cn("transition-opacity duration-300",
                    isSidebarCollapsed ? "opacity-0" : "opacity-100"
                  )}>Program Goals</span>
                </a>
                <a
                  href="#"
                  onClick={() => setCurrentView("overview")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 ${
                    currentView === "overview" ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm" : ""
                  }`}
                >
                  <PieChart className="h-5 w-5" />
                  <span className={cn("transition-opacity duration-300",
                    isSidebarCollapsed ? "opacity-0" : "opacity-100"
                  )}>Program Overview</span>
                </a>
                <a
                  href="#"
                  onClick={() => setCurrentView("report")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 ${
                    currentView === "report" ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm" : ""
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span className={cn("transition-opacity duration-300",
                    isSidebarCollapsed ? "opacity-0" : "opacity-100"
                  )}>Generate Report</span>
                </a>
                <a
                  href="#"
                  onClick={() => setCurrentView("live-updates")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 ${
                    currentView === "live-updates" ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm" : ""
                  }`}
                >
                  <Activity className="h-5 w-5" />
                  <span className={cn("transition-opacity duration-300",
                    isSidebarCollapsed ? "opacity-0" : "opacity-100"
                  )}>Live Updates</span>
                </a>
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 transition-all">
                  <Settings className="h-5 w-5" />
                  <span className={cn("transition-opacity duration-300",
                    isSidebarCollapsed ? "opacity-0" : "opacity-100"
                  )}>Settings</span>
                </div>
              </div>
            </nav>
          </div>
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-3 top-6 z-10 h-7 w-7 rounded-full border bg-white p-0 shadow-lg hover:bg-orange-50 hover:text-orange-600 text-gray-600 transition-colors",
              isSidebarCollapsed ? "-right-3" : "-right-3"
            )}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-300",
              isSidebarCollapsed ? "rotate-180" : ""
            )} />
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {currentView === "summary" && (
            <ProgramSummary
              partner={partner}
              state={state}
              period={period}
              setPartner={setPartner}
              setState={setState}
              setPeriod={setPeriod}
            />
          )}
          {currentView === "goals" && (
            <ProgramGoals
              partner={partner}
              state={state}
              period={period}
              setPartner={setPartner}
              setState={setState}
              setPeriod={setPeriod}
            />
          )}
          {currentView === "overview" && (
            <ProgramOverview
              partner={partner}
              state={state}
              period={period}
              setPartner={setPartner}
              setState={setState}
              setPeriod={setPeriod}
            />
          )}
          {currentView === "report" && (
            <ReportGenerator />
          )}
          {currentView === "live-updates" && <LiveUpdates />}
        </main>
      </div>
    </div>
  )
}
