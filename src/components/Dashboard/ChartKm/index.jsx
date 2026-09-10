import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

function ChartKm({ props }) {
  return (
    <article className="rounded-[9px] bg-white p-[32px]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="m-0 text-[21px] font-normal text-[#1737ee]">{props.avgKm}km en moyenne</h3>
        </div>
        <div className="flex items-center gap-[7px] pt-[8px] text-[11px] whitespace-nowrap">
          <button
            type="button"
            onClick={props.goToPrevWeek(props.setKmWindowEnd)}
            disabled={props.kmWindowEnd <= props.INITIAL_WEEK_START}
            className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
          >‹</button>
          <span>{props.getKmRangeLabel(props.kmWindowEnd)}</span>
          <button
            type="button"
            onClick={props.goToNextWeek(props.setKmWindowEnd)}
            disabled={props.kmWindowEnd >= props.latestWeekStart}
            className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
          >›</button>
        </div>
      </div>
      <p className="mt-[8px] text-[13px] text-[#777] mb-[24px]">Total des kilomètres 4 dernières semaines</p>
      <BarChart style={{ /*width: "330px",*/ height: "307px", fontSize: "12px" }} responsive={true} data={props.dataKm}>
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="Km" fill="#B6BDFC" barSize={14} radius={14} />
        <XAxis dataKey="name" margin="10px" />
        <YAxis width="auto" niceTicks="snap125" />
        <Legend />
      </BarChart>
    </article>

  );
}

export default ChartKm;