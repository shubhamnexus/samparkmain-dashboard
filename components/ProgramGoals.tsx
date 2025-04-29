import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { getFilteredData, getDistrictData, getBlockData } from "@/services/dataService"
import { PARTNERS, STATES, PERIODS } from "@/data/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ProgramGoalsProps {
  partner: string
  state: string
  period: string
  setPartner: (value: string) => void
  setState: (value: string) => void
  setPeriod: (value: string) => void
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

interface BudgetData {
  total: number;
  utilized: number;
  remaining: number;
  categories: BudgetCategory[];
}

interface ProgramMetrics {
  assetsToDeploy: {
    total: number;
    deployed: number;
    remaining: number;
  };
  schools: {
    total: number;
    covered: number;
  };
  students: {
    total: number;
    covered: number;
  };
  sparks: {
    total: number;
    distributed: number;
  };
  kits: {
    total: number;
    distributed: number;
  };
  teachers: {
    total: number;
    trained: number;
  };
}

interface Metrics {
  budget: BudgetData;
  program: ProgramMetrics;
}

export function ProgramGoals({
  partner,
  state,
  period,
  setPartner,
  setState,
  setPeriod,
}: ProgramGoalsProps) {
  const [showDistrictDetails, setShowDistrictDetails] = useState(false);
  const [showBlockDetails, setShowBlockDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Get filtered data
  const filteredData = useMemo(() => getFilteredData(partner, state, period), [partner, state, period]);

  // Calculate budget data based on filtered data
  const budgetData = useMemo<BudgetData>(() => {
    const baseBudget = filteredData.budget;
    const utilizationRate = period === 'Q1' ? 0.3 :
                          period === 'Q2' ? 0.5 :
                          period === 'Q3' ? 0.7 :
                          period === 'Q4' ? 0.85 :
                          period === 'YTD' ? 0.75 : 0.7;

    // Add some randomization to make it more realistic
    const randomFactor = 0.9 + Math.random() * 0.2;
    const actualUtilization = utilizationRate * randomFactor;

    return {
      total: baseBudget,
      utilized: Math.floor(baseBudget * actualUtilization),
      remaining: Math.floor(baseBudget * (1 - actualUtilization)),
      categories: [
        {
          name: 'Teacher Training',
          allocated: Math.floor(baseBudget * 0.2),
          spent: Math.floor(baseBudget * 0.2 * actualUtilization)
        },
        {
          name: 'Learning Materials',
          allocated: Math.floor(baseBudget * 0.35),
          spent: Math.floor(baseBudget * 0.35 * actualUtilization)
        },
        {
          name: 'Infrastructure',
          allocated: Math.floor(baseBudget * 0.25),
          spent: Math.floor(baseBudget * 0.25 * actualUtilization)
        },
        {
          name: 'Monitoring',
          allocated: Math.floor(baseBudget * 0.12),
          spent: Math.floor(baseBudget * 0.12 * actualUtilization)
        },
        {
          name: 'Miscellaneous',
          allocated: Math.floor(baseBudget * 0.08),
          spent: Math.floor(baseBudget * 0.08 * actualUtilization)
        }
      ]
    };
  }, [filteredData.budget, period]);

  // Calculate program metrics based on filtered data
  const programMetrics = useMemo<ProgramMetrics>(() => {
    const baseProgress = period === 'Q1' ? 0.25 :
                        period === 'Q2' ? 0.5 :
                        period === 'Q3' ? 0.75 :
                        period === 'Q4' ? 0.9 :
                        period === 'YTD' ? 0.8 : 0.7;

    // Add variation based on partner and state
    const partnerFactor = partner === 'edutech' ? 1.1 :
                         partner === 'brightfuture' ? 0.95 :
                         partner === 'learningtree' ? 1.05 : 1;

    const stateFactor = state === 'maharashtra' || state === 'delhi' ? 1.15 :
                       state === 'kerala' || state === 'karnataka' ? 1.1 :
                       state === 'gujarat' || state === 'tamil-nadu' ? 1.05 : 1;

    const progress = baseProgress * partnerFactor * stateFactor;

    return {
      assetsToDeploy: {
        total: filteredData.kits,
        deployed: Math.floor(filteredData.kits * progress),
        remaining: Math.floor(filteredData.kits * (1 - progress))
      },
      schools: {
        total: filteredData.schools,
        covered: Math.floor(filteredData.schools * progress)
      },
      students: {
        total: filteredData.students,
        covered: Math.floor(filteredData.students * progress)
      },
      sparks: {
        total: filteredData.students * 2,
        distributed: Math.floor(filteredData.students * 2 * progress)
      },
      kits: {
        total: filteredData.kits,
        distributed: Math.floor(filteredData.kits * progress)
      },
      teachers: {
        total: filteredData.teachers,
        trained: Math.floor(filteredData.teachers * progress)
      }
    };
  }, [filteredData, partner, state, period]);

  // Get district and block data
  const districtData = useMemo(() => getDistrictData(partner, state, period), [partner, state, period]);
  const blockData = useMemo(() => getBlockData(partner, state, period), [partner, state, period]);

  const metrics: Metrics = useMemo(() => ({
    budget: budgetData,
    program: programMetrics
  }), [budgetData, programMetrics]);

  const renderCardDialog = () => {
    if (!selectedCard || !metrics) return null;

    const getDialogContent = () => {
      switch (selectedCard) {
        case 'assets':
          return {
            title: 'Assets Deployment Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Assets</p>
                    <p className="text-lg font-semibold">{metrics.program.assetsToDeploy.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Deployed</p>
                    <p className="text-lg font-semibold">{metrics.program.assetsToDeploy.deployed.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remaining</p>
                    <p className="text-lg font-semibold">{metrics.program.assetsToDeploy.remaining.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Deployment Rate</p>
                    <p className="text-lg font-semibold">
                      {((metrics.program.assetsToDeploy.deployed / metrics.program.assetsToDeploy.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(metrics.program.assetsToDeploy.deployed / metrics.program.assetsToDeploy.total) * 100} 
                  className="h-2" 
                />
              </div>
            )
          };
        case 'schools':
          return {
            title: 'Schools Coverage Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Schools</p>
                    <p className="text-lg font-semibold">{metrics.program.schools.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Covered Schools</p>
                    <p className="text-lg font-semibold">{metrics.program.schools.covered.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remaining Schools</p>
                    <p className="text-lg font-semibold">
                      {(metrics.program.schools.total - metrics.program.schools.covered).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Coverage Rate</p>
                    <p className="text-lg font-semibold">
                      {((metrics.program.schools.covered / metrics.program.schools.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(metrics.program.schools.covered / metrics.program.schools.total) * 100} 
                  className="h-2" 
                />
              </div>
            )
          };
        case 'students':
          return {
            title: 'Students Coverage Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-lg font-semibold">{metrics.program.students.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Covered Students</p>
                    <p className="text-lg font-semibold">{metrics.program.students.covered.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remaining Students</p>
                    <p className="text-lg font-semibold">
                      {(metrics.program.students.total - metrics.program.students.covered).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Coverage Rate</p>
                    <p className="text-lg font-semibold">
                      {((metrics.program.students.covered / metrics.program.students.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(metrics.program.students.covered / metrics.program.students.total) * 100} 
                  className="h-2" 
                />
              </div>
            )
          };
        case 'sparks':
          return {
            title: 'Sparks Distribution Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Sparks</p>
                    <p className="text-lg font-semibold">{metrics.program.sparks.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Distributed Sparks</p>
                    <p className="text-lg font-semibold">{metrics.program.sparks.distributed.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remaining Sparks</p>
                    <p className="text-lg font-semibold">
                      {(metrics.program.sparks.total - metrics.program.sparks.distributed).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Distribution Rate</p>
                    <p className="text-lg font-semibold">
                      {((metrics.program.sparks.distributed / metrics.program.sparks.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(metrics.program.sparks.distributed / metrics.program.sparks.total) * 100} 
                  className="h-2" 
                />
              </div>
            )
          };
        case 'kits':
          return {
            title: 'Kits Distribution Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Kits</p>
                    <p className="text-lg font-semibold">{metrics.program.kits.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Distributed Kits</p>
                    <p className="text-lg font-semibold">{metrics.program.kits.distributed.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remaining Kits</p>
                    <p className="text-lg font-semibold">
                      {(metrics.program.kits.total - metrics.program.kits.distributed).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Distribution Rate</p>
                    <p className="text-lg font-semibold">
                      {((metrics.program.kits.distributed / metrics.program.kits.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(metrics.program.kits.distributed / metrics.program.kits.total) * 100} 
                  className="h-2" 
                />
              </div>
            )
          };
        case 'teachers':
          return {
            title: 'Teacher Training Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Teachers</p>
                    <p className="text-lg font-semibold">{metrics.program.teachers.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Trained Teachers</p>
                    <p className="text-lg font-semibold">{metrics.program.teachers.trained.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remaining Teachers</p>
                    <p className="text-lg font-semibold">
                      {(metrics.program.teachers.total - metrics.program.teachers.trained).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Training Rate</p>
                    <p className="text-lg font-semibold">
                      {((metrics.program.teachers.trained / metrics.program.teachers.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(metrics.program.teachers.trained / metrics.program.teachers.total) * 100} 
                  className="h-2" 
                />
              </div>
            )
          };
        default:
          return null;
      }
    };

    const content = getDialogContent();
    if (!content) return null;

    return (
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
          </DialogHeader>
          {content.content}
        </DialogContent>
      </Dialog>
    );
  };

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-2xl border-2 border-orange-200/60 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Program Goals
          </h1>
          <p className="text-orange-600/80 text-lg">
            Track and monitor program objectives and milestones
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={partner} onValueChange={setPartner}>
            <SelectTrigger className="w-[180px] border-orange-300 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-orange-50/80 hover:border-orange-400 transition-colors">
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
            <SelectTrigger className="w-[180px] border-orange-300 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-orange-50/80 hover:border-orange-400 transition-colors">
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
            <SelectTrigger className="w-[180px] border-orange-300 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-orange-50/80 hover:border-orange-400 transition-colors">
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

      {/* Budget Utilization Card */}
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-800">Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Budget Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                <span className="text-sm font-semibold bg-gradient-to-br from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  {((metrics.budget.utilized / metrics.budget.total) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={(metrics.budget.utilized / metrics.budget.total) * 100} className="h-2" />
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Budget</p>
                  <p className="text-sm font-semibold text-gray-900">${metrics.budget.total.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Utilized</p>
                  <p className="text-sm font-semibold text-gray-900">${metrics.budget.utilized.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Remaining</p>
                  <p className="text-sm font-semibold text-gray-900">${metrics.budget.remaining.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Category-wise Budget */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600">Category-wise Utilization</h4>
              <div className="space-y-2">
                {metrics.budget.categories.map((category: BudgetCategory, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{category.name}</span>
                      <span className="font-medium text-gray-900">
                        ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(category.spent / category.allocated) * 100} 
                      className="h-1.5" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Assets to Deploy Card */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          onClick={() => setSelectedCard('assets')}
        >
          <CardHeader>
            <CardTitle className="text-gray-800">Assets to Deploy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Assets</span>
                <span>{metrics.program.assetsToDeploy.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Deployed</span>
                <span>{metrics.program.assetsToDeploy.deployed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Remaining</span>
                <span>{metrics.program.assetsToDeploy.remaining.toLocaleString()}</span>
              </div>
              <Progress value={(metrics.program.assetsToDeploy.deployed / metrics.program.assetsToDeploy.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Schools Coverage Card */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          onClick={() => setSelectedCard('schools')}
        >
          <CardHeader>
            <CardTitle className="text-gray-800">Schools Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Schools</span>
                <span>{metrics.program.schools.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Covered</span>
                <span>{metrics.program.schools.covered.toLocaleString()}</span>
              </div>
              <Progress value={(metrics.program.schools.covered / metrics.program.schools.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Students Coverage Card */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          onClick={() => setSelectedCard('students')}
        >
          <CardHeader>
            <CardTitle className="text-gray-800">Students Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Students</span>
                <span>{metrics.program.students.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Covered</span>
                <span>{metrics.program.students.covered.toLocaleString()}</span>
              </div>
              <Progress value={(metrics.program.students.covered / metrics.program.students.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Sparks Distribution Card */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          onClick={() => setSelectedCard('sparks')}
        >
          <CardHeader>
            <CardTitle className="text-gray-800">Sparks Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Sparks</span>
                <span>{metrics.program.sparks.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Distributed</span>
                <span>{metrics.program.sparks.distributed.toLocaleString()}</span>
              </div>
              <Progress value={(metrics.program.sparks.distributed / metrics.program.sparks.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Kits Distribution Card */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          onClick={() => setSelectedCard('kits')}
        >
          <CardHeader>
            <CardTitle className="text-gray-800">Kits Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Kits</span>
                <span>{metrics.program.kits.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Distributed</span>
                <span>{metrics.program.kits.distributed.toLocaleString()}</span>
              </div>
              <Progress value={(metrics.program.kits.distributed / metrics.program.kits.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Teacher Training Card */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          onClick={() => setSelectedCard('teachers')}
        >
          <CardHeader>
            <CardTitle className="text-gray-800">Teacher Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Teachers</span>
                <span>{metrics.program.teachers.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Trained</span>
                <span>{metrics.program.teachers.trained.toLocaleString()}</span>
              </div>
              <Progress value={(metrics.program.teachers.trained / metrics.program.teachers.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* District-wise Coverage Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-800">District-wise Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-900">{data.name}</h3>
                            <div className="space-y-1 mt-2 text-sm">
                              <p className="text-gray-600">Coverage: <span className="font-medium text-gray-900">{data.coverage}%</span></p>
                              <p className="text-gray-600">Schools: <span className="font-medium text-gray-900">{data.coveredSchools}/{data.totalSchools}</span></p>
                              <p className="text-gray-600">Students: <span className="font-medium text-gray-900">{data.coveredStudents.toLocaleString()}/{data.totalStudents.toLocaleString()}</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="coverage" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Block-wise Coverage Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-800">Block-wise Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-900">{data.name}</h3>
                            <div className="space-y-1 mt-2 text-sm">
                              <p className="text-gray-600">Coverage: <span className="font-medium text-gray-900">{data.coverage}%</span></p>
                              <p className="text-gray-600">Schools: <span className="font-medium text-gray-900">{data.coveredSchools}/{data.totalSchools}</span></p>
                              <p className="text-gray-600">Students: <span className="font-medium text-gray-900">{data.coveredStudents.toLocaleString()}/{data.totalStudents.toLocaleString()}</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="coverage" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {renderCardDialog()}
    </div>
  )
} 