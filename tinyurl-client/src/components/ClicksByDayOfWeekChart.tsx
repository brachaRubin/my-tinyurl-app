import React from 'react';
import { Bar } from 'react-chartjs-2';

interface Click {
  insertedAt: string;
}

interface ClicksByDayOfWeekChartProps {
  links: Array<{ _id?: string; originalUrl?: string; targetValues?: { name: string; value: string }[]; clicks: Click[] }>;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function aggregateClicksByDayOfWeek(link: { clicks: Click[] }) {
  const counts = Array(7).fill(0);
  link.clicks.forEach(click => {
    const date = new Date(click.insertedAt);
    const day = date.getDay();
    counts[day] += 1;
  });
  return counts;
}

const colors = [
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 99, 132, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(199, 199, 199, 0.6)',
];

function formatTarget(link: any) {
  if (Array.isArray(link.targetValues) && link.targetValues.length > 0) {
    return ' (' + link.targetValues.map((tv: { name: string; value: string }) => `${tv.name}=${tv.value}`).join(', ') + ')';
  }
  return '';
}

const ClicksByDayOfWeekChart: React.FC<ClicksByDayOfWeekChartProps> = ({ links }) => {
  // If only one link, keep old behavior
  if (links.length === 1) {
    const counts = aggregateClicksByDayOfWeek(links[0]);
    const data = {
      labels: dayNames,
      datasets: [
        {
          label: (links[0].originalUrl ? links[0].originalUrl.slice(0, 40) : '') + formatTarget(links[0]),
          data: counts,
          backgroundColor: colors[0],
          borderColor: colors[0].replace('0.6', '1'),
          borderWidth: 1,
        },
      ],
    };
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { display: true, position: 'bottom' } } }} />
      </div>
    );
  }

  // Multiple links: group by link, show legend
  const datasets = links.map((link, i) => ({
    label: (link.originalUrl ? link.originalUrl.slice(0, 40) : '') + formatTarget(link),
    data: aggregateClicksByDayOfWeek(link),
    backgroundColor: colors[i % colors.length],
    borderColor: colors[i % colors.length].replace('0.6', '1'),
    borderWidth: 1,
  }));
  const data = {
    labels: dayNames,
    datasets,
  };
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { display: true, position: 'bottom' } } }} />
    </div>
  );
};

export default ClicksByDayOfWeekChart;
