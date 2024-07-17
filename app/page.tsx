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
import { Input } from "@/components/ui/input";

import config from './config.json';

export default function App() {
  const dailyDoseVals = config.dailyDoseVals;
  const targetDosePerKgVals = config.targetDosePerKgVals;

  const [doses, setDoses] = useState([""]);
  const [mass, setMass] = useState(0);
  const [totalDosePerKg, setTotalDosePerKg] = useState(120);
  const [targetdose, setTargetdose] = useState(0);

  const handleSelectChange = (index: number, value: string) => {
    const newDoses = [...doses];
    newDoses[index] = value;
    if (value && index === doses.length - 1) {
      newDoses.push("");
    }
    setDoses(newDoses);
  };

  const totaldoses = doses.reduce((acc, dose) => acc + (Number(dose) * 30 || 0), 0);

  // Calculate average daily dose
  const averageDailydose = totaldoses/30/(doses.length-1) || 0;

  // Calculate remaining doses
  const totaldoseTarget = targetdose;
  const remainingdose = totaldoseTarget - totaldoses;

  // Estimate how many months it will take to complete the dose
  const estimatedMonths = remainingdose > 0 && averageDailydose > 0
    ? (remainingdose / (averageDailydose * 30)).toFixed(2)
    : 0;

  useEffect(() => {
    setTargetdose(totalDosePerKg * mass);
  }, [mass, totalDosePerKg]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4">
      <Card className="max-w-sm w-full mx-4 my-4 overflow-auto" >
        <CardHeader>
          <CardTitle className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-xl p-1">
            Isotretinoin Dose Calculator <span className="ml-1">💊</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="text-left">Month</th>
                <th className="text-left">Daily dose</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose, index) => (
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
          
          {/* Summary */}
          <div className="border border-purple-600 rounded-md mt-4 p-4">
            <p className="text-lg font-semibold">Summary</p>
            <div className="flex justify-between">
              <span className="whitespace-nowrap">Total Intake So Far:</span>
              <span className="whitespace-nowrap">{totaldoses} mg</span>
            </div>

            <div className="flex justify-between">
              <span className="whitespace-nowrap">Total Target Dose:</span>
              {mass > 0 && (
                <span className="whitespace-nowrap">{targetdose} mg</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="whitespace-nowrap">Average Daily Dose:</span>
              <span className="whitespace-nowrap">{averageDailydose.toFixed(2)} mg/day</span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold whitespace-nowrap">Total Dose Left:</span>
              {mass > 0 && (
                <span className="whitespace-nowrap">{targetdose - totaldoses} mg</span>
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
