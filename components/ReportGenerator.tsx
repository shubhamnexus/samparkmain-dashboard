"use client";

import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import * as XLSX from 'xlsx';

// Block data interface
interface BlockData {
  code: string;
  name: string;
  schools: number;
  students: number;
  teachers: number;
}

// District data interface
interface District {
  code: string;
  name: string;
}

// Realistic districts for each state (sample, you can expand as needed)
const stateData: Record<string, { name: string; districts: District[] }> = {
  'andhra-pradesh': {
    name: 'Andhra Pradesh',
    districts: [
      { code: 'AP01', name: 'Anantapur' },
      { code: 'AP02', name: 'Chittoor' },
      { code: 'AP03', name: 'East Godavari' },
      { code: 'AP04', name: 'Guntur' },
      { code: 'AP05', name: 'Krishna' },
      { code: 'AP06', name: 'Kurnool' },
      { code: 'AP07', name: 'Nellore' },
      { code: 'AP08', name: 'Prakasam' },
      { code: 'AP09', name: 'Srikakulam' },
      { code: 'AP10', name: 'Visakhapatnam' },
    ]
  },
  'delhi': {
    name: 'Delhi',
    districts: [
      { code: 'DL01', name: 'Central Delhi' },
      { code: 'DL02', name: 'East Delhi' },
      { code: 'DL03', name: 'New Delhi' },
      { code: 'DL04', name: 'North Delhi' },
      { code: 'DL05', name: 'North East Delhi' },
      { code: 'DL06', name: 'North West Delhi' },
      { code: 'DL07', name: 'Shahdara' },
      { code: 'DL08', name: 'South Delhi' },
      { code: 'DL09', name: 'South East Delhi' },
      { code: 'DL10', name: 'South West Delhi' },
      { code: 'DL11', name: 'West Delhi' },
    ]
  },
  'maharashtra': {
    name: 'Maharashtra',
    districts: [
      { code: 'MH01', name: 'Mumbai' },
      { code: 'MH02', name: 'Pune' },
      { code: 'MH03', name: 'Nagpur' },
      { code: 'MH04', name: 'Nashik' },
      { code: 'MH05', name: 'Thane' },
      { code: 'MH06', name: 'Aurangabad' },
      { code: 'MH07', name: 'Solapur' },
      { code: 'MH08', name: 'Amravati' },
      { code: 'MH09', name: 'Kolhapur' },
      { code: 'MH10', name: 'Sangli' },
    ]
  },
  'karnataka': {
    name: 'Karnataka',
    districts: [
      { code: 'KA01', name: 'Bangalore Urban' },
      { code: 'KA02', name: 'Mysore' },
      { code: 'KA03', name: 'Belgaum' },
      { code: 'KA04', name: 'Gulbarga' },
      { code: 'KA05', name: 'Dakshina Kannada' },
      { code: 'KA06', name: 'Bellary' },
      { code: 'KA07', name: 'Tumkur' },
      { code: 'KA08', name: 'Dharwad' },
      { code: 'KA09', name: 'Shimoga' },
      { code: 'KA10', name: 'Hassan' },
    ]
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    districts: [
      { code: 'TN01', name: 'Chennai' },
      { code: 'TN02', name: 'Coimbatore' },
      { code: 'TN03', name: 'Madurai' },
      { code: 'TN04', name: 'Tiruchirappalli' },
      { code: 'TN05', name: 'Salem' },
      { code: 'TN06', name: 'Tirunelveli' },
      { code: 'TN07', name: 'Tiruppur' },
      { code: 'TN08', name: 'Erode' },
      { code: 'TN09', name: 'Vellore' },
      { code: 'TN10', name: 'Thoothukudi' },
    ]
  },
  'kerala': {
    name: 'Kerala',
    districts: [
      { code: 'KL01', name: 'Thiruvananthapuram' },
      { code: 'KL02', name: 'Ernakulam' },
      { code: 'KL03', name: 'Kozhikode' },
      { code: 'KL04', name: 'Thrissur' },
      { code: 'KL05', name: 'Kannur' },
      { code: 'KL06', name: 'Kollam' },
      { code: 'KL07', name: 'Alappuzha' },
      { code: 'KL08', name: 'Malappuram' },
      { code: 'KL09', name: 'Palakkad' },
      { code: 'KL10', name: 'Pathanamthitta' },
    ]
  },
  'gujarat': {
    name: 'Gujarat',
    districts: [
      { code: 'GJ01', name: 'Ahmedabad' },
      { code: 'GJ02', name: 'Surat' },
      { code: 'GJ03', name: 'Vadodara' },
      { code: 'GJ04', name: 'Rajkot' },
      { code: 'GJ05', name: 'Bhavnagar' },
      { code: 'GJ06', name: 'Jamnagar' },
      { code: 'GJ07', name: 'Junagadh' },
      { code: 'GJ08', name: 'Gandhinagar' },
      { code: 'GJ09', name: 'Kutch' },
      { code: 'GJ10', name: 'Anand' },
    ]
  },
  'rajasthan': {
    name: 'Rajasthan',
    districts: [
      { code: 'RJ01', name: 'Jaipur' },
      { code: 'RJ02', name: 'Jodhpur' },
      { code: 'RJ03', name: 'Udaipur' },
      { code: 'RJ04', name: 'Kota' },
      { code: 'RJ05', name: 'Ajmer' },
      { code: 'RJ06', name: 'Bikaner' },
      { code: 'RJ07', name: 'Alwar' },
      { code: 'RJ08', name: 'Bhilwara' },
      { code: 'RJ09', name: 'Sikar' },
      { code: 'RJ10', name: 'Pali' },
    ]
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    districts: [
      { code: 'UP01', name: 'Lucknow' },
      { code: 'UP02', name: 'Kanpur' },
      { code: 'UP03', name: 'Ghaziabad' },
      { code: 'UP04', name: 'Agra' },
      { code: 'UP05', name: 'Varanasi' },
      { code: 'UP06', name: 'Meerut' },
      { code: 'UP07', name: 'Allahabad' },
      { code: 'UP08', name: 'Bareilly' },
      { code: 'UP09', name: 'Aligarh' },
      { code: 'UP10', name: 'Moradabad' },
    ]
  },
  'west-bengal': {
    name: 'West Bengal',
    districts: [
      { code: 'WB01', name: 'Kolkata' },
      { code: 'WB02', name: 'North 24 Parganas' },
      { code: 'WB03', name: 'South 24 Parganas' },
      { code: 'WB04', name: 'Howrah' },
      { code: 'WB05', name: 'Hooghly' },
      { code: 'WB06', name: 'Nadia' },
      { code: 'WB07', name: 'Murshidabad' },
      { code: 'WB08', name: 'Bardhaman' },
      { code: 'WB09', name: 'Malda' },
      { code: 'WB10', name: 'Medinipur' },
    ]
  },
};

