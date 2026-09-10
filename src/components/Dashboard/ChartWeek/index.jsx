import { Pie, PieChart } from 'recharts';

function ChartWeek({ props }) {
  return (
    <article className="h-[343px] rounded-[9px] bg-white p-[32px]">
      <h3 className="m-0 text-[21px] font-normal text-[#1737ee]">
        <strong>x{props.goalsCompleted}</strong> <span className="text-[14px] text-[#aeb9ff]">sur objectif de {props.WEEKLY_GOAL}</span>
      </h3>
      <p className="mt-[8px] mb-[24px] text-[13px] text-[#777]">Courses hebdomadaire réalisées</p>
      <PieChart
        style={{ width: '306px', height: '190px' }}
        responsive
      >
        <Pie
          data={props.dataGoals}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="83%"
          stroke="none"
          labelLine={false}
          label={CustomizedLabel}
          isAnimationActive={true}
        />
      </PieChart>
    </article>

  );
}


// Source - https://stackoverflow.com/a/45812427
// Posted by CharukaK, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-25, License - CC BY-SA 4.0

const CustomizedLabel = ({ x, y, label, value, fill }) => {
  return (
    <>
      <circle r="4" cx={x - 30} cy={y + 1} fill={fill} />
      <text x={x} y={y} dy={5} fill="#707070" fontSize={10} textAnchor="middle"> {value} {label}</text>
    </>
  );
};

export default ChartWeek;