function WeekStats({ weekStats }) {
  return (
    <>
      <article className="rounded-[9px] bg-white px-[30px] py-[21px]">
        <p className="m-0 text-[13px] text-[#777]">Durée d’activité</p>
        <p className="mt-[10px] m-0 text-[20px] text-[#1737ee]">{weekStats.duration} <span className="text-[14px] text-[#aeb9ff]">minutes</span></p>
      </article>
      <article className="rounded-[9px] bg-white px-[30px] py-[21px]">
        <p className="m-0 text-[13px] text-[#777]">Distance</p>
        <p className="mt-[10px] m-0 text-[20px] text-[#f03218]">{weekStats.distance} <span className="text-[14px] text-[#f7b7ac]">kilomètres</span></p>
      </article>

    </>
  );
}

export default WeekStats;