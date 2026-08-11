import type { ActivityDay } from "@/lib/schema";
import { cn } from "@/lib/utils";

const WEEKS = 53;
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Brand-blue ramp — no new hue enters the palette for this surface. */
const LEVEL_CLASS = [
  "bg-secondary",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

function level(count: number) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

type Cell = { date: string; count: number; future: boolean };

/** Builds 53 week-columns ending with the current week, aligned Sunday-first. */
function buildWeeks(days: ActivityDay[]): Cell[][] {
  const counts = new Map(days.map((day) => [day.date, day.count]));
  const today = new Date();
  const end = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  const weekEnd = new Date(end);
  weekEnd.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
  const start = new Date(weekEnd);
  start.setUTCDate(weekEnd.getUTCDate() - (WEEKS * 7 - 1));

  return Array.from({ length: WEEKS }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const cursor = new Date(start);
      cursor.setUTCDate(start.getUTCDate() + week * 7 + day);
      const date = isoDay(cursor);
      return {
        date,
        count: counts.get(date) ?? 0,
        future: cursor.getTime() > end.getTime(),
      };
    }),
  );
}

function tooltip(cell: Cell) {
  const label = new Date(`${cell.date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  if (cell.count === 0) return `No activity on ${label}`;
  return `${cell.count} ${cell.count === 1 ? "action" : "actions"} on ${label}`;
}

/**
 * The contribution grid: one dot per day, brand-blue intensity by volume.
 * Native titles carry the per-day detail, so no hover JS is needed.
 */
export function ContributionGraph({ days }: { days: ActivityDay[] }) {
  const weeks = buildWeeks(days);

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2">
        <div className="flex flex-col gap-1 pt-5">
          {WEEKDAY_LABELS.map((label, index) => (
            <span
              key={index}
              className="flex h-3 items-center text-[10px] leading-none text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>

        <div>
          {/* Month labels — only where a new month starts a column */}
          <div className="mb-1 flex gap-1">
            {weeks.map((week, index) => {
              const first = new Date(`${week[0]!.date}T00:00:00Z`);
              const previous =
                index > 0
                  ? new Date(`${weeks[index - 1]![0]!.date}T00:00:00Z`)
                  : null;
              const isNewMonth =
                !previous || first.getUTCMonth() !== previous.getUTCMonth();
              return (
                <span
                  key={week[0]!.date}
                  className="w-3 text-[10px] leading-none text-muted-foreground"
                >
                  {isNewMonth ? MONTHS[first.getUTCMonth()] : ""}
                </span>
              );
            })}
          </div>

          <div className="flex gap-1">
            {weeks.map((week) => (
              <div key={week[0]!.date} className="flex flex-col gap-1">
                {week.map((cell) => (
                  <span
                    key={cell.date}
                    title={cell.future ? undefined : tooltip(cell)}
                    aria-hidden={cell.future}
                    className={cn(
                      "size-3 rounded-[4px]",
                      cell.future
                        ? "bg-secondary/40"
                        : LEVEL_CLASS[level(cell.count)],
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        Less
        {LEVEL_CLASS.map((className) => (
          <span
            key={className}
            className={cn("size-3 rounded-[4px]", className)}
          />
        ))}
        More
      </div>
    </div>
  );
}
