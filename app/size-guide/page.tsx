import { Ruler, Sparkles } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";

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

function SizeTable({ rows, columns }: { rows: Record<string, string>[]; columns: { key: string; label: string }[] }) {
  return (
    <div className="not-prose overflow-x-auto rounded-2xl border border-dark/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-dark/[0.03] text-xs uppercase tracking-wide text-dark/50">
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
                <td key={c.key} className="px-4 py-2.5 text-dark/70">
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

export default function SizeGuidePage() {
  return (
    <InfoPage icon={Ruler} title="Size Guide" subtitle="Find your perfect fit — in inches.">
      <div className="not-prose flex items-start gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-primary">
        <Sparkles size={18} className="mt-0.5 shrink-0" />
        <p>
          Not sure which size to pick? Use our <span className="font-semibold">AI Fitting Room</span> —
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
        <li><span className="font-semibold text-dark">Bust/Chest:</span> measure around the fullest part, keeping the tape level.</li>
        <li><span className="font-semibold text-dark">Waist:</span> measure around your natural waistline, just above the navel.</li>
        <li><span className="font-semibold text-dark">Hips:</span> measure around the fullest part of your hips.</li>
      </ul>
      <p>Between sizes? We recommend sizing up for a relaxed fit, or down for a snug one.</p>
    </InfoPage>
  );
}
