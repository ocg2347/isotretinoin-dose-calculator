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

export default function App() {
  const dailyDoseVals = config.dailyDoseVals;
  const [dosages, setDosages] = useState([""]); // Start with one month
  const [mass, setMass] = useState(0); // Mass of the subject
  const [targetDosage, setTargetDosage] = useState([0, 0]); // Target dosage interval

  const handleSelectChange = (index: number, value: string) => {
    const newDosages = [...dosages];
    newDosages[index] = value; // Update the selected dosage

    // Add a new month row if the user selects a dose
    if (value && index === dosages.length - 1) {
      newDosages.push(""); // Add new empty month
    }

    setDosages(newDosages);
  };

  // Calculate total dosage
  const totalDosages = dosages.reduce((acc, dose) => acc + (Number(dose) * 30 || 0), 0);

  // Update target dosage based on mass
  const updateTargetDosage = (massValue) => {
    const minDosage = 120 * massValue;
    const maxDosage = 150 * massValue;
    setTargetDosage([minDosage, maxDosage]);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Isotretinoin Dosage Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="text-left">Month</th>
                <th className="text-left">Select Dose</th>
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

          {/* Input for subject's mass */}
          <div className="flex justify-center mt-4 items-center">
            <label className="mr-2">Enter Mass (kg):</label>
            <input
              type="number"
              value={mass}
              onChange={(e) => {
                const massValue = Number(e.target.value);
                setMass(massValue);
                updateTargetDosage(massValue);
              }}
              className="border border-gray-300 rounded-md p-2 w-[200px] text-center"
            />
          </div>

          <div className="flex justify-center mt-4">
            <div className="border border-gray-300 rounded-md p-4 w-[300px]">
              <p className="text-lg font-semibold">Summary</p>
              <div className="flex justify-between">
                <span>Total Used:</span>
                <span>{totalDosages}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Total Dosage:</span>
                <span>{targetDosage[0]} - {targetDosage[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Total Dosage Left:</span>
                <span>{targetDosage[0] - totalDosages} - {targetDosage[1] - totalDosages}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