// Generate a random number of blocks (8-20) with realistic data for a district
function generateBlocks(district: District): BlockData[] {
  const numBlocks = 8 + Math.floor(Math.random() * 13); // 8 to 20 blocks
  return Array.from({ length: numBlocks }, (_, i) => {
    // For top blocks, use higher values, then decrease
    const baseSchools = 200 - i * 8 + Math.floor(Math.random() * 10);
    const baseStudents = 8000 - i * 400 + Math.floor(Math.random() * 500);
    const baseTeachers = 400 - i * 15 + Math.floor(Math.random() * 20);
    return {
      code: `${district.code}B${String(i + 1).padStart(2, '0')}`,
      name: `Block ${i + 1}`,
      schools: Math.max(20, baseSchools),
      students: Math.max(800, baseStudents),
      teachers: Math.max(30, baseTeachers),
    };
  });
}

export function ReportGenerator() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [reportData, setReportData] = useState<BlockData[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      const state = stateData[selectedState];
      const district = state?.districts.find(d => d.code === selectedDistrict);
      if (district) {
        setReportData(generateBlocks(district));
        setIsPreviewMode(true);
      } else {
        setReportData([]);
        setIsPreviewMode(false);
      }
      setIsLoading(false);
    }, 700);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData.map((row, idx) => ({
      'SL No': idx + 1,
      'District Code': selectedDistrict,
      'Block Code': row.code,
      'Block Name': row.name,
      'No of Schools': row.schools,
      'No of Students': row.students,
      'No of Teachers': row.teachers,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'block_report.xlsx');
  };

  return (
    <div className="flex justify-center items-start min-h-[100vh] bg-gradient-to-br from-white via-orange-50 to-orange-100 py-10 px-2">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl bg-white/90 border border-orange-100 p-8 md:p-12 space-y-10">
        {/* Header Card */}
        <div className="mb-4">
          <div className="rounded-2xl border-2 border-orange-200/60 bg-gradient-to-br from-orange-50 to-orange-100/60 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent drop-shadow-sm">
                Generate Report
              </h1>
              <p className="text-orange-600/80 text-lg">
                Generate and export detailed block-wise reports for districts
              </p>
            </div>
          </div>
        </div>
        {/* Filters Card */}
        <div>
          <Card className="shadow-xl border-orange-200/80 rounded-2xl">
            <CardHeader className="bg-white rounded-t-2xl border-b border-orange-100">
              <CardTitle className="text-lg text-orange-700">Filters</CardTitle>
              <CardDescription className="text-gray-500">Select the parameters for your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">State</label>
                  <Select value={selectedState} onValueChange={value => {
                    setSelectedState(value);
                    setSelectedDistrict('');
                    setIsPreviewMode(false);
                  }}>
                    <SelectTrigger className="rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-400 bg-orange-50/40">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      {Object.entries(stateData).map(([id, state]) => (
                        <SelectItem key={id} value={id} className="hover:bg-orange-50 focus:bg-orange-100">
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">District</label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                    disabled={!selectedState || !stateData[selectedState]?.districts.length}
                  >
                    <SelectTrigger className="rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-400 bg-orange-50/40">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      {selectedState && stateData[selectedState].districts.map(district => (
                        <SelectItem key={district.code} value={district.code} className="hover:bg-orange-50 focus:bg-orange-100">
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleGenerate}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all text-lg"
                  disabled={!selectedState || !selectedDistrict || isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  {isLoading ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Empty State */}
        {!isPreviewMode && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText className="h-14 w-14 mb-4 text-orange-200" />
            <div className="text-xl font-semibold">Select state and district to generate a report</div>
          </div>
        )}
        {/* Report Table */}
        {isPreviewMode && reportData.length > 0 && (
          <div>
            <Card className="shadow-2xl border-orange-200/80 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white rounded-t-2xl border-b border-orange-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg text-orange-700">Report Preview</CardTitle>
                  <CardDescription className="text-gray-500">Block-wise data for the selected district</CardDescription>
                </div>
                <Button onClick={exportToExcel} variant="outline" className="gap-2 border-orange-400 text-orange-700 hover:bg-orange-50 hover:text-orange-900 font-semibold rounded-lg">
                  <Download className="h-5 w-5" />
                  Export to Excel
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border overflow-x-auto bg-white">
                  <Table className="min-w-[700px]">
                    <TableHeader className="sticky top-0 z-10 bg-orange-100/80">
                      <TableRow>
                        <TableHead className="text-orange-700 font-bold">SL No</TableHead>
                        <TableHead className="text-orange-700 font-bold">State</TableHead>
                        <TableHead className="text-orange-700 font-bold">District</TableHead>
                        <TableHead className="text-orange-700 font-bold">Block Code</TableHead>
                        <TableHead className="text-orange-700 font-bold">Block Name</TableHead>
                        <TableHead className="text-orange-700 font-bold">No of Schools</TableHead>
                        <TableHead className="text-orange-700 font-bold">No of Students</TableHead>
                        <TableHead className="text-orange-700 font-bold">No of Teachers</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.map((row, idx) => (
                        <TableRow key={row.code} className={idx % 2 === 0 ? 'bg-orange-50/30' : ''}>
                          <TableCell className="font-semibold text-gray-700">{idx + 1}</TableCell>
                          <TableCell className="text-gray-600">{stateData[selectedState]?.name}</TableCell>
                          <TableCell className="text-gray-600">{stateData[selectedState]?.districts.find(d => d.code === selectedDistrict)?.name}</TableCell>
                          <TableCell className="text-gray-600">{row.code}</TableCell>
                          <TableCell className="text-gray-700 font-medium">{row.name}</TableCell>
                          <TableCell className="text-gray-700">{row.schools}</TableCell>
                          <TableCell className="text-gray-700">{row.students}</TableCell>
                          <TableCell className="text-gray-700">{row.teachers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 