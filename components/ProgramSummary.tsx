import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getFilteredData, getBudgetData, getPerformanceData, getStateDistrictData } from "@/services/dataService"
import { PARTNERS, STATES, PERIODS } from "@/data/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

// Demo data for partner-wise distribution
const partnerData = [
  { name: 'EduTech Foundation', value: 100 }
];

// Demo data for grade-wise distribution
const gradeData = [
  { name: 'Elementary', value: 40 },
  { name: 'Middle School', value: 30 },
  { name: 'High School', value: 20 },
  { name: 'Special Education', value: 10 },
]

const ORANGE_SHADES = [
  '#f97316', // Primary orange
  '#ea580c', // Darker orange
  '#c2410c', // Deep orange
  '#9a3412', // Rust orange
  '#7c2d12', // Dark rust
  '#5c1d0c'  // Deep rust
];

interface ProgramSummaryProps {
  partner: string
  state: string
  period: string
  setPartner: (value: string) => void
  setState: (value: string) => void
  setPeriod: (value: string) => void
}

export function ProgramSummary({ 
  partner, 
  state, 
  period, 
  setPartner, 
  setState, 
  setPeriod 
}: ProgramSummaryProps) {
  const filteredData = getFilteredData(partner, state, period);
  const budgetData = getBudgetData(partner, state, period);
  const performanceData = getPerformanceData(partner, state, period);
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const stateDistrictData = getStateDistrictData(state);

  // Calculate SMTV data for the chart
  const smtvData = [
    { name: 'Pending', value: Math.floor(stateDistrictData.stvInstalled * 0.3) }, // Assuming 30% are pending installation
    { name: 'Installed', value: stateDistrictData.stvInstalled }
  ];

  // Calculate subject-wise resource usage data
  const resourceData = [
    { name: 'English', value: stateDistrictData.resourceUsage.english },
    { name: 'Mathematics', value: stateDistrictData.resourceUsage.mathematics },
    { name: 'Science', value: stateDistrictData.resourceUsage.science },
    { name: 'Other', value: stateDistrictData.resourceUsage.other }
  ];

  // Calculate period factor for more accurate data
  const getPeriodFactor = () => {
    if (period === 'all') return 1;
    if (period === 'YTD') {
      const currentMonth = new Date().getMonth();
      return (currentMonth + 1) / 12;
    }
    return 0.25; // For Q1, Q2, Q3, Q4
  };

  const periodFactor = getPeriodFactor();

  // Calculate base metrics without factors
  const calculateBaseMetrics = () => {
    const baseData = {
      budget: {
        total: filteredData.budget,
        breakdown: [
          { 
            category: 'Teacher Training', 
            percentage: 0.2,
            description: 'Professional development and training programs'
          },
          { 
            category: 'Learning Materials', 
            percentage: 0.35,
            description: 'Textbooks, digital resources, and educational kits'
          },
          { 
            category: 'Infrastructure', 
            percentage: 0.25,
            description: 'Classroom improvements and technology setup'
          },
          { 
            category: 'Monitoring', 
            percentage: 0.12,
            description: 'Program evaluation and quality assurance'
          },
          { 
            category: 'Miscellaneous', 
            percentage: 0.08,
            description: 'Administrative and operational expenses'
          }
        ]
      },
      schools: {
        total: filteredData.schools,
        breakdown: [
          { 
            type: 'Government', 
            percentage: 0.7,
            description: 'Public schools under government management'
          },
          { 
            type: 'Private', 
            percentage: 0.3,
            description: 'Private schools and aided institutions'
          }
        ]
      },
      students: {
        total: filteredData.students,
        breakdown: [
          { 
            grade: 'Elementary', 
            percentage: 0.4,
            description: 'Grades 1-5'
          },
          { 
            grade: 'Middle School', 
            percentage: 0.3,
            description: 'Grades 6-8'
          },
          { 
            grade: 'High School', 
            percentage: 0.3,
            description: 'Grades 9-12'
          }
        ]
      },
      teachers: {
        total: filteredData.teachers,
        breakdown: [
          { 
            subject: 'Mathematics', 
            percentage: 0.3,
            description: 'Math and quantitative skills'
          },
          { 
            subject: 'Science', 
            percentage: 0.25,
            description: 'Physics, Chemistry, Biology'
          },
          { 
            subject: 'Languages', 
            percentage: 0.25,
            description: 'English and regional languages'
          },
          { 
            subject: 'Social Studies', 
            percentage: 0.2,
            description: 'History, Geography, Civics'
          }
        ]
      }
    };

    return baseData;
  };

  const baseMetrics = calculateBaseMetrics();

  // Calculate final metrics with proper scaling
  const metrics = {
    budget: {
      total: filteredData.budget,
      utilized: Math.floor(filteredData.budget * 0.75),
      remaining: Math.floor(filteredData.budget * 0.25),
      breakdown: baseMetrics.budget.breakdown.map(item => ({
        ...item,
        amount: Math.floor(filteredData.budget * item.percentage)
      }))
    },
    schools: {
      total: filteredData.schools,
      urban: Math.floor(filteredData.schools * (state === 'delhi' ? 0.8 : 0.6)),
      rural: Math.floor(filteredData.schools * (state === 'delhi' ? 0.2 : 0.4)),
      breakdown: baseMetrics.schools.breakdown.map(item => ({
        ...item,
        count: Math.floor(filteredData.schools * item.percentage)
      }))
    },
    students: {
      total: filteredData.students,
      male: Math.floor(filteredData.students * 0.52),
      female: Math.floor(filteredData.students * 0.48),
      breakdown: baseMetrics.students.breakdown.map(item => ({
        ...item,
        count: Math.floor(filteredData.students * item.percentage)
      }))
    },
    teachers: {
      total: filteredData.teachers,
      trained: Math.floor(filteredData.teachers * 0.8),
      pending: Math.floor(filteredData.teachers * 0.2),
      breakdown: baseMetrics.teachers.breakdown.map(item => ({
        ...item,
        count: Math.floor(filteredData.teachers * item.percentage)
      }))
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-2xl border-2 border-orange-200/60 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Program Summary
          </h1>
          <p className="text-orange-600/80 text-lg">
            Overview of key program statistics and distribution
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={partner} onValueChange={setPartner}>
            <SelectTrigger className="w-[180px] border-orange-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50/50 transition-colors">
              <SelectValue placeholder="Select Partner" />
            </SelectTrigger>
            <SelectContent>
              {PARTNERS.map((partner) => (
                <SelectItem key={partner.value} value={partner.value}>
                  {partner.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-[180px] border-orange-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50/50 transition-colors">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] border-orange-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50/50 transition-colors">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Dialog open={openDialog === 'budget'} onOpenChange={(open) => setOpenDialog(open ? 'budget' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-br from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  ${filteredData.budget.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {period === "all" ? "All Periods" : period === "YTD" ? "Year to date" : `${period} 2023`}
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-orange-600">Budget Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-sm text-orange-600">Total Budget</p>
                  <p className="text-lg font-semibold text-orange-700">${metrics.budget.total.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-600">Utilized</p>
                  <p className="text-lg font-semibold text-green-700">${metrics.budget.utilized.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Budget Breakdown</h4>
                {metrics.budget.breakdown.map((item, index) => (
                  <div key={index} className="space-y-1 p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.category}</span>
                      <span className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog === 'schools'} onOpenChange={(open) => setOpenDialog(open ? 'schools' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Schools Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {filteredData.schools.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total schools in program</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-orange-600">Schools Coverage Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Urban Schools</p>
                  <p className="text-lg font-semibold text-blue-700">{metrics.schools.urban.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-600">Rural Schools</p>
                  <p className="text-lg font-semibold text-purple-700">{metrics.schools.rural.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">School Type Distribution</h4>
                {metrics.schools.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <span className="text-sm text-gray-600">{item.type}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog === 'students'} onOpenChange={(open) => setOpenDialog(open ? 'students' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Students Reached</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  {filteredData.students.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total students impacted</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-orange-600">Student Coverage Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-sm text-emerald-600">Male Students</p>
                  <p className="text-lg font-semibold text-emerald-700">{metrics.students.male.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                  <p className="text-sm text-pink-600">Female Students</p>
                  <p className="text-lg font-semibold text-pink-700">{metrics.students.female.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Grade-wise Distribution</h4>
                {metrics.students.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <span className="text-sm text-gray-600">{item.grade}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog === 'teachers'} onOpenChange={(open) => setOpenDialog(open ? 'teachers' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Teachers Trained</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {filteredData.teachers.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total teachers trained</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-orange-600">Teacher Training Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-600">Trained Teachers</p>
                  <p className="text-lg font-semibold text-purple-700">{metrics.teachers.trained.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-sm text-yellow-600">Pending Training</p>
                  <p className="text-lg font-semibold text-yellow-700">{metrics.teachers.pending.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Subject-wise Distribution</h4>
                {metrics.teachers.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <span className="text-sm text-gray-600">{item.subject}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-orange-600">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={budgetData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#f97316' }}
                    name="Budget"
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                    name="Spent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-orange-600">SMTV Installation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={smtvData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#f97316"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    paddingAngle={2}
                  >
                    {smtvData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={ORANGE_SHADES[index % ORANGE_SHADES.length]} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '0.875rem'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()}`, 'Units']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span className="text-orange-600 font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-orange-600">Subject-wise Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#f97316"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    paddingAngle={2}
                  >
                    {resourceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={ORANGE_SHADES[index % ORANGE_SHADES.length]} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '0.875rem'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()}`, 'Resources']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span className="text-orange-600 font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-orange-600">Program Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#f97316' }}
                    name="Students"
                  />
                  <Line
                    type="monotone"
                    dataKey="teachers"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                    name="Teachers"
                  />
                  <Line
                    type="monotone"
                    dataKey="schools"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                    name="Schools"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 