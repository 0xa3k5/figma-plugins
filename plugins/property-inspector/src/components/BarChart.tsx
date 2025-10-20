import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { h } from 'preact';
import { Bar } from 'react-chartjs-2';

import { PropertyType, PropertyTypeValues } from '../types';

interface Props {
  rawData: Record<string, number>;
  title: string;
  pageData: PropertyTypeValues;
}

export default function BarChart({ rawData, title, pageData }: Props): h.JSX.Element {
  const labels = Object.keys(rawData);
  const dataValues = Object.values(rawData);

  const getPropertyCounts = (key: any) => {
    const propertyValues = pageData[key];

    const counts = Object.fromEntries(Object.values(PropertyType).map((type) => [type, 0]));

    Object.values(PropertyType).forEach((type) => {
      counts[type] = Object.values(propertyValues[type]).reduce((sum, { count }) => sum + count, 0);
    });

    return counts;
  };

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: 'rgba(111,76,255,.8)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: title,
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const label = context[0].label;
            const totalCount = context[0].parsed.y;

            return `${label}px • (${totalCount})`;
          },
          beforeBody: (context: any) => {
            const label = context[0].label;
            const counts = getPropertyCounts(label);

            return Object.values(PropertyType).map(
              (type) => `${type.charAt(0).toUpperCase() + type.slice(1)} • (${counts[type]})`
            );
          },
          label: () => {
            // Hide the default label
            return '';
          },
        },
      },
    },
  };

  ChartJS.register(Tooltip, Title, LinearScale, ArcElement, BarElement, CategoryScale);

  return <Bar options={barChartOptions} data={data} />;
}
