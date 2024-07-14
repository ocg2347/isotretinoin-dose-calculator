'use client';

import { useState } from "react";
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
import config from './config.json';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function App() {
  const dailyDoseVals = config.dailyDoseVals;
  const [dosages, setDosages] = useState([""]);
  const [mass, setMass] = useState(0);
  const [targetDosage, setTargetDosage] = useState([0, 0]);
  const { setTheme } = useTheme();

  const handleSelectChange = (index: number, value: string) => {
    const newDosages = [...dosages];
    newDosages[index] = value;
    if (value && index === dosages.length - 1) {
      newDosages.push("");
    }
    setDosages(newDosages);
  };

  const totalDosages = dosages.reduce((acc, dose) => acc + (Number(dose) * 30 || 0), 0);

  const updateTargetDosage = (massValue: number) => {
    const minDosage = 120 * massValue;
    const maxDosage = 150 * massValue;
    setTargetDosage([minDosage, maxDosage]);
  };

  const handleMassKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Close the keyboard
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-4 right-4">
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

      <Card className="max-w-sm w-full mx-4 my-4">
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
                        <SelectValue placeholder={`Select daily dose for month ${index + 1}`} />
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
            <label className="mr-2">Enter Mass (kg):</label>
            <input
              type="number"
              value={mass === 0 ? "" : mass}
              onChange={(e) => {
                const massValue = e.target.value === "" ? 0 : Number(e.target.value);
                setMass(massValue);
                updateTargetDosage(massValue);
              }}
              onKeyDown={handleMassKeyDown} // Handle Enter key
              className="border border-gray-300 rounded-md p-2 w-[200px] text-center"
            />
          </div>

          {/* Summary section rendering conditionally based on mass */}
          <div className="border border-gray-300 rounded-md mt-4 p-4">
            <p className="text-lg font-semibold">Summary</p>
            <div className="flex justify-between">
              <span className="whitespace-nowrap">Total Used:</span>
              <span className="whitespace-nowrap">{totalDosages} mg</span>
            </div>

            <div className="flex justify-between">
              <span className="whitespace-nowrap">Total Dosage Target:</span>
              {mass > 0 && (
                <span className="whitespace-nowrap">{targetDosage[0]} - {targetDosage[1]} mg</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="font-bold whitespace-nowrap">Total Dosage Left:</span>
              {mass > 0 && (
                <span className="whitespace-nowrap">{targetDosage[0] - totalDosages} - {targetDosage[1] - totalDosages} mg</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
