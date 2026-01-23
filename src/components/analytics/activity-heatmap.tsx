'use client';

export interface HeatmapData {
  day: string;
  hour: string;
  value: number;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = ['9 AM', '10 AM', '11 AM', '2 PM', '3 PM'];

  const getValueForCell = (day: string, hour: string) => {
    const cell = data.find((d) => d.day === day && d.hour === hour);
    return cell ? cell.value : 0;
  };

  const getColorIntensity = (value: number) => {
    if (value >= 65) return 'bg-indigo-600';
    if (value >= 55) return 'bg-indigo-500';
    if (value >= 45) return 'bg-indigo-400';
    if (value >= 35) return 'bg-indigo-300';
    return 'bg-indigo-200';
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
            <div className="w-24 text-xs font-medium text-gray-600"></div>
            {hours.map((hour) => (
              <div key={hour} className="flex-1 min-w-[80px] text-center text-xs font-medium text-gray-600 px-1">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          {days.map((day) => (
            <div key={day} className="flex items-center mb-2">
              <div className="w-24 text-sm font-medium text-gray-700">{day}</div>
              {hours.map((hour) => {
                const value = getValueForCell(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="flex-1 min-w-[80px] px-1"
                  >
                    <div
                      className={`h-12 rounded-md flex items-center justify-center text-white text-sm font-medium transition-all hover:scale-105 cursor-pointer ${getColorIntensity(value)}`}
                      title={`${day} ${hour}: ${value} activities`}
                    >
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-xs text-gray-600">Less</span>
        <div className="flex gap-1">
          <div className="w-6 h-6 bg-indigo-200 rounded"></div>
          <div className="w-6 h-6 bg-indigo-300 rounded"></div>
          <div className="w-6 h-6 bg-indigo-400 rounded"></div>
          <div className="w-6 h-6 bg-indigo-500 rounded"></div>
          <div className="w-6 h-6 bg-indigo-600 rounded"></div>
        </div>
        <span className="text-xs text-gray-600">More</span>
      </div>
    </div>
  );
}
