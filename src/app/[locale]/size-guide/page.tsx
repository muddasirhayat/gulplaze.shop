export default function SizeGuidePage() {
  return (
    <div className="container-gp py-16">
      <h1 className="font-serif text-4xl">Size guides</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Measure over light clothing. If you are between sizes, choose the larger one — little ones grow quickly.
      </p>
      <h2 className="mt-10 font-serif text-2xl">Baby clothes (0–24 months)</h2>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Size</th>
              <th className="p-2">Age</th>
              <th className="p-2">Height</th>
              <th className="p-2">Weight</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["NB", "Newborn", "up to 56 cm", "up to 4 kg"],
              ["0–3M", "0–3 months", "56–62 cm", "4–6 kg"],
              ["3–6M", "3–6 months", "62–68 cm", "6–8 kg"],
              ["6–12M", "6–12 months", "68–80 cm", "8–10 kg"],
              ["12–18M", "12–18 months", "80–86 cm", "10–12 kg"],
              ["18–24M", "18–24 months", "86–92 cm", "12–13 kg"],
            ].map((row) => (
              <tr key={row[0]} className="border-t">
                {row.map((c) => (
                  <td key={c} className="p-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-10 font-serif text-2xl">Kids clothes (2–12 years)</h2>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Size</th>
              <th className="p-2">Age</th>
              <th className="p-2">Height</th>
              <th className="p-2">Chest</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["2Y", "2 years", "92 cm", "53 cm"],
              ["4Y", "3–4 years", "104 cm", "56 cm"],
              ["6Y", "5–6 years", "116 cm", "60 cm"],
              ["8Y", "7–8 years", "128 cm", "64 cm"],
              ["10Y", "9–10 years", "140 cm", "70 cm"],
              ["12Y", "11–12 years", "152 cm", "76 cm"],
            ].map((row) => (
              <tr key={row[0]} className="border-t">
                {row.map((c) => (
                  <td key={c} className="p-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
