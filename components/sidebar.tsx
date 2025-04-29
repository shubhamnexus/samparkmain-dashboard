import { BarChart3, FileText, Home, PieChart, Settings } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r bg-gray-50 md:block">
      <nav className="flex flex-col p-2">
        <div className="py-2 text-sm font-medium text-gray-500">MAIN MENU</div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-blue-600 transition-all hover:text-blue-600"
        >
          <Home className="h-4 w-4" />
          Prog Summary
        </Link>
        <Link
          href="/goals"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600"
        >
          <BarChart3 className="h-4 w-4" />
          Prog Goal
        </Link>
        <Link
          href="/overview"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600"
        >
          <PieChart className="h-4 w-4" />
          Prog Overview
        </Link>
        <Link
          href="/report"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600"
        >
          <FileText className="h-4 w-4" />
          Generate Report
        </Link>
        <div className="mt-6 py-2 text-sm font-medium text-gray-500">SETTINGS</div>
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </aside>
  )
}
