"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

const dailyChecklist = {
  "Kahvaltı": "3 yumurta, roka, salatalık, ceviz",
  "Öğle": "Tavuk/hindi, karabuğday, yeşil salata",
  "Ara Öğun": "Elma, lor peyniri",
  "Akşam": "Et/somon, brokoli, kabak, mercimek",
  "Gece": "Lor veya beyaz peynir",
  "Antrenman": "Göğüs, sırt, omuz, biceps günlerine uygun egzersiz",
  "Biceps": "Dumbbell ile gününe uygun set",
  "HIIT": "10 dk (varsa günü)"
};

const dailyMacros = {
  calories: 1750,
  protein: 170,
  fat: 55,
  carbs: 100,
  vitamins: ["A", "B12", "C", "D", "E"],
  minerals: ["Demir", "Çinko", "Magnezyum"]
};

const targetMetrics = {
  weight: 74,
  fat: 17.5,
  muscle: 27.5
};

export default function DailyTracker() {
  const [completed, setCompleted] = useState({});
  const [progress, setProgress] = useState({});

  const toggle = (day, item) => {
    const updated = {
      ...completed,
      [day]: {
        ...completed[day],
        [item]: !completed[day]?.[item]
      }
    };
    setCompleted(updated);
    saveProgressToDB(day, updated[day], progress[day]);
  };

  const updateProgress = (day, field, value) => {
    const updated = {
      ...progress,
      [day]: {
        ...progress[day],
        [field]: value
      }
    };
    setProgress(updated);
    saveProgressToDB(day, completed[day], updated[day]);
  };

  const getFeedback = (day) => {
    const dayProgress = progress[day];
    if (!dayProgress) return "";
    const weight = parseFloat(dayProgress.weight);
    const fat = parseFloat(dayProgress.fat);
    const muscle = parseFloat(dayProgress.muscle);
    if (!weight || !fat || !muscle) return "Veri eksik.";

    let feedback = "";
    feedback += `Hedef Kilo: ${targetMetrics.weight} kg | Şu an: ${weight} kg. `;
    feedback += `Hedef Yağ %: ${targetMetrics.fat}% | Şu an: ${fat}%. `;
    feedback += `Hedef Kas: ${targetMetrics.muscle} kg | Şu an: ${muscle} kg. `;

    if (fat > targetMetrics.fat) feedback += "Yağ oranı hala yüksek. Beslenmeyi sıkı tut. ";
    else feedback += "Yağ oranı iyi gidiyor. ";

    if (muscle < targetMetrics.muscle) feedback += "Kas kütleni artırmak için ağırlık antrenmanlarını ihmal etme.";
    else feedback += "Kas kütlen gayet iyi. Koruma moduna geçebilirsin.";

    return feedback;
  };

  const saveProgressToDB = async (day, completedData, progressData) => {
    const payload = {
      userId: "demoUser",
      date: new Date().toISOString().split("T")[0],
      day,
      completed: completedData,
      progress: progressData
    };

    await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vücut Yenileme Haftalık Takip</h1>
      {days.map((day) => (
        <Card key={day} className="shadow">
          <CardContent className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">{day}</h2>
            {Object.entries(dailyChecklist).map(([item, description]) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  checked={completed[day]?.[item] || false}
                  onCheckedChange={() => toggle(day, item)}
                />
                <div>
                  <span className="font-medium">{item}:</span> {description}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <p className="text-sm font-medium">Günlük Makrolar:</p>
              <ul className="text-sm list-disc list-inside">
                <li>Kalori: {dailyMacros.calories} kcal</li>
                <li>Protein: {dailyMacros.protein} g</li>
                <li>Yağ: {dailyMacros.fat} g</li>
                <li>Karbonhidrat: {dailyMacros.carbs} g</li>
                <li>Vitaminler: {dailyMacros.vitamins.join(", ")}</li>
                <li>Mineraller: {dailyMacros.minerals.join(", ")}</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
              <Input
                type="number"
                placeholder="Kilo (kg)"
                value={progress[day]?.weight || ""}
                onChange={(e) => updateProgress(day, "weight", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Yağ %"
                value={progress[day]?.fat || ""}
                onChange={(e) => updateProgress(day, "fat", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Kas (kg)"
                value={progress[day]?.muscle || ""}
                onChange={(e) => updateProgress(day, "muscle", e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-700 pt-2">Geri Bildirim: {getFeedback(day)}</p>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={() => {
          setCompleted({});
          setProgress({});
        }}
        className="bg-red-500 hover:bg-red-600"
      >
        Tüm Seçimleri Sıfırla
      </Button>
    </div>
  );
}
