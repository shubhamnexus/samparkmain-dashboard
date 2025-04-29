import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts'
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { getFilteredData, getBudgetData, getPerformanceData } from "@/services/dataService"
import { PARTNERS, STATES, PERIODS } from "@/data/constants"
import { ArrowUp, ArrowDown, CheckCircle, AlertCircle, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface ProgramOverviewProps {
  partner: string
  state: string
  period: string
  setPartner: (value: string) => void
  setState: (value: string) => void
  setPeriod: (value: string) => void
}

// Add new interface for block data
interface BlockData {
  code: string;
  name: string;
  schools: number;
  students: number;
  teachers: number;
  smtvInstalled: number;
  teachersTrained: number;
  totalMeetings: number;
  schoolVisits: number;
  schoolsWithMoreThan5Lessons: number;
}

interface DistrictDetails {
  name: string;
  code: string;
  blocks: BlockData[];
  totalStats: {
    smtvInstalled: number;
    teachersTrained: number;
    totalMeetings: number;
    schoolVisits: number;
    schoolsWithMoreThan5Lessons: number;
    totalBlocks: number;
  };
}

// Add new interfaces for school data
interface SchoolData {
  code: string;
  name: string;
  students: number;
  teachers: number;
  smtvInstalled: boolean;
  teachersTrained: number;
  totalMeetings: number;
  schoolVisits: number;
  lessonsCompleted: number;
}

interface BlockDetails {
  name: string;
  code: string;
  schools: SchoolData[];
  totalStats: {
    totalSchools: number;
    smtvInstalled: number;
    teachersTrained: number;
    totalMeetings: number;
    schoolVisits: number;
    schoolsWithMoreThan5Lessons: number;
  };
}

export function ProgramOverview({ 
  partner, 
  state, 
  period, 
  setPartner, 
  setState, 
  setPeriod 
}: ProgramOverviewProps) {
  const filteredData = getFilteredData(partner, state, period);
  const budgetData = getBudgetData(partner, state, period);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictDetails | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockDetails | null>(null);
  const [showDistrictDetails, setShowDistrictDetails] = useState(false);
  const [showBlockDetails, setShowBlockDetails] = useState(false);

  // State-specific data for districts
  const getStateDistrictData = (state: string) => {
    const stateData = {
      'andhra-pradesh': {
        totalDistricts: 26,
        stvInstalled: 3250,
        teachersTrained: 42500,
        totalMeetings: 650,
        schoolVisits: [
          { month: 'Jan', visits: 250 },
          { month: 'Feb', visits: 300 },
          { month: 'Mar', visits: 350 },
          { month: 'Apr', visits: 400 },
          { month: 'May', visits: 450 },
          { month: 'Jun', visits: 500 }
        ],
        lessonsData: {
          moreThan5: 1250,
          lessThan5: 750
        },
        topDistricts: [
          { code: 'AP01', name: 'Anantapur', blocks: Math.min(63, 10), schools: 4500, students: 250000, teachers: 12500 },
          { code: 'AP02', name: 'Chittoor', blocks: Math.min(66, 10), schools: 4200, students: 235000, teachers: 11800 },
          { code: 'AP03', name: 'East Godavari', blocks: Math.min(60, 10), schools: 4800, students: 265000, teachers: 13200 },
          { code: 'AP04', name: 'Guntur', blocks: Math.min(57, 10), schools: 4100, students: 225000, teachers: 11200 },
          { code: 'AP05', name: 'Krishna', blocks: Math.min(50, 10), schools: 3800, students: 210000, teachers: 10500 },
          { code: 'AP06', name: 'Kurnool', blocks: Math.min(54, 10), schools: 3600, students: 195000, teachers: 9800 },
          { code: 'AP07', name: 'Nellore', blocks: Math.min(46, 10), schools: 3200, students: 180000, teachers: 9000 },
          { code: 'AP08', name: 'Prakasam', blocks: Math.min(56, 10), schools: 3500, students: 190000, teachers: 9500 },
          { code: 'AP09', name: 'Srikakulam', blocks: Math.min(38, 10), schools: 2800, students: 160000, teachers: 8000 },
          { code: 'AP10', name: 'Visakhapatnam', blocks: Math.min(43, 10), schools: 3000, students: 170000, teachers: 8500 }
        ]
      },
      'telangana': {
        totalDistricts: 33,
        stvInstalled: 2800,
        teachersTrained: 38000,
        totalMeetings: 550,
        schoolVisits: [
          { month: 'Jan', visits: 200 },
          { month: 'Feb', visits: 250 },
          { month: 'Mar', visits: 300 },
          { month: 'Apr', visits: 350 },
          { month: 'May', visits: 400 },
          { month: 'Jun', visits: 450 }
        ],
        lessonsData: {
          moreThan5: 1100,
          lessThan5: 650
        },
        topDistricts: [
          { code: 'TG01', name: 'Hyderabad', blocks: Math.min(16, 10), schools: 1800, students: 120000, teachers: 6000 },
          { code: 'TG02', name: 'Rangareddy', blocks: Math.min(27, 10), schools: 2200, students: 140000, teachers: 7000 },
          { code: 'TG03', name: 'Medchal', blocks: Math.min(22, 10), schools: 1900, students: 125000, teachers: 6250 },
          { code: 'TG04', name: 'Sangareddy', blocks: Math.min(26, 10), schools: 2100, students: 135000, teachers: 6750 },
          { code: 'TG05', name: 'Vikarabad', blocks: Math.min(18, 10), schools: 1600, students: 110000, teachers: 5500 },
          { code: 'TG06', name: 'Medak', blocks: Math.min(20, 10), schools: 1700, students: 115000, teachers: 5750 },
          { code: 'TG07', name: 'Nizamabad', blocks: Math.min(23, 10), schools: 1850, students: 122000, teachers: 6100 },
          { code: 'TG08', name: 'Kamareddy', blocks: Math.min(19, 10), schools: 1650, students: 112000, teachers: 5600 },
          { code: 'TG09', name: 'Karimnagar', blocks: Math.min(25, 10), schools: 2000, students: 130000, teachers: 6500 },
          { code: 'TG10', name: 'Warangal', blocks: Math.min(24, 10), schools: 1950, students: 128000, teachers: 6400 }
        ]
      },
      'karnataka': {
        totalDistricts: 31,
        stvInstalled: 2950,
        teachersTrained: 39500,
        totalMeetings: 580,
        schoolVisits: [
          { month: 'Jan', visits: 220 },
          { month: 'Feb', visits: 270 },
          { month: 'Mar', visits: 320 },
          { month: 'Apr', visits: 370 },
          { month: 'May', visits: 420 },
          { month: 'Jun', visits: 470 }
        ],
        lessonsData: {
          moreThan5: 1150,
          lessThan5: 700
        },
        topDistricts: [
          { code: 'KA01', name: 'Bangalore Urban', blocks: Math.min(12, 10), schools: 2000, students: 150000, teachers: 7500 },
          { code: 'KA02', name: 'Mysore', blocks: Math.min(25, 10), schools: 2300, students: 145000, teachers: 7250 },
          { code: 'KA03', name: 'Belgaum', blocks: Math.min(28, 10), schools: 2100, students: 135000, teachers: 6750 },
          { code: 'KA04', name: 'Gulbarga', blocks: Math.min(24, 10), schools: 1900, students: 125000, teachers: 6250 },
          { code: 'KA05', name: 'Dakshina Kannada', blocks: Math.min(20, 10), schools: 1800, students: 120000, teachers: 6000 },
          { code: 'KA06', name: 'Bellary', blocks: Math.min(22, 10), schools: 1700, students: 115000, teachers: 5750 },
          { code: 'KA07', name: 'Tumkur', blocks: Math.min(26, 10), schools: 1950, students: 130000, teachers: 6500 },
          { code: 'KA08', name: 'Dharwad', blocks: Math.min(18, 10), schools: 1600, students: 110000, teachers: 5500 },
          { code: 'KA09', name: 'Shimoga', blocks: Math.min(23, 10), schools: 1750, students: 117000, teachers: 5850 },
          { code: 'KA10', name: 'Hassan', blocks: Math.min(21, 10), schools: 1650, students: 112000, teachers: 5600 }
        ]
      },
      'tamil-nadu': {
        totalDistricts: 38,
        stvInstalled: 3500,
        teachersTrained: 45000,
        totalMeetings: 700,
        schoolVisits: [
          { month: 'Jan', visits: 280 },
          { month: 'Feb', visits: 330 },
          { month: 'Mar', visits: 380 },
          { month: 'Apr', visits: 430 },
          { month: 'May', visits: 480 },
          { month: 'Jun', visits: 530 }
        ],
        lessonsData: {
          moreThan5: 1400,
          lessThan5: 850
        },
        topDistricts: [
          { code: 'TN01', name: 'Chennai', blocks: Math.min(15, 10), schools: 2200, students: 160000, teachers: 8000 },
          { code: 'TN02', name: 'Coimbatore', blocks: Math.min(22, 10), schools: 2400, students: 170000, teachers: 8500 },
          { code: 'TN03', name: 'Madurai', blocks: Math.min(20, 10), schools: 2300, students: 165000, teachers: 8250 },
          { code: 'TN04', name: 'Tiruchirappalli', blocks: Math.min(24, 10), schools: 2100, students: 155000, teachers: 7750 },
          { code: 'TN05', name: 'Salem', blocks: Math.min(26, 10), schools: 2000, students: 150000, teachers: 7500 },
          { code: 'TN06', name: 'Tirunelveli', blocks: Math.min(23, 10), schools: 1900, students: 145000, teachers: 7250 },
          { code: 'TN07', name: 'Tiruppur', blocks: Math.min(18, 10), schools: 1800, students: 140000, teachers: 7000 },
          { code: 'TN08', name: 'Erode', blocks: Math.min(21, 10), schools: 1750, students: 135000, teachers: 6750 },
          { code: 'TN09', name: 'Vellore', blocks: Math.min(19, 10), schools: 1700, students: 130000, teachers: 6500 },
          { code: 'TN10', name: 'Thoothukudi', blocks: Math.min(20, 10), schools: 1650, students: 125000, teachers: 6250 }
        ]
      },
      'maharashtra': {
        totalDistricts: 36,
        stvInstalled: 3800,
        teachersTrained: 48000,
        totalMeetings: 750,
        schoolVisits: [
          { month: 'Jan', visits: 300 },
          { month: 'Feb', visits: 350 },
          { month: 'Mar', visits: 400 },
          { month: 'Apr', visits: 450 },
          { month: 'May', visits: 500 },
          { month: 'Jun', visits: 550 }
        ],
        lessonsData: {
          moreThan5: 1500,
          lessThan5: 900
        },
        topDistricts: [
          { code: 'MH01', name: 'Mumbai', blocks: Math.min(8, 10), schools: 2500, students: 180000, teachers: 9000 },
          { code: 'MH02', name: 'Pune', blocks: Math.min(24, 10), schools: 2800, students: 190000, teachers: 9500 },
          { code: 'MH03', name: 'Nagpur', blocks: Math.min(22, 10), schools: 2600, students: 185000, teachers: 9250 },
          { code: 'MH04', name: 'Nashik', blocks: Math.min(26, 10), schools: 2400, students: 175000, teachers: 8750 },
          { code: 'MH05', name: 'Thane', blocks: Math.min(20, 10), schools: 2300, students: 170000, teachers: 8500 },
          { code: 'MH06', name: 'Aurangabad', blocks: Math.min(25, 10), schools: 2200, students: 165000, teachers: 8250 },
          { code: 'MH07', name: 'Solapur', blocks: Math.min(23, 10), schools: 2100, students: 160000, teachers: 8000 },
          { code: 'MH08', name: 'Amravati', blocks: Math.min(21, 10), schools: 2000, students: 155000, teachers: 7750 },
          { code: 'MH09', name: 'Kolhapur', blocks: Math.min(19, 10), schools: 1900, students: 150000, teachers: 7500 },
          { code: 'MH10', name: 'Sangli', blocks: Math.min(18, 10), schools: 1800, students: 145000, teachers: 7250 }
        ]
      },
      'gujarat': {
        totalDistricts: 33,
        stvInstalled: 3100,
        teachersTrained: 41000,
        totalMeetings: 620,
        schoolVisits: [
          { month: 'Jan', visits: 240 },
          { month: 'Feb', visits: 290 },
          { month: 'Mar', visits: 340 },
          { month: 'Apr', visits: 390 },
          { month: 'May', visits: 440 },
          { month: 'Jun', visits: 490 }
        ],
        lessonsData: {
          moreThan5: 1200,
          lessThan5: 750
        },
        topDistricts: [
          { code: 'GJ01', name: 'Ahmedabad', blocks: 14, schools: 2300, students: 160000, teachers: 8000 },
          { code: 'GJ02', name: 'Surat', blocks: 16, schools: 2200, students: 155000, teachers: 7750 },
          { code: 'GJ03', name: 'Vadodara', blocks: 18, schools: 2100, students: 150000, teachers: 7500 },
          { code: 'GJ04', name: 'Rajkot', blocks: 20, schools: 2000, students: 145000, teachers: 7250 },
          { code: 'GJ05', name: 'Bhavnagar', blocks: 22, schools: 1900, students: 140000, teachers: 7000 },
          { code: 'GJ06', name: 'Jamnagar', blocks: 19, schools: 1800, students: 135000, teachers: 6750 },
          { code: 'GJ07', name: 'Junagadh', blocks: 21, schools: 1750, students: 130000, teachers: 6500 },
          { code: 'GJ08', name: 'Gandhinagar', blocks: 15, schools: 1700, students: 125000, teachers: 6250 },
          { code: 'GJ09', name: 'Kutch', blocks: 24, schools: 1650, students: 120000, teachers: 6000 },
          { code: 'GJ10', name: 'Anand', blocks: 17, schools: 1600, students: 115000, teachers: 5750 }
        ]
      },
      'kerala': {
        totalDistricts: 14,
        stvInstalled: 2200,
        teachersTrained: 32000,
        totalMeetings: 480,
        schoolVisits: [
          { month: 'Jan', visits: 180 },
          { month: 'Feb', visits: 220 },
          { month: 'Mar', visits: 260 },
          { month: 'Apr', visits: 300 },
          { month: 'May', visits: 340 },
          { month: 'Jun', visits: 380 }
        ],
        lessonsData: {
          moreThan5: 950,
          lessThan5: 600
        },
        topDistricts: [
          { code: 'KL01', name: 'Thiruvananthapuram', blocks: 12, schools: 1800, students: 140000, teachers: 7000 },
          { code: 'KL02', name: 'Ernakulam', blocks: 14, schools: 1900, students: 145000, teachers: 7250 },
          { code: 'KL03', name: 'Kozhikode', blocks: 13, schools: 1750, students: 135000, teachers: 6750 },
          { code: 'KL04', name: 'Thrissur', blocks: 15, schools: 1700, students: 130000, teachers: 6500 },
          { code: 'KL05', name: 'Kannur', blocks: 11, schools: 1650, students: 125000, teachers: 6250 },
          { code: 'KL06', name: 'Kollam', blocks: 10, schools: 1600, students: 120000, teachers: 6000 },
          { code: 'KL07', name: 'Alappuzha', blocks: 12, schools: 1550, students: 115000, teachers: 5750 },
          { code: 'KL08', name: 'Malappuram', blocks: 14, schools: 1500, students: 110000, teachers: 5500 },
          { code: 'KL09', name: 'Palakkad', blocks: 13, schools: 1450, students: 105000, teachers: 5250 },
          { code: 'KL10', name: 'Pathanamthitta', blocks: 9, schools: 1400, students: 100000, teachers: 5000 }
        ]
      },
      'odisha': {
        totalDistricts: 30,
        stvInstalled: 2700,
        teachersTrained: 36000,
        totalMeetings: 520,
        schoolVisits: [
          { month: 'Jan', visits: 200 },
          { month: 'Feb', visits: 240 },
          { month: 'Mar', visits: 280 },
          { month: 'Apr', visits: 320 },
          { month: 'May', visits: 360 },
          { month: 'Jun', visits: 400 }
        ],
        lessonsData: {
          moreThan5: 1050,
          lessThan5: 650
        },
        topDistricts: [
          { code: 'OD01', name: 'Khordha', blocks: 10, schools: 1900, students: 150000, teachers: 7500 },
          { code: 'OD02', name: 'Cuttack', blocks: 14, schools: 1800, students: 145000, teachers: 7250 },
          { code: 'OD03', name: 'Ganjam', blocks: 22, schools: 1700, students: 140000, teachers: 7000 },
          { code: 'OD04', name: 'Sundargarh', blocks: 17, schools: 1650, students: 135000, teachers: 6750 },
          { code: 'OD05', name: 'Puri', blocks: 11, schools: 1600, students: 130000, teachers: 6500 },
          { code: 'OD06', name: 'Balasore', blocks: 12, schools: 1550, students: 125000, teachers: 6250 },
          { code: 'OD07', name: 'Mayurbhanj', blocks: 26, schools: 1500, students: 120000, teachers: 6000 },
          { code: 'OD08', name: 'Bhadrak', blocks: 7, schools: 1450, students: 115000, teachers: 5750 },
          { code: 'OD09', name: 'Kalahandi', blocks: 13, schools: 1400, students: 110000, teachers: 5500 },
          { code: 'OD10', name: 'Koraput', blocks: 14, schools: 1350, students: 105000, teachers: 5250 }
        ]
      },
      'west-bengal': {
        totalDistricts: 23,
        stvInstalled: 2900,
        teachersTrained: 39000,
        totalMeetings: 580,
        schoolVisits: [
          { month: 'Jan', visits: 220 },
          { month: 'Feb', visits: 260 },
          { month: 'Mar', visits: 300 },
          { month: 'Apr', visits: 340 },
          { month: 'May', visits: 380 },
          { month: 'Jun', visits: 420 }
        ],
        lessonsData: {
          moreThan5: 1100,
          lessThan5: 700
        },
        topDistricts: [
          { code: 'WB01', name: 'Kolkata', blocks: 5, schools: 2000, students: 160000, teachers: 8000 },
          { code: 'WB02', name: 'North 24 Parganas', blocks: 22, schools: 1900, students: 155000, teachers: 7750 },
          { code: 'WB03', name: 'South 24 Parganas', blocks: 29, schools: 1800, students: 150000, teachers: 7500 },
          { code: 'WB04', name: 'Howrah', blocks: 14, schools: 1750, students: 145000, teachers: 7250 },
          { code: 'WB05', name: 'Hooghly', blocks: 18, schools: 1700, students: 140000, teachers: 7000 },
          { code: 'WB06', name: 'Nadia', blocks: 17, schools: 1650, students: 135000, teachers: 6750 },
          { code: 'WB07', name: 'Murshidabad', blocks: 26, schools: 1600, students: 130000, teachers: 6500 },
          { code: 'WB08', name: 'Bardhaman', blocks: 31, schools: 1550, students: 125000, teachers: 6250 },
          { code: 'WB09', name: 'Malda', blocks: 15, schools: 1500, students: 120000, teachers: 6000 },
          { code: 'WB10', name: 'Medinipur', blocks: 25, schools: 1450, students: 115000, teachers: 5750 }
        ]
      },
      'default': {
        totalDistricts: 20,
        stvInstalled: 1500,
        teachersTrained: 25000,
        totalMeetings: 350,
        schoolVisits: [
          { month: 'Jan', visits: 150 },
          { month: 'Feb', visits: 180 },
          { month: 'Mar', visits: 200 },
          { month: 'Apr', visits: 220 },
          { month: 'May', visits: 250 },
          { month: 'Jun', visits: 280 }
        ],
        lessonsData: {
          moreThan5: 800,
          lessThan5: 500
        },
        topDistricts: [
          { code: 'D001', name: 'Central District', blocks: 12, schools: 1800, students: 120000, teachers: 6000 },
          { code: 'D002', name: 'North District', blocks: 15, schools: 1600, students: 110000, teachers: 5500 },
          { code: 'D003', name: 'South District', blocks: 14, schools: 1500, students: 105000, teachers: 5250 },
          { code: 'D004', name: 'East District', blocks: 13, schools: 1400, students: 100000, teachers: 5000 },
          { code: 'D005', name: 'West District', blocks: 11, schools: 1300, students: 95000, teachers: 4750 },
          { code: 'D006', name: 'Northeast District', blocks: 10, schools: 1200, students: 90000, teachers: 4500 },
          { code: 'D007', name: 'Northwest District', blocks: 9, schools: 1100, students: 85000, teachers: 4250 },
          { code: 'D008', name: 'Southeast District', blocks: 8, schools: 1000, students: 80000, teachers: 4000 },
          { code: 'D009', name: 'Southwest District', blocks: 7, schools: 900, students: 75000, teachers: 3750 },
          { code: 'D010', name: 'Metropolitan District', blocks: 6, schools: 800, students: 70000, teachers: 3500 }
        ]
      }
    };

    // If "All States" is selected, aggregate data from all states
    if (state === 'all') {
      const allStatesData = Object.values(stateData).reduce((acc, curr) => ({
        totalDistricts: acc.totalDistricts + curr.totalDistricts,
        stvInstalled: acc.stvInstalled + curr.stvInstalled,
        teachersTrained: acc.teachersTrained + curr.teachersTrained,
        totalMeetings: acc.totalMeetings + curr.totalMeetings,
        schoolVisits: curr.schoolVisits.map((visit, index) => ({
          month: visit.month,
          visits: acc.schoolVisits[index].visits + visit.visits
        })),
        lessonsData: {
          moreThan5: acc.lessonsData.moreThan5 + curr.lessonsData.moreThan5,
          lessThan5: acc.lessonsData.lessThan5 + curr.lessonsData.lessThan5
        },
        topDistricts: [...acc.topDistricts, ...curr.topDistricts]
          .sort((a, b) => b.schools - a.schools)
          .slice(0, 10)
      }), {
        totalDistricts: 0,
        stvInstalled: 0,
        teachersTrained: 0,
        totalMeetings: 0,
        schoolVisits: Array(6).fill(0).map((_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          visits: 0
        })),
        lessonsData: {
          moreThan5: 0,
          lessThan5: 0
        },
        topDistricts: []
      });

      return allStatesData;
    }

    // For states not explicitly defined, use the default data but with state-specific district names
    if (!stateData[state as keyof typeof stateData]) {
      const stateName = STATES.find(s => s.value === state)?.label || 'State';
      return {
        ...stateData.default,
        topDistricts: stateData.default.topDistricts.map((district, index) => ({
          ...district,
          name: `${stateName} District ${index + 1}`,
          code: `${state.toUpperCase().substring(0, 2)}${String(index + 1).padStart(2, '0')}`
        }))
      };
    }

    return stateData[state as keyof typeof stateData] || stateData.default;
  };

  const stateDistrictData = getStateDistrictData(state);

  // Calculate data for teacher training
  const teacherTrainingData = {
    trained: stateDistrictData.teachersTrained,
    target: Math.floor(stateDistrictData.teachersTrained * 1.2), // 20% more than current
    feedback: {
      positive: Math.floor((stateDistrictData.teachersTrained * 0.85)),
      neutral: Math.floor((stateDistrictData.teachersTrained * 0.10)),
      negative: Math.floor((stateDistrictData.teachersTrained * 0.05))
    },
    acceptanceRate: 92,
    trend: stateDistrictData.schoolVisits.map((visit, index) => ({
      month: visit.month,
      rate: Math.min(
        Math.floor(
          (stateDistrictData.teachersTrained / Math.floor(stateDistrictData.teachersTrained * 1.2)) * 
          100 * 
          ((index + 1) / 6) * 
          (index === 5 ? 1.2 : index === 6 ? 1.3 : index === 11 ? 1.15 : 1.0) * 
          (0.95 + Math.random() * 0.1)
        ),
        100
      )
    }))
  };

  // Calculate data for classroom impact
  const classroomImpactData = {
    registeredUsers: stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0),
    resourcesUsed: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.7),
    subjectDistribution: [
      { name: 'English', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.35) },
      { name: 'Mathematics', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.30) },
      { name: 'Science', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.25) },
      { name: 'Other', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.10) }
    ],
    classDistribution: [
      { name: 'FLN', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.40) },
      { name: 'Class 6-8', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.35) },
      { name: 'Others', value: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 0.25) }
    ],
    trend: stateDistrictData.schoolVisits.map((visit, index) => {
      const totalStudents = stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0);
      const seasonalFactor = 
        index === 5 ? 0.8 : // June (summer break)
        index === 6 ? 0.7 : // July (summer break)
        index === 11 ? 0.9 : // December (winter break)
        1.0;
      
      const randomVariation = 0.9 + Math.random() * 0.2;
      
      const monthlyActiveUsers = Math.floor(
        totalStudents * 
        seasonalFactor * 
        randomVariation * 
        (0.6 + (index / 12) * 0.4)
      );
      
      return {
        month: visit.month,
        activeUsers: monthlyActiveUsers,
        resourceUsage: Math.floor(monthlyActiveUsers * 0.7)
      };
    })
  };

  // Calculate data for asset info
  const assetInfoData = {
    kits: {
      distributed: stateDistrictData.stvInstalled * 2, // Assuming 2 kits per STV
      target: Math.floor(stateDistrictData.stvInstalled * 2 * 1.2),
      progress: Math.floor((stateDistrictData.stvInstalled * 2 / Math.floor(stateDistrictData.stvInstalled * 2 * 1.2)) * 100)
    },
    samparkTV: {
      distributed: stateDistrictData.stvInstalled,
      target: Math.floor(stateDistrictData.stvInstalled * 1.2),
      progress: Math.floor((stateDistrictData.stvInstalled / Math.floor(stateDistrictData.stvInstalled * 1.2)) * 100)
    },
    sparks: {
      distributed: stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 2,
      target: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 2.2),
      progress: Math.floor(
        (stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 2 / 
        Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 2.2)) * 100
      )
    }
  };

  // Calculate data for program monitoring
  const programMonitoringData = {
    schoolAudits: stateDistrictData.topDistricts.reduce((sum, district) => sum + district.schools, 0) * 0.8,
    stateMeetings: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.schools, 0) / 100),
    monitoringEvents: [
      { date: '2023-01-15', event: 'Initial Assessment', status: 'completed' },
      { date: '2023-03-20', event: 'Mid-term Review', status: 'completed' },
      { date: '2023-06-10', event: 'Progress Evaluation', status: 'completed' },
      { date: '2023-09-05', event: 'Quality Check', status: 'pending' },
      { date: '2023-12-15', event: 'Final Review', status: 'upcoming' }
    ]
  };

  // Calculate asset distribution trend based on state data
  const assetDistributionTrend = stateDistrictData.schoolVisits.map((visit, index) => {
    const progress = (index + 1) / 6;
    return {
      month: visit.month,
      kits: Math.floor(stateDistrictData.stvInstalled * 2 * progress),
      samparkTV: Math.floor(stateDistrictData.stvInstalled * progress),
      sparks: Math.floor(stateDistrictData.topDistricts.reduce((sum, district) => sum + district.students, 0) * 2 * progress)
    };
  });

  // Add function to generate block data for a district
  const generateBlockData = (district: any): DistrictDetails => {
    // Limit to 10 blocks
    const numBlocks = Math.min(district.blocks, 10);
    
    // Calculate total schools, students, and teachers for the district
    const totalDistrictSchools = district.schools;
    const totalDistrictStudents = district.students;
    const totalDistrictTeachers = district.teachers;
    
    // Calculate average schools per block
    const avgSchoolsPerBlock = Math.floor(totalDistrictSchools / numBlocks);
    
    const blocks: BlockData[] = Array.from({ length: numBlocks }, (_, i) => {
      // Calculate block-specific numbers with some variation
      const blockSchools = Math.floor(avgSchoolsPerBlock * (0.8 + Math.random() * 0.4));
      const blockStudents = Math.floor((totalDistrictStudents / totalDistrictSchools) * blockSchools);
      const blockTeachers = Math.floor((totalDistrictTeachers / totalDistrictSchools) * blockSchools);
      
      return {
      code: `${district.code}B${String(i + 1).padStart(2, '0')}`,
      name: `Block ${i + 1}`,
        schools: blockSchools,
        students: blockStudents,
        teachers: blockTeachers,
      smtvInstalled: Math.floor(stateDistrictData.stvInstalled / stateDistrictData.totalDistricts * (0.8 + Math.random() * 0.4)),
      teachersTrained: Math.floor(stateDistrictData.teachersTrained / stateDistrictData.totalDistricts * (0.8 + Math.random() * 0.4)),
      totalMeetings: Math.floor(stateDistrictData.totalMeetings / stateDistrictData.totalDistricts * (0.8 + Math.random() * 0.4)),
        schoolVisits: Math.floor(stateDistrictData.schoolVisits.reduce((sum: number, visit: any) => sum + visit.visits, 0) / stateDistrictData.totalDistricts * (0.8 + Math.random() * 0.4)),
      schoolsWithMoreThan5Lessons: Math.floor(stateDistrictData.lessonsData.moreThan5 / stateDistrictData.totalDistricts * (0.8 + Math.random() * 0.4))
      };
    });

    return {
      name: district.name,
      code: district.code,
      blocks,
      totalStats: {
        smtvInstalled: blocks.reduce((sum: number, block: BlockData) => sum + block.smtvInstalled, 0),
        teachersTrained: blocks.reduce((sum: number, block: BlockData) => sum + block.teachersTrained, 0),
        totalMeetings: blocks.reduce((sum: number, block: BlockData) => sum + block.totalMeetings, 0),
        schoolVisits: blocks.reduce((sum: number, block: BlockData) => sum + block.schoolVisits, 0),
        schoolsWithMoreThan5Lessons: blocks.reduce((sum: number, block: BlockData) => sum + block.schoolsWithMoreThan5Lessons, 0),
        totalBlocks: numBlocks
      }
    };
  };

  // Add function to generate school data for a block
  const generateSchoolData = (block: BlockData): BlockDetails => {
    // Calculate total schools for the block
    const numSchools = block.schools;
    
    // Calculate average students and teachers per school
    const avgStudentsPerSchool = Math.floor(block.students / numSchools);
    const avgTeachersPerSchool = Math.floor(block.teachers / numSchools);
    
    const schools: SchoolData[] = Array.from({ length: numSchools }, (_, i) => {
      // Calculate school-specific numbers with some variation
      const schoolStudents = Math.floor(avgStudentsPerSchool * (0.8 + Math.random() * 0.4));
      const schoolTeachers = Math.floor(avgTeachersPerSchool * (0.8 + Math.random() * 0.4));
      
      return {
        code: `${block.code}S${String(i + 1).padStart(3, '0')}`,
        name: `School ${i + 1}`,
        students: schoolStudents,
        teachers: schoolTeachers,
        smtvInstalled: Math.random() > 0.3, // 70% chance of having SMTV installed
        teachersTrained: Math.floor(schoolTeachers * (0.7 + Math.random() * 0.3)), // 70-100% of teachers trained
        totalMeetings: Math.floor(block.totalMeetings / numSchools * (0.8 + Math.random() * 0.4)),
        schoolVisits: Math.floor(block.schoolVisits / numSchools * (0.8 + Math.random() * 0.4)),
        lessonsCompleted: Math.floor(Math.random() * 10)
      };
    });

    return {
      name: block.name,
      code: block.code,
      schools,
      totalStats: {
        totalSchools: numSchools,
        smtvInstalled: schools.filter(s => s.smtvInstalled).length,
        teachersTrained: schools.reduce((sum: number, school: SchoolData) => sum + school.teachersTrained, 0),
        totalMeetings: schools.reduce((sum: number, school: SchoolData) => sum + school.totalMeetings, 0),
        schoolVisits: schools.reduce((sum: number, school: SchoolData) => sum + school.schoolVisits, 0),
        schoolsWithMoreThan5Lessons: schools.filter(s => s.lessonsCompleted > 5).length
      }
    };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-2xl border-2 border-orange-200/60 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Program Overview
          </h1>
          <p className="text-orange-600/80 text-lg">
            Comprehensive insights into program performance and metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={partner} onValueChange={setPartner}>
            <SelectTrigger className="w-[180px] border-orange-500/30 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-orange-50/80 hover:border-orange-500/50 transition-colors">
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
            <SelectTrigger className="w-[180px] border-orange-500/30 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-orange-50/80 hover:border-orange-500/50 transition-colors">
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
            <SelectTrigger className="w-[180px] border-orange-500/30 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-orange-50/80 hover:border-orange-500/50 transition-colors">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Program Investment Card */}
        <Dialog open={openDialog === 'investment'} onOpenChange={(open) => setOpenDialog(open ? 'investment' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/80 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-800">Program Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">
                      ${filteredData.budget.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">Total Budget</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-orange-100" />
                  </div>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={budgetData}>
                        <Line type="monotone" dataKey="spent" stroke="#f97316" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
            <DialogHeader className="border-b border-orange-500/20 pb-4">
              <DialogTitle className="text-xl font-bold text-orange-900">Program Investment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">${filteredData.budget.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Budget Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilized</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2 bg-orange-100 group-hover:bg-orange-200 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Budget Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="spent" 
                          stroke="#f97316" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#f97316' }}
                          activeDot={{ r: 6, fill: '#f97316' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Teacher Training Card */}
        <Dialog open={openDialog === 'training'} onOpenChange={(open) => setOpenDialog(open ? 'training' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/80 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-800">Teacher Training</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">
                      {teacherTrainingData.trained.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">Teachers Trained</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>{Math.floor((teacherTrainingData.trained / teacherTrainingData.target) * 100)}%</span>
                    </div>
                    <Progress value={(teacherTrainingData.trained / teacherTrainingData.target) * 100} className="h-2 bg-orange-100" />
                  </div>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={teacherTrainingData.trend}>
                        <Line type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
            <DialogHeader className="border-b border-orange-500/20 pb-4">
              <DialogTitle className="text-xl font-bold text-orange-900">Teacher Training Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Teachers Trained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{teacherTrainingData.trained.toLocaleString()}</p>
                    <p className="text-sm text-orange-500">of {teacherTrainingData.target.toLocaleString()} target</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Acceptance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{teacherTrainingData.acceptanceRate}%</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Training Progress Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={teacherTrainingData.trend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#f97316" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#f97316' }}
                          activeDot={{ r: 6, fill: '#f97316' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Feedback Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-50/50 border border-green-200 hover:bg-green-100/50 transition-colors duration-200">
                      <p className="text-2xl font-bold text-green-600">{teacherTrainingData.feedback.positive}%</p>
                      <p className="text-sm text-green-600">Positive</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-50/50 border border-yellow-200 hover:bg-yellow-100/50 transition-colors duration-200">
                      <p className="text-2xl font-bold text-yellow-600">{teacherTrainingData.feedback.neutral}%</p>
                      <p className="text-sm text-yellow-600">Neutral</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-50/50 border border-red-200 hover:bg-red-100/50 transition-colors duration-200">
                      <p className="text-2xl font-bold text-red-600">{teacherTrainingData.feedback.negative}%</p>
                      <p className="text-sm text-red-600">Negative</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Classroom Impact Card */}
        <Dialog open={openDialog === 'impact'} onOpenChange={(open) => setOpenDialog(open ? 'impact' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/80 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-800">Classroom Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">
                      {classroomImpactData.registeredUsers.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">Cumulative till date</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Resources Used</span>
                      <span>{classroomImpactData.resourcesUsed.toLocaleString()}</span>
                    </div>
                    <Progress value={(classroomImpactData.resourcesUsed / classroomImpactData.registeredUsers) * 100} className="h-2 bg-orange-100" />
                  </div>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={classroomImpactData.trend}>
                        <Line type="monotone" dataKey="activeUsers" stroke="#f97316" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
            <DialogHeader className="border-b border-orange-500/20 pb-4">
              <DialogTitle className="text-xl font-bold text-orange-900">Classroom Impact Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Registered Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{classroomImpactData.registeredUsers.toLocaleString()}</p>
                    <p className="text-sm text-orange-500">Cumulative till date</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Resources Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{classroomImpactData.resourcesUsed.toLocaleString()}</p>
                    <p className="text-sm text-orange-500">Cumulative till date</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Usage Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={classroomImpactData.trend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)'
                          }}
                          formatter={(value, name) => [
                            value.toLocaleString(),
                            name === 'activeUsers' ? 'Active Users' : 'Resource Usage'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="activeUsers" 
                          stroke="#f97316" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#f97316' }}
                          activeDot={{ r: 6, fill: '#f97316' }}
                          name="Active Users"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="resourceUsage" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#3b82f6' }}
                          activeDot={{ r: 6, fill: '#3b82f6' }}
                          name="Resource Usage"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Subject Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] pie-chart-container relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={classroomImpactData.subjectDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                            style={{ outline: 'none' }}
                            className="focus:outline-none"
                            animationBegin={0}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                          >
                            {classroomImpactData.subjectDistribution.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={[
                                  '#c2410c', // Orange 800
                                  '#ea580c', // Orange 600
                                  '#fb923c', // Orange 400
                                  '#fdba74'  // Orange 300
                                ][index % 4]} 
                                style={{ 
                                  outline: 'none',
                                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                                }}
                                className="focus:outline-none hover:opacity-80 transition-opacity duration-200"
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              padding: '12px',
                              backdropFilter: 'blur(8px)'
                            }}
                            formatter={(value) => [value.toLocaleString(), 'Users']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-24 rounded-full bg-orange-50/50 border-2 border-orange-200 flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">Total</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Class Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] pie-chart-container relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={classroomImpactData.classDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                            style={{ outline: 'none' }}
                            className="focus:outline-none"
                            animationBegin={0}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                          >
                            {classroomImpactData.classDistribution.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={[
                                  '#7c2d12', // Orange 900
                                  '#c2410c', // Orange 800
                                  '#ea580c'  // Orange 600
                                ][index % 3]} 
                                style={{ 
                                  outline: 'none',
                                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                                }}
                                className="focus:outline-none hover:opacity-80 transition-opacity duration-200"
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              padding: '12px',
                              backdropFilter: 'blur(8px)'
                            }}
                            formatter={(value) => [value.toLocaleString(), 'Users']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-24 rounded-full bg-orange-50/50 border-2 border-orange-200 flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">Total</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Asset Info Card */}
        <Dialog open={openDialog === 'assets'} onOpenChange={(open) => setOpenDialog(open ? 'assets' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/80 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-800">Asset Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kits Distributed</span>
                      <span className="text-sm font-medium">{assetInfoData.kits.distributed.toLocaleString()}/{assetInfoData.kits.target.toLocaleString()}</span>
                    </div>
                    <Progress value={assetInfoData.kits.progress} className="h-2 bg-orange-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sampark TV</span>
                      <span className="text-sm font-medium">{assetInfoData.samparkTV.distributed.toLocaleString()}/{assetInfoData.samparkTV.target.toLocaleString()}</span>
                    </div>
                    <Progress value={assetInfoData.samparkTV.progress} className="h-2 bg-orange-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sparks</span>
                      <span className="text-sm font-medium">{assetInfoData.sparks.distributed.toLocaleString()}/{assetInfoData.sparks.target.toLocaleString()}</span>
                    </div>
                    <Progress value={assetInfoData.sparks.progress} className="h-2 bg-orange-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
            <DialogHeader className="border-b border-orange-500/20 pb-4">
              <DialogTitle className="text-xl font-bold text-orange-900">Asset Distribution Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Kits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Distributed</span>
                        <span className="font-medium">{assetInfoData.kits.distributed.toLocaleString()}</span>
                      </div>
                      <Progress value={assetInfoData.kits.progress} className="h-2 bg-orange-100 group-hover:bg-orange-200 transition-colors" />
                      <p className="text-sm text-orange-500">Target: {assetInfoData.kits.target.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Sampark TV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Distributed</span>
                        <span className="font-medium">{assetInfoData.samparkTV.distributed.toLocaleString()}</span>
                      </div>
                      <Progress value={assetInfoData.samparkTV.progress} className="h-2 bg-orange-100 group-hover:bg-orange-200 transition-colors" />
                      <p className="text-sm text-orange-500">Target: {assetInfoData.samparkTV.target.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Sparks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Distributed</span>
                        <span className="font-medium">{assetInfoData.sparks.distributed.toLocaleString()}</span>
                      </div>
                      <Progress value={assetInfoData.sparks.progress} className="h-2 bg-orange-100 group-hover:bg-orange-200 transition-colors" />
                      <p className="text-sm text-orange-500">Target: {assetInfoData.sparks.target.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Distribution Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={assetDistributionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="kits" 
                          stroke="#f97316" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#f97316' }}
                          activeDot={{ r: 6, fill: '#f97316' }}
                          name="Kits"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="samparkTV" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#3b82f6' }}
                          activeDot={{ r: 6, fill: '#3b82f6' }}
                          name="Sampark TV"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sparks" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: '#10b981' }}
                          activeDot={{ r: 6, fill: '#10b981' }}
                          name="Sparks"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Distribution Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { 
                            name: 'Kits', 
                            distributed: assetInfoData.kits.distributed,
                            target: assetInfoData.kits.target,
                            progress: assetInfoData.kits.progress
                          },
                          { 
                            name: 'Sampark TV', 
                            distributed: assetInfoData.samparkTV.distributed,
                            target: assetInfoData.samparkTV.target,
                            progress: assetInfoData.samparkTV.progress
                          },
                          { 
                            name: 'Sparks', 
                            distributed: assetInfoData.sparks.distributed,
                            target: assetInfoData.sparks.target,
                            progress: assetInfoData.sparks.progress
                          }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)'
                          }}
                          formatter={(value, name) => [
                            value.toLocaleString(),
                            name === 'distributed' ? 'Distributed' : 
                            name === 'target' ? 'Target' : 'Progress'
                          ]}
                        />
                        <Legend />
                        <Bar 
                          dataKey="distributed" 
                          fill="#f97316" 
                          name="Distributed"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="target" 
                          fill="#3b82f6" 
                          name="Target"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {[
                      { name: 'Kits', progress: assetInfoData.kits.progress },
                      { name: 'Sampark TV', progress: assetInfoData.samparkTV.progress },
                      { name: 'Sparks', progress: assetInfoData.sparks.progress }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2 group">
                        <div className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2 bg-orange-100 group-hover:bg-orange-200 transition-colors" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Program Monitoring Card */}
        <Dialog open={openDialog === 'monitoring'} onOpenChange={(open) => setOpenDialog(open ? 'monitoring' : null)}>
          <DialogTrigger asChild>
            <Card className="bg-white/80 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-800">Program Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">School Audits</p>
                      <p className="text-lg font-semibold">{programMonitoringData.schoolAudits.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">State Meetings</p>
                      <p className="text-lg font-semibold">{programMonitoringData.stateMeetings}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Events</p>
                    <div className="space-y-2">
                      {programMonitoringData.monitoringEvents.slice(0, 3).map((event, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {event.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : event.status === 'pending' ? (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">{event.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
            <DialogHeader className="border-b border-orange-500/20 pb-4">
              <DialogTitle className="text-xl font-bold text-orange-900">Program Monitoring Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">School Audits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{programMonitoringData.schoolAudits.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">State Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{programMonitoringData.stateMeetings}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Monitoring Events Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programMonitoringData.monitoringEvents.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-orange-50/50 transition-colors duration-200 group">
                        <div className="flex-shrink-0">
                          {event.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors" />
                          ) : event.status === 'pending' ? (
                            <AlertCircle className="h-5 w-5 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-orange-800 group-hover:text-orange-900 transition-colors">{event.event}</p>
                            <span className="text-sm text-orange-500 group-hover:text-orange-600 transition-colors">{event.date}</span>
                          </div>
                          <p className="text-sm text-orange-500 mt-1 group-hover:text-orange-600 transition-colors">
                            {event.status === 'completed' ? 'Completed' : 
                             event.status === 'pending' ? 'In Progress' : 'Upcoming'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* District Statistics Card */}
        <Dialog open={openDialog === 'districts'} onOpenChange={(open) => setOpenDialog(open ? 'districts' : null)}>
          <Card className="bg-white/80 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 relative group overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative">
              <CardTitle className="text-gray-800 group-hover:text-orange-800 transition-colors duration-300">District Statistics</CardTitle>
            </CardHeader>
            
            <CardContent className="relative">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-gray-500 group-hover:text-orange-500 transition-colors duration-300">Total Districts</p>
                    <p className="text-lg font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{stateDistrictData.totalDistricts}</p>
                  </div>
                  <div className="space-y-1 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-gray-500 group-hover:text-orange-500 transition-colors duration-300">STV Installed</p>
                    <p className="text-lg font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{stateDistrictData.stvInstalled.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2 group-hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 group-hover:text-orange-500 transition-colors duration-300">Teachers Trained</span>
                    <span className="text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{stateDistrictData.teachersTrained.toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2 bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300" />
                </div>
                
                <div className="h-[100px] group-hover:scale-105 transition-transform duration-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stateDistrictData.schoolVisits}>
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#f97316" 
                        strokeWidth={2} 
                        dot={false}
                        className="group-hover:stroke-orange-600 transition-colors duration-300"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Enhanced Know More button */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white/90 backdrop-blur-sm border-orange-500/30 hover:bg-orange-50 hover:border-orange-500/50 text-orange-600 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow-md group/btn"
                  >
                    <span className="relative">
                      Know More
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover/btn:w-full transition-all duration-300" />
                    </span>
                  </Button>
                </DialogTrigger>
              </div>
            </CardContent>
          </Card>

          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
            <DialogHeader className="border-b border-orange-500/20 pb-4">
              <DialogTitle className="text-xl font-bold text-orange-900">District-wise Statistics</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">STV Installed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{stateDistrictData.stvInstalled.toLocaleString()}</p>
                    <p className="text-sm text-orange-500">Across all districts</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Teachers Trained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{stateDistrictData.teachersTrained.toLocaleString()}</p>
                    <p className="text-sm text-orange-500">Across all districts</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{stateDistrictData.totalMeetings.toLocaleString()}</p>
                    <p className="text-sm text-orange-500">Across all districts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">School Visits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stateDistrictData.schoolVisits}
                          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                          <Bar 
                            dataKey="visits" 
                            fill="#f97316" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Schools with {'>'}5 Lessons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center">
                      <div className="w-full h-full [&>div]:!outline-none [&>div]:!border-none [&>div>svg]:!outline-none [&>div>svg]:!border-none [&>div>svg>g]:!outline-none [&>div>svg>g]:!border-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                              data={[
                                { name: '>5 Lessons', value: stateDistrictData.lessonsData.moreThan5 },
                                { name: '≤5 Lessons', value: stateDistrictData.lessonsData.lessThan5 }
                              ]}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              <Cell fill="#f97316" />
                              <Cell fill="#fdba74" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid rgba(249, 115, 22, 0.2)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(8px)'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Districts Table */}
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Top 10 Districts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-orange-50/50">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Rank</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">District</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Blocks</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Schools</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Students</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Teachers</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Progress</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-500/10">
                          {stateDistrictData.topDistricts.map((district, index) => {
                            const progress = Math.min(100, Math.floor((district.schools / stateDistrictData.topDistricts[0].schools) * 100));
                            return (
                              <tr 
                                key={index} 
                                className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                                onClick={() => setSelectedDistrict(generateBlockData(district))}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                      index < 3 
                                        ? 'bg-orange-100 text-orange-600' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {index + 1}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                      {district.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{district.code}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-gray-700">{district.blocks}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-gray-700">{district.schools.toLocaleString()}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-gray-700">{district.students.toLocaleString()}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-gray-700">{district.teachers.toLocaleString()}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-orange-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500">{progress}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* District Details Dialog */}
      <Dialog open={!!selectedDistrict} onOpenChange={(open) => !open && setSelectedDistrict(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
          <DialogHeader className="border-b border-orange-500/20 pb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedDistrict(null)}
                className="p-2 rounded-full hover:bg-orange-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-orange-600" />
              </button>
              <DialogTitle className="text-xl font-bold text-orange-900">
                {selectedDistrict?.name} District Details
              </DialogTitle>
            </div>
          </DialogHeader>
          
          {selectedDistrict && (
            <div className="space-y-6 p-4">
              {/* District Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">SMTV Installed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedDistrict.totalStats.smtvInstalled.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all blocks</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Teachers Trained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedDistrict.totalStats.teachersTrained.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all blocks</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedDistrict.totalStats.totalMeetings.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all blocks</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">School Visits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedDistrict.totalStats.schoolVisits.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all blocks</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Schools with {'>'}5 Lessons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedDistrict.totalStats.schoolsWithMoreThan5Lessons.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all blocks</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Blocks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedDistrict.totalStats.totalBlocks.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">In this district</p>
                  </CardContent>
                </Card>
              </div>

              {/* Block-wise Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">SMTV Installation Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={selectedDistrict.blocks
                            .sort((a, b) => b.schools - a.schools)
                            .map(block => ({
                              name: block.name,
                              smtv: block.smtvInstalled
                            }))}
                          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                          <Bar 
                            dataKey="smtv" 
                            fill="#f97316" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Teachers Training Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={selectedDistrict.blocks
                            .sort((a, b) => b.teachersTrained - a.teachersTrained)
                            .map(block => ({
                              name: block.name,
                              teachers: block.teachersTrained
                            }))}
                          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                          <Bar 
                            dataKey="teachers" 
                            fill="#f97316" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Block-wise Statistics Table */}
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Top 10 Blocks in {selectedDistrict.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-orange-50/50">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Rank</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Block</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Schools</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Students</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Teachers</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">SMTV</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-orange-800">Progress</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-500/10">
                          {selectedDistrict.blocks
                            .sort((a, b) => b.schools - a.schools)
                            .slice(0, 10)
                            .map((block, index) => {
                              const progress = Math.min(100, Math.floor((block.schools / selectedDistrict.blocks[0].schools) * 100));
                              return (
                                <tr 
                                  key={index} 
                                  className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                                  onClick={() => setSelectedBlock(generateSchoolData(block))}
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                        index < 3 
                                          ? 'bg-orange-100 text-orange-600' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {index + 1}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {block.name}
                                      </span>
                                      <span className="text-xs text-gray-500">{block.code}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-gray-700">{block.schools.toLocaleString()}</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-gray-700">{block.students.toLocaleString()}</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-gray-700">{block.teachers.toLocaleString()}</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-gray-700">{block.smtvInstalled.toLocaleString()}</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 h-2 bg-orange-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-gray-500">{progress}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Details Dialog */}
      <Dialog open={!!selectedBlock} onOpenChange={(open) => !open && setSelectedBlock(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 border-orange-500/30 shadow-xl backdrop-blur-sm">
          <DialogHeader className="border-b border-orange-500/20 pb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedBlock(null)}
                className="p-2 rounded-full hover:bg-orange-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-orange-600" />
              </button>
              <DialogTitle className="text-xl font-bold text-orange-900">
                {selectedBlock?.name} Block Details
              </DialogTitle>
            </div>
          </DialogHeader>
          
          {selectedBlock && (
            <div className="space-y-6 p-4">
              {/* Block Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">SMTV Installed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedBlock.totalStats.smtvInstalled.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Out of {selectedBlock.totalStats.totalSchools} schools</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Teachers Trained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedBlock.totalStats.teachersTrained.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all schools</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedBlock.totalStats.totalMeetings.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all schools</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">School Visits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedBlock.totalStats.schoolVisits.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Across all schools</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Schools with {'>'}5 Lessons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedBlock.totalStats.schoolsWithMoreThan5Lessons.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">Out of {selectedBlock.totalStats.totalSchools} schools</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Total Schools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      {selectedBlock.totalStats.totalSchools.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-500">In this block</p>
                  </CardContent>
                </Card>
              </div>

              {/* School Statistics Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">SMTV Installation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Installed', value: selectedBlock.totalStats.smtvInstalled },
                              { name: 'Not Installed', value: selectedBlock.totalStats.totalSchools - selectedBlock.totalStats.smtvInstalled }
                            ]}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            <Cell fill="#f97316" />
                            <Cell fill="#fdba74" />
                          </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)'
                          }}
                        />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-orange-800">Lessons Completion Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: '>5 Lessons', value: selectedBlock.totalStats.schoolsWithMoreThan5Lessons },
                              { name: '≤5 Lessons', value: selectedBlock.totalStats.totalSchools - selectedBlock.totalStats.schoolsWithMoreThan5Lessons }
                            ]}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            <Cell fill="#f97316" />
                            <Cell fill="#fdba74" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top 10 Schools Table */}
              <Card className="bg-white/90 backdrop-blur-sm border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-orange-800">Top 10 Schools in {selectedBlock.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-orange-500/20">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-orange-50/50">
                          <th className="text-left py-4 px-6 text-sm font-semibold text-orange-800">Rank</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-orange-800">School</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-orange-800">Students</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-orange-800">Teachers</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-orange-800">SMTV</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-orange-800">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-500/10">
                        {selectedBlock.schools
                          .sort((a, b) => b.students - a.students)
                          .slice(0, 10)
                          .map((school, index) => {
                            // Calculate progress based on both student count and SMTV status
                            const studentProgress = Math.min(100, Math.floor((school.students / selectedBlock.schools[0].students) * 100));
                            const progress = school.smtvInstalled ? studentProgress : Math.floor(studentProgress * 0.5); // Reduce progress by 50% if SMTV not installed
                            return (
                              <tr 
                                key={index} 
                                className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                      index < 3 
                                        ? 'bg-orange-100 text-orange-600' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {index + 1}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                      {school.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{school.code}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-sm text-gray-700">{school.students.toLocaleString()}</span>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-sm text-gray-700">{school.teachers.toLocaleString()}</span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      school.smtvInstalled 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-red-100 text-red-600'
                                    }`}>
                                      {school.smtvInstalled ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <AlertCircle className="w-4 h-4" />
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-orange-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500">{progress}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 