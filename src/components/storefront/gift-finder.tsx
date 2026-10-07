"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AGE_RANGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function GiftFinder() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [budget, setBudget] = useState("");
  return (
    <div className="mt-8 rounded-3xl bg-white p-6 card-shadow">
      <h2 className="font-serif text-2xl">Gift finder</h2>
      <p className="text-sm text-muted">Age, who it is for, and a budget. We will show a short list.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <select className="h-11 rounded-2xl border px-3" value={age} onChange={(e) => setAge(e.target.value)}>
          <option value="">Age</option>
          {AGE_RANGES.map((a) => (
            <option key={a.key} value={a.key}>
              {a.label}
            </option>
          ))}
        </select>
        <select className="h-11 rounded-2xl border px-3" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Anyone</option>
          <option value="girl">Girl</option>
          <option value="boy">Boy</option>
        </select>
        <select className="h-11 rounded-2xl border px-3" value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Budget</option>
          <option value="1500">Under 1,500</option>
          <option value="3000">Under 3,000</option>
          <option value="5000">Under 5,000</option>
          <option value="premium">Premium</option>
        </select>
        <Button
          onClick={() => {
            const q = new URLSearchParams();
            if (age) q.set("age", age);
            if (gender) q.set("gender", gender);
            if (budget === "premium") q.set("min", "5000");
            else if (budget) q.set("max", budget);
            router.push(`/gifts?${q.toString()}`);
          }}
        >
          Find gifts
        </Button>
      </div>
    </div>
  );
}
