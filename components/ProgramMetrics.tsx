import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFilteredData, getBudgetData, getPerformanceData } from "@/services/dataService";
import { PARTNERS, STATES, PERIODS } from "@/data/constants";

interface ProgramMetricsProps {
  partner: string;
  state: string;
  period: string;
  setPartner: (value: string) => void;
  setState: (value: string) => void;
  setPeriod: (value: string) => void;
}

export function ProgramMetrics({ 
  partner, 
  state, 
  period, 
  setPartner, 
  setState, 
  setPeriod 
}: ProgramMetricsProps) {
  const filteredData = getFilteredData(partner, state, period);
  const budgetData = getBudgetData(partner, state, period);
  const performanceData = getPerformanceData(partner, state, period);

  // Calculate program goals progress
  const goals = {
    schools: {
      target: 1000,
      current: filteredData.schools,
      progress: (filteredData.schools / 1000) * 100
    },
    students: {
      target: 250000,
      current: filteredData.students,
      progress: (filteredData.students / 250000) * 100
    },
    teachers: {
      target: 5000,
      current: filteredData.teachers,
      progress: (filteredData.teachers / 5000) * 100
    },
    kits: {
      target: 10000,
      current: filteredData.kits,
      progress: (filteredData.kits / 10000) * 100
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Program Goals
        </h2>
        <div className="flex flex-wrap gap-2">
          <Select value={partner} onValueChange={setPartner}>
            <SelectTrigger className="w-[180px] border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50/80">
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
            <SelectTrigger className="w-[180px] border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50/80">
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
            <SelectTrigger className="w-[180px] border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50/80">
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
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 hover:bg-white/90 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Schools Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-br from-orange-600 to-orange-700 bg-clip-text text-transparent">
              {goals.schools.current.toLocaleString()}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Target: {goals.schools.target.toLocaleString()}</span>
                <span>{Math.round(goals.schools.progress)}%</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                  style={{ width: `${Math.min(goals.schools.progress, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 hover:bg-white/90 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Students Reached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {goals.students.current.toLocaleString()}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Target: {goals.students.target.toLocaleString()}</span>
                <span>{Math.round(goals.students.progress)}%</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${Math.min(goals.students.progress, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 hover:bg-white/90 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Teachers Trained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              {goals.teachers.current.toLocaleString()}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Target: {goals.teachers.target.toLocaleString()}</span>
                <span>{Math.round(goals.teachers.progress)}%</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                  style={{ width: `${Math.min(goals.teachers.progress, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 hover:bg-white/90 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kits Deployed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">
              {goals.kits.current.toLocaleString()}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Target: {goals.kits.target.toLocaleString()}</span>
                <span>{Math.round(goals.kits.progress)}%</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                  style={{ width: `${Math.min(goals.kits.progress, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 