import { leadsByDay } from "@/lib/app-data";

/**
 * Leads per day over the last fortnight.
 *
 * One series, so it wears one hue and needs no legend — the caption says what
 * is plotted. Only the peak is directly labelled; the axis and the hover
 * tooltips carry the rest, and an off-screen table carries all fourteen values
 * for anyone not using a pointer.
 */
export function LeadsChart() {
  const peak = Math.max(...leadsByDay.map((d) => d.leads));
  /* Round the top of the scale up to an even number so the ticks divide cleanly. */
  const ceiling = Math.ceil(peak / 2) * 2;
  const ticks = [ceiling, ceiling / 2, 0];

  const first = leadsByDay[0];
  const last = leadsByDay[leadsByDay.length - 1];
  const total = leadsByDay.reduce((sum, d) => sum + d.leads, 0);

  return (
    <figure className="rounded-2xl border border-hairline bg-card p-5 backdrop-blur-sm sm:p-6">
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span>
          <span className="block font-display text-base font-bold text-ink">
            Leads per day
          </span>
          <span className="block text-sm text-faint">
            Last 14 days · {total} leads
          </span>
        </span>
      </figcaption>

      <div className="flex gap-3">
        {/* Y ticks, sitting outside the plot so nothing overlaps the marks. */}
        <div className="flex h-40 flex-col justify-between text-right text-[0.7rem] tabular-nums text-faint sm:h-48">
          {ticks.map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        <div className="relative h-40 flex-1 sm:h-48">
          {/* Hairline gridlines, one step off the surface and behind the bars. */}
          <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((tick) => (
              <span key={tick} className="block h-px w-full bg-surface-mute" />
            ))}
          </div>

          <div className="relative flex h-full items-end gap-0.5">
            {leadsByDay.map((day) => (
              <div
                key={day.day}
                className="group relative flex h-full flex-1 items-end justify-center"
              >
                {/* The whole column is the hover target, not just the bar. */}
                <span
                  className="w-full max-w-6 rounded-t bg-brand/80 transition-colors group-hover:bg-brand"
                  style={{ height: `${(day.leads / ceiling) * 100}%` }}
                />

                {day.leads === peak && (
                  <span
                    className="pointer-events-none absolute left-1/2 mb-1 -translate-x-1/2 text-[0.7rem] font-bold tabular-nums text-ink"
                    style={{ bottom: `${(day.leads / ceiling) * 100}%` }}
                  >
                    {day.leads}
                  </span>
                )}

                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-hairline bg-popover px-2.5 py-1.5 text-center whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                >
                  <span className="block text-[0.7rem] text-faint">{day.day}</span>
                  <span className="block text-sm font-bold tabular-nums text-ink">
                    {day.leads} leads
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between pl-8 text-[0.7rem] text-faint">
        <span>{first.day}</span>
        <span>{last.day}</span>
      </div>

      {/* The same numbers, reachable without a pointer. */}
      <table className="sr-only">
        <caption>Leads per day, last 14 days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Leads</th>
          </tr>
        </thead>
        <tbody>
          {leadsByDay.map((day) => (
            <tr key={day.day}>
              <th scope="row">{day.day}</th>
              <td>{day.leads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
