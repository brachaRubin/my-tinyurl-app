import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title);

interface Link {
  _id: string;
  originalUrl: string;
  clicks: { insertedAt: string }[];
}

interface TotalClicksPerLinkChartProps {
  links: Link[];
}

const TotalClicksPerLinkChart: React.FC<TotalClicksPerLinkChartProps> = ({ links }) => {
  const formatTarget = (link: any) => {
    if (Array.isArray(link.targetValues) && link.targetValues.length > 0) {
      return ' (' + link.targetValues.map((tv: { name: string; value: string }) => `${tv.name}=${tv.value}`).join(', ') + ')';
    }
    return '';
  };
  const labels = links.map(link => {
    const base = link.originalUrl.length > 40 ? link.originalUrl.slice(0, 40) + '...' : link.originalUrl;
    return base + formatTarget(link);
  });
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Clicks',
        data: links.map(link => link.clicks.length),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FF6384', '#36A2EB', '#FFCE56'
        ],
      },
    ],
  };
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Pie data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
    </div>
  );
};

export default TotalClicksPerLinkChart;
