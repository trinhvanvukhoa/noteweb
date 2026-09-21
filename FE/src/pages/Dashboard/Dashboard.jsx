import { useState, useEffect } from 'react';
import BarChart from '../../components/Charts/BarChart';
import LineChart from '../../components/Charts/LineChart';

const API_URL = 'http://localhost:3000/api/tasks/statistics';

const GROUPS = [
  { key: 'byDay', label: 'Theo ngày' },
  { key: 'byMonth', label: 'Theo tháng' },
  { key: 'byYear', label: 'Theo năm' },
];

const formatLabel = (key, group) => {
  if (group === 'byDay') {
    const [, month, day] = key.split('-');
    return `${day}/${month}`;
  }
  if (group === 'byMonth') {
    const [year, month] = key.split('-');
    return `${month}/${year}`;
  }
  return key;
};

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, byDay: {}, byMonth: {}, byYear: {} });
  const [group, setGroup] = useState('byDay');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadStats = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Yêu cầu thất bại');
        const data = await res.json();
        if (!ignore) setStats(data);
      } catch {
        if (!ignore) setStats({ total: 0, byDay: {}, byMonth: {}, byYear: {} });
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  const series = Object.entries(stats[group] || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({ name: formatLabel(key, group), value }));

  if (loading) return <p className="text-gray-500">Đang tải thống kê...</p>;

  return (
    <div>
      <div className="mb-4 flex flex-col items-start gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-cocoa sm:text-2xl">Thống kê ghi chú</h2>
        <span className="rounded-full bg-honey/20 px-3 py-1 text-sm font-medium text-cocoa">
          Tổng: {stats.total} ghi chú
        </span>
      </div>

      <div className="mb-6 flex gap-2 sm:flex-wrap">
        {GROUPS.map((item) => (
          <button
            key={item.key}
            onClick={() => setGroup(item.key)}
            className={`flex-1 whitespace-nowrap rounded-md border px-4 py-2 text-sm transition sm:flex-none ${
              group === item.key
                ? 'border-honey bg-honey text-gray-900'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-honey/15 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {series.length === 0 ? (
        <p className="text-gray-500">Chưa có dữ liệu để thống kê.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 font-medium text-cocoa">Biểu đồ cột</h3>
            <div className="h-56 sm:h-80">
              <BarChart data={series} />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 font-medium text-cocoa">Biểu đồ đường</h3>
            <div className="h-56 sm:h-80">
              <LineChart data={series} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
