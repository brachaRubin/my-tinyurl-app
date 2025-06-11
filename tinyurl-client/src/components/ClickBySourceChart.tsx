
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ...rest of your code

type Props = {
  linkId: string;
  token: string;
};
type ClickStatsResponse = {
    data: {
      clicksByTarget: { [key: string]: number };
      targetInfo: { [key: string]: string };
    };
  };

export default function ClickBySourceChart({ linkId, token }: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get<ClickStatsResponse>(`http://localhost:3000/api/links/${linkId}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const { clicksByTarget, targetInfo } = res.data.data;
        const chartLabels = Object.keys(clicksByTarget).map(
          key => targetInfo[key] || key
        );
        const chartValues = Object.values(clicksByTarget);
        setLabels(chartLabels);
        setValues(chartValues);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching click stats:', error);
        setLabels([]);
        setValues([]);
        setLoading(false);
      });
  }, [linkId, token]);

  if (loading) return <div>טוען נתונים...</div>;
  if (!labels.length) return <div>אין נתונים להצגה</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'כמות קליקים',
              data: values,
              backgroundColor: 'rgba(75,192,192,0.6)',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'פילוח קליקים לפי מקור' }
          }
        }}
      />
    </div>
  );
}