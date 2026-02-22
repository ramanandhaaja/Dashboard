'use client';

export interface HeatmapData {
  day: string;
  hour: string;
  value: number;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Derive hours from data to stay in sync with API
  const hoursSet = new Set<string>();
  data.forEach((d) => hoursSet.add(d.hour));
  // Maintain order from data (API sends them in order)
  const hours: string[] = [];
  data.forEach((d) => {
    if (!hours.includes(d.hour)) hours.push(d.hour);
  });

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const getValueForCell = (day: string, hour: string) => {
    const cell = data.find((d) => d.day === day && d.hour === hour);
    return cell ? cell.value : 0;
  };

  const getColorClass = (value: number) => {
    if (value === 0) return 'bg-gray-100 text-gray-400';
    const ratio = value / maxValue;
    if (ratio >= 0.8) return 'bg-indigo-600 text-white';
    if (ratio >= 0.6) return 'bg-indigo-500 text-white';
    if (ratio >= 0.4) return 'bg-indigo-400 text-white';
    if (ratio >= 0.2) return 'bg-indigo-300 text-white';
    return 'bg-indigo-200 text-indigo-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Activity Heatmap</h2>
        <p className="text-sm text-gray-600">Peak usage hours by day of the week</p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex items-center mb-2">
            <div className="w-20 shrink-0 text-xs font-medium text-gray-600"></div>
            {hours.map((hour) => (
              <div key={hour} className="flex-1 min-w-[48px] text-center text-[10px] font-medium text-gray-500 px-0.5">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          {DAYS.map((day) => (
            <div key={day} className="flex items-center mb-1.5">
              <div className="w-20 shrink-0 text-xs font-medium text-gray-700">{day}</div>
              {hours.map((hour) => {
                const value = getValueForCell(day, hour);
                return (
                  <div key={`${day}-${hour}`} className="flex-1 min-w-[48px] px-0.5">
                    <div
                      className={`h-9 rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-105 cursor-pointer ${getColorClass(value)}`}
                      title={`${day} ${hour}: ${value} issues`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="text-xs text-gray-500">No activity</span>
        <div className="flex gap-1">
          <div className="w-5 h-5 bg-gray-100 rounded border border-gray-200"></div>
          <div className="w-5 h-5 bg-indigo-200 rounded"></div>
          <div className="w-5 h-5 bg-indigo-300 rounded"></div>
          <div className="w-5 h-5 bg-indigo-400 rounded"></div>
          <div className="w-5 h-5 bg-indigo-500 rounded"></div>
          <div className="w-5 h-5 bg-indigo-600 rounded"></div>
        </div>
        <span className="text-xs text-gray-500">Most activity</span>
      </div>
    </div>
  );
}
