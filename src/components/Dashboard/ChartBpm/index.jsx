import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from 'recharts';

function ChartBpm({ props }) {
  return (
    <article className="rounded-[9px] bg-white p-[32px]">
      <div className="flex items-start justify-between mb-[24px]">
        <div>
          <h3 className="m-0 text-[21px] font-normal text-[#f03218]">{props.avgBpm ?? '–'} BPM</h3>
          <p className="mt-[8px] text-[13px] text-[#777]">Fréquence cardiaque moyenne</p>
        </div>
        <div className="flex items-center gap-[7px] pt-[8px] text-[11px] whitespace-nowrap">
          <button
            type="button"
            onClick={props.goToPrevWeek(props.setBpmWeekStart)}
            disabled={props.bpmWeekStart <= props.INITIAL_WEEK_START}
            className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
          >‹</button>
          <span>{props.getWeekRangeLabel(props.bpmWeekStart)}</span>
          <button
            type="button"
            onClick={props.goToNextWeek(props.setBpmWeekStart)}
            disabled={props.bpmWeekStart >= props.latestWeekStart}
            className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
          >›</button>
        </div>
      </div>
      <ComposedChart
        style={{ /*width: "503px",*/ height: "307px", fontSize: "12px" }}
        responsive={true}
        data={props.dataBpm}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis width="auto" niceTicks="snap125" />
        <Bar dataKey="minBpm" barSize={14} radius={14} fill="#FCC1B6" />
        <Bar dataKey="maxBpm" barSize={14} radius={14} fill="#F4320B" />
        <Line type="monotone" dataKey="averageBpm" stroke="#0B23F4" strokeWidth={3}
          dot={{ fill: "#F2F3FF", strokeWidth: 2, r: 5 }} activeDot={false} />
        <Legend />
      </ComposedChart>
    </article>

  );
}

export default ChartBpm;