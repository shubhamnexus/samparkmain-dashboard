import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Clock, Filter, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityType = "visit" | "training" | "meeting"

interface Activity {
  id: number
  type: ActivityType
  location: string
  date: string
  time: string
  participants: string[]
  status: string
  outcome: string
}

// Demo data
const demoActivities: Activity[] = [
  {
    id: 1,
    type: "visit",
    location: "Green Valley High School",
    date: "2024-03-15",
    time: "10:00 AM",
    participants: ["John Doe", "Jane Smith", "Principal Johnson"],
    status: "Completed",
    outcome: "Infrastructure assessment completed, new equipment needs identified"
  },
  {
    id: 2,
    type: "training",
    location: "Central Training Center",
    date: "2024-03-14",
    time: "2:00 PM",
    participants: ["Training Team", "15 Teachers"],
    status: "In Progress",
    outcome: "Digital literacy training session ongoing"
  },
  {
    id: 3,
    type: "meeting",
    location: "Partner Office",
    date: "2024-03-13",
    time: "11:00 AM",
    participants: ["Partner Rep", "Program Manager"],
    status: "Completed",
    outcome: "Q2 partnership goals discussed and aligned"
  }
]

const activityTypeColors: Record<ActivityType, string> = {
  visit: "bg-blue-100 text-blue-800",
  training: "bg-green-100 text-green-800",
  meeting: "bg-purple-100 text-purple-800"
}

export function LiveUpdates() {
  const [activities, setActivities] = useState<Activity[]>(demoActivities)
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredActivities = selectedType === "all" 
    ? activities 
    : activities.filter(activity => activity.type === selectedType)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Live Updates</h1>
          <button
            onClick={handleRefresh}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
              "bg-white border border-gray-200 hover:bg-gray-50",
              "transition-all duration-200 hover:shadow-sm",
              "text-gray-700"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedType("all")}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              selectedType === "all" 
                ? "bg-orange-500 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            All Activities
          </button>
          <button
            onClick={() => setSelectedType("visit")}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              selectedType === "visit" 
                ? "bg-blue-500 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            School Visits
          </button>
          <button
            onClick={() => setSelectedType("training")}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              selectedType === "training" 
                ? "bg-green-500 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            Training Sessions
          </button>
          <button
            onClick={() => setSelectedType("meeting")}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              selectedType === "meeting" 
                ? "bg-purple-500 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            Partner Meetings
          </button>
        </div>

        <div className="space-y-5">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 hover:border-orange-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold",
                    activityTypeColors[activity.type]
                  )}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{activity.status}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>

              <h3 className="mt-3 text-xl font-semibold text-gray-800">
                {activity.location}
              </h3>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{activity.participants.join(", ")}</span>
              </div>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {activity.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 