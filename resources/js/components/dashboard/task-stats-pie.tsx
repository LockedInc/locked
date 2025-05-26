import { ResponsivePie } from '@nivo/pie';
import { router } from '@inertiajs/react';

interface TaskStats {
  completed: number;
  in_progress: number;
  pending: number;
}

export function TaskStatusPieChart({ taskStats }: { taskStats: TaskStats }) {
  const pieData = [
    {
      id: 'Completed',
      label: 'Completed',
      value: taskStats.completed,
      color: '#22c55e', // green
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: taskStats.in_progress,
      color: '#3b82f6', // blue
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: taskStats.pending,
      color: '#facc15', // yellow
    },
  ];

  const handlePieClick = (data: any) => {
    if (data && data.id) {
      let status = '';
      if (data.id === 'Completed') status = 'completed';
      else if (data.id === 'In Progress') status = 'in_progress';
      else if (data.id === 'Pending') status = 'pending';
      if (status) {
        router.visit(`/admin/tasks?status=${status}`);
      }
    }
  };

  return (
    <div style={{ height: 250, cursor: 'pointer' }} title="Go to Tasks List">
      <ResponsivePie
        data={pieData}
        margin={{ top: 50, right: 70, bottom: 30, left: 70 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={5}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#fff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#fff"
        legends={[]}
        enableArcLinkLabels={false}
        onClick={handlePieClick}
      />
      {/* Custom Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
        <LegendItem color="#22c55e" label="Completed" />
        <LegendItem color="#3b82f6" label="In Progress" />
        <LegendItem color="#facc15" label="Pending" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 14 }}>{label}</span>
    </div>
  );
}
