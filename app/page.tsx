'use client';

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Moon, Sun } from "lucide-react";
import config from './config.json';

export default function App() {
  const dailyDoseVals = config.dailyDoseVals;
  const targetDosePerKgVals = config.targetDosePerKgVals;

  const [dosages, setDosages] = useState([""]);
  const [mass, setMass] = useState(0);
  const [totalDosePerKg, setTotalDosePerKg] = useState(120);
  const [targetDosage, setTargetDosage] = useState(0);
  const { setTheme } = useTheme();
  // const [plan, setPlan] = useState("");

  const handleSelectChange = (index: number, value: string) => {
    const newDosages = [...dosages];
    newDosages[index] = value;
    if (value && index === dosages.length - 1) {
      newDosages.push("");
    }
    setDosages(newDosages);
  };

  const totalDosages = dosages.reduce((acc, dose) => acc + (Number(dose) * 30 || 0), 0);

  // Calculate average daily dosage
  const averageDailyDosage = totalDosages/30/(dosages.length-1) || 0;

  // Calculate remaining doses
  const totalDosageTarget = targetDosage;
  const remainingDosage = totalDosageTarget - totalDosages;

  // Estimate how many months it will take to complete the dosage
  const estimatedMonths = remainingDosage > 0 && averageDailyDosage > 0
    ? (remainingDosage / (averageDailyDosage * 30)).toFixed(2)
    : 0;

  useEffect(() => {
    setTargetDosage(totalDosePerKg * mass);
    // setPlan(
    //   generateTreatmentPlan(remainingDosage, averageDailyDosage)
    // );
  }, [mass, totalDosePerKg]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4">
      <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="max-w-sm w-full mx-4 my-4 overflow-auto" >
        <CardHeader>
          <CardTitle className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-xl p-1">
            Isotretinoin Dosage Calculator <span className="ml-1">💊</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="text-left">Month</th>
                <th className="text-left">Daily Dosage</th>
              </tr>
            </thead>
            <tbody>
              {dosages.map((dose, index) => (
                <tr key={index} className="mb-4 text-center">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">
                    <Select onValueChange={(value) => handleSelectChange(index, value)}>
                      <SelectTrigger className="w-flex">
                        <SelectValue placeholder={`Daily dose for month ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {dailyDoseVals.map((x) => (
                          <SelectItem key={x} value={x.toString()}>
                            {x + " mg"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 items-center">
            <label className="mr-2 whitespace-nowrap">Mass (kg):</label>
            <Input type="number" className="rounded-md p-2 w-half-sa text-center"
              value={mass === 0 ? "" : mass}
              onChange={(e) => {
                const massValue = e.target.value === "" ? 0 : Number(e.target.value);
                setMass(massValue);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
            />
          </div>

          <div className="flex justify-center mt-4 items-center">
            <label className="mr-2 whitespace-nowrap">Target Dose per kg:</label>
            <Select onValueChange={(value) => {
              setTotalDosePerKg(Number(value));
            }
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select total dose per kg" />
              </SelectTrigger>
              <SelectContent>
                {targetDosePerKgVals.map((x) => (
                  <SelectItem key={x} value={x.toString()}>
                    {x + " mg/kg"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border border-purple-600 rounded-md mt-4 p-4">
            <p className="text-lg font-semibold">Summary</p>
            <div className="flex justify-between">
              <span className="whitespace-nowrap">Total Used:</span>
              <span className="whitespace-nowrap">{totalDosages} mg</span>
            </div>

            <div className="flex justify-between">
              <span className="whitespace-nowrap">Total Target Dose:</span>
              {mass > 0 && (
                <span className="whitespace-nowrap">{targetDosage} mg</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="whitespace-nowrap">Average Daily Dose:</span>
              <span className="whitespace-nowrap">{averageDailyDosage.toFixed(2)} mg/day</span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold whitespace-nowrap">Total Dose Left:</span>
              {mass > 0 && (
                <span className="whitespace-nowrap">{targetDosage - totalDosages} mg</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-bold whitespace-nowrap">Estimated Duration:</span>
              <span className="whitespace-nowrap">{estimatedMonths} month{estimatedMonths? Number(estimatedMonths)>1 && "s" : null}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
