"use client";

import { useState } from "react";
import { Ruler, Sparkles, Wand2 } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import Button from "@/components/ui/Button";

const womens = [
  { size: "XS", bust: "32", waist: "25", hips: "35" },
  { size: "S", bust: "34", waist: "27", hips: "37" },
  { size: "M", bust: "36", waist: "29", hips: "39" },
  { size: "L", bust: "38", waist: "31", hips: "41" },
  { size: "XL", bust: "40", waist: "33", hips: "43" },
  { size: "XXL", bust: "42", waist: "35", hips: "45" },
];

const mens = [
  { size: "S", chest: "36", waist: "30", length: "27" },
  { size: "M", chest: "38", waist: "32", length: "28" },
  { size: "L", chest: "40", waist: "34", length: "29" },
  { size: "XL", chest: "42", waist: "36", length: "30" },
  { size: "XXL", chest: "44", waist: "38", length: "31" },
];

// Practical weight-based estimates (kg), used as a quick starting point alongside the charts below.
const WOMEN_WEIGHT_BANDS: { max: number; size: string }[] = [
  { max: 50, size: "XS" },
  { max: 58, size: "S" },
  { max: 66, size: "M" },
  { max: 74, size: "L" },
  { max: 82, size: "XL" },
  { max: Infinity, size: "XXL" },
];

const MEN_WEIGHT_BANDS: { max: number; size: string }[] = [
  { max: 60, size: "S" },
  { max: 72, size: "M" },
  { max: 84, size: "L" },
  { max: 96, size: "XL" },
  { max: Infinity, size: "XXL" },
];

function estimateSize(gender: "women" | "men", weight: number, height: number) {
  const bands = gender === "women" ? WOMEN_WEIGHT_BANDS : MEN_WEIGHT_BANDS;
  let index = bands.findIndex((b) => weight <= b.max);
  if (index === -1) index = bands.length - 1;

  // Tall frames tend to carry weight more evenly — bump up one size for a more relaxed fit.
  const tallThreshold = gender === "women" ? 172 : 185;
  if (height >= tallThreshold && index < bands.length - 1) index += 1;

  return bands[index].size;
}

function SizeTable({ rows, columns }: { rows: Record<string, string>[]; columns: { key: string; label: string }[] }) {
  return (
    <div className="not-prose overflow-x-auto rounded-2xl border border-dark/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-dark/[0.03] text-xs uppercase tracking-wide text-fg/50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-t border-dark/10">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2.5 text-fg/70">
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SizeCalculator() {
  const [gender, setGender] = useState<"women" | "men">("women");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return;
    setResult(estimateSize(gender, w, h));
  };

  return (
    <div className="not-prose rounded-2xl border border-dark/10 bg-dark/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Wand2 size={18} className="text-primary" />
        <p className="font-heading text-base font-bold text-fg">Quick Size Calculator</p>
      </div>
      <p className="mt-1 text-sm text-fg/50">
        Enter your height and weight for an instant size estimate.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-fg">I'm shopping for</span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "women" | "men")}
            className="w-full rounded-xl border border-dark/15 bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary sm:w-32"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </label>
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-semibold text-fg">Height (cm)</span>
          <input
            required
            type="number"
            min={100}
            max={230}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 165"
            className="w-full rounded-xl border border-dark/15 bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-semibold text-fg">Weight (kg)</span>
          <input
            required
            type="number"
            min={30}
            max={180}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 60"
            className="w-full rounded-xl border border-dark/15 bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <Button type="submit" size="md">
          Get My Size
        </Button>
      </form>

      {result && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3">
          <span className="font-heading text-2xl font-extrabold text-primary">{result}</span>
          <p className="text-sm text-primary">
            is your recommended starting size. Check the charts below for exact measurements.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <InfoPage icon={Ruler} title="Size Guide" subtitle="Find your perfect fit — in inches.">
      <SizeCalculator />

      <div className="not-prose flex items-start gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-primary">
        <Sparkles size={18} className="mt-0.5 shrink-0" />
        <p>
          Want a more precise match? Use our <span className="font-semibold">AI Fitting Room</span> —
          scan a photo and get a personalised size recommendation for any product in seconds.
        </p>
      </div>

      <h2>Women&apos;s sizing (inches)</h2>
      <SizeTable
        rows={womens}
        columns={[
          { key: "size", label: "Size" },
          { key: "bust", label: "Bust" },
          { key: "waist", label: "Waist" },
          { key: "hips", label: "Hips" },
        ]}
      />

      <h2>Men&apos;s sizing (inches)</h2>
      <SizeTable
        rows={mens}
        columns={[
          { key: "size", label: "Size" },
          { key: "chest", label: "Chest" },
          { key: "waist", label: "Waist" },
          { key: "length", label: "Shirt Length" },
        ]}
      />

      <h2>How to measure</h2>
      <ul>
        <li><span className="font-semibold text-fg">Bust/Chest:</span> measure around the fullest part, keeping the tape level.</li>
        <li><span className="font-semibold text-fg">Waist:</span> measure around your natural waistline, just above the navel.</li>
        <li><span className="font-semibold text-fg">Hips:</span> measure around the fullest part of your hips.</li>
      </ul>
      <p>Between sizes? We recommend sizing up for a relaxed fit, or down for a snug one.</p>
    </InfoPage>
  );
}
