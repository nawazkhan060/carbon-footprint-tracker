// CarbonFootprintTracker.jsx
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emissionFactors = {
  travel: 0.21,      // kg CO2 per km
  food: 2.5,         // kg CO2 per meal
  shopping: 1.0,     // kg CO2 per $10 spent
  electricity: 0.5   // kg CO2 per kWh
};

export default function CarbonFootprintTracker() {
  const [inputs, setInputs] = useState({
    travel: '',
    food: '',
    shopping: '',
    electricity: ''
  });

  const [totalFootprint, setTotalFootprint] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculateFootprint = () => {
    const travel = parseFloat(inputs.travel || 0) * emissionFactors.travel;
    const food = parseFloat(inputs.food || 0) * emissionFactors.food;
    const shopping = parseFloat(inputs.shopping || 0) * emissionFactors.shopping;
    const electricity = parseFloat(inputs.electricity || 0) * emissionFactors.electricity;

    const total = travel + food + shopping + electricity;
    setTotalFootprint(total.toFixed(2));
  };

  const getSuggestion = () => {
    if (totalFootprint < 20) return "Great job! Keep up the eco-friendly lifestyle.";
    if (totalFootprint < 50) return "You're doing okay. Consider reducing travel or electricity use.";
    return "Try to cut down on shopping and travel to reduce your carbon footprint.";
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Carbon Footprint Tracker</h1>
      <Card className="space-y-4 p-4">
        <CardContent>
          <label className="block mb-2">Travel (km)</label>
          <Input name="travel" type="number" value={inputs.travel} onChange={handleChange} />

          <label className="block mt-4 mb-2">Food (meals)</label>
          <Input name="food" type="number" value={inputs.food} onChange={handleChange} />

          <label className="block mt-4 mb-2">Shopping ($)</label>
          <Input name="shopping" type="number" value={inputs.shopping} onChange={handleChange} />

          <label className="block mt-4 mb-2">Electricity (kWh)</label>
          <Input name="electricity" type="number" value={inputs.electricity} onChange={handleChange} />

          <Button className="mt-6" onClick={calculateFootprint}>Calculate Footprint</Button>
        </CardContent>
      </Card>

      {totalFootprint && (
        <div className="mt-6 bg-green-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Your total carbon footprint: {totalFootprint} kg CO₂</p>
          <p className="mt-2">{getSuggestion()}</p>
        </div>
      )}
    </div>
  );
}
