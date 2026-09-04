import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { useFetch } from '../../hooks/useFetch';
import {
  toKmData, toHeartRateData, toGoalsData, WEEKLY_GOAL,
  startOfWeek, addDays, getReferenceDate, getKmRangeLabel, getWeekRangeLabel,
  getWeekStats, getCurrentWeekLabel,
} from '../../services/activity';

// point de départ des widgets de dates des 2 premiers graphes
const INITIAL_WEEK_START = startOfWeek(new Date(2025, 0, 1));

function Dashboard() {

  const { data, error } = useFetch(`http://localhost:8000/api/user-activity?startWeek=2025-01-01&endWeek=2026-12-31`);

  // fenêtre affichée par chaque graphe : le lundi de sa semaine la plus récente
  const [kmWindowEnd, setKmWindowEnd] = useState(INITIAL_WEEK_START);
  const [bpmWeekStart, setBpmWeekStart] = useState(INITIAL_WEEK_START);

  if (error) {
    return <span>Il y a un problème</span>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  // data = tableau de sessions (cf. public/activity_sessions.json)
  const dataKm = toKmData(data, { windowEnd: kmWindowEnd });
  const dataBpm = toHeartRateData(data, { weekStart: bpmWeekStart });
  const dataGoals = toGoalsData(data);
  const goalsCompleted = dataGoals[0].value;
  const weekStats = getWeekStats(data);

  // moyennes affichées dans les en-têtes, calculées sur ce qui est
  // effectivement affiché dans chaque graphe (donc sensibles à la pagination)
  const avgKm = Math.round(dataKm.reduce((sum, d) => sum + d.Km, 0) / dataKm.length);
  const bpmAverages = dataBpm.map((d) => d.averageBpm).filter((v) => v != null);
  const avgBpm = bpmAverages.length
    ? Math.round(bpmAverages.reduce((sum, v) => sum + v, 0) / bpmAverages.length)
    : null;

  // on ne peut pas remonter avant le 1er janvier 2025, ni dépasser la semaine
  // de la session la plus récente disponible dans les données chargées
  const latestWeekStart = data.length ? startOfWeek(getReferenceDate(data)) : INITIAL_WEEK_START;

  const goToPrevWeek = (setWindow) => () =>
    setWindow((current) => (current > INITIAL_WEEK_START ? addDays(current, -7) : current));
  const goToNextWeek = (setWindow) => () =>
    setWindow((current) => (current < latestWeekStart ? addDays(current, 7) : current));

  return (
    <main className="mx-auto flex w-[1140px] justify-between">
      <div className="mx-auto flex flex-col w-[1140px] justify-between">
        <section className="flex h-[168px] items-center rounded-[18px] bg-white px-[40px]">
          <img src="https://picsum.photos/id/177/200/200"
            alt="Photo de profil"
            className="h-[118px] w-[104px] rounded-[9px] object-cover" />
          <div className="ml-[38px]">
            <h1 className="m-0 text-[22px] font-normal leading-[1.1]">Clara Dupont</h1>
            <p className="mt-[6px] text-[15px] text-[#777]">Membre depuis le 1er janvier 1970</p>
          </div>

          <div className="ml-auto flex items-center gap-[17px]">
            <span className="text-[14px] text-[#777]">Distance totale parcourue</span>
            <div className="flex h-[91px] w-[183px] items-center justify-center rounded-[9px] bg-[#1737ee]">
              <p className="mt-[9px] m-0 text-[23px] text-white">
                999<span className="ml-[5px] text-[15px]">km</span>
              </p>
            </div>
          </div>
        </section>

        <section className="mt-[104px]">
          <h2 className="m-0 text-[21px] font-normal">Vos dernières performances</h2>

          <div className="mt-[21px] grid grid-cols-[0.77fr_1fr] gap-[24px]">

            <article className="rounded-[9px] bg-white p-[32px]">
              <div className="flex items-start justify-between mb-[24px]">
                <div>
                  <h3 className="m-0 text-[21px] font-normal text-[#1737ee]">{avgKm}km en moyenne</h3>
                  <p className="mt-[8px] text-[13px] text-[#777]">Total des kilomètres 4 dernières semaines</p>
                </div>
                <div className="flex items-center gap-[7px] pt-[1px] text-[11px] whitespace-nowrap">
                  <button
                    type="button"
                    onClick={goToPrevWeek(setKmWindowEnd)}
                    disabled={kmWindowEnd <= INITIAL_WEEK_START}
                    className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
                  >‹</button>
                  <span>{getKmRangeLabel(kmWindowEnd)}</span>
                  <button
                    type="button"
                    onClick={goToNextWeek(setKmWindowEnd)}
                    disabled={kmWindowEnd >= latestWeekStart}
                    className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
                  >›</button>
                </div>
              </div>
              <BarChart style={{ width: "330px", height: "307px", fontSize: "12px" }} responsive data={dataKm}>
                <CartesianGrid stroke="#f5f5f5" />
                <Bar dataKey="Km" fill="#B6BDFC" barSize={14} radius={14} />
                <XAxis dataKey="name" margin="10px" />
                <YAxis width="auto" niceTicks="snap125" />
                <Legend />
              </BarChart>
            </article>

            <article className="rounded-[9px] bg-white p-[32px]">
              <div className="flex items-start justify-between mb-[24px]">
                <div>
                  <h3 className="m-0 text-[21px] font-normal text-[#f03218]">{avgBpm ?? '–'} BPM</h3>
                  <p className="mt-[8px] text-[13px] text-[#777]">Fréquence cardiaque moyenne</p>
                </div>
                <div className="flex items-center gap-[7px] pt-[1px] text-[11px] whitespace-nowrap">
                  <button
                    type="button"
                    onClick={goToPrevWeek(setBpmWeekStart)}
                    disabled={bpmWeekStart <= INITIAL_WEEK_START}
                    className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
                  >‹</button>
                  <span>{getWeekRangeLabel(bpmWeekStart)}</span>
                  <button
                    type="button"
                    onClick={goToNextWeek(setBpmWeekStart)}
                    disabled={bpmWeekStart >= latestWeekStart}
                    className="h-[20px] w-[20px] rounded-full border border-[#999] text-[#555] disabled:opacity-40"
                  >›</button>
                </div>
              </div>
              <ComposedChart
                style={{ width: "503px", height: "307px", fontSize: "12px" }}
                responsive
                data={dataBpm}
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
          </div>
        </section>

        <section className="mt-[64px] mb-[120px]">
          <h2 className="m-0 text-[21px] font-normal">Cette semaine</h2>
          <p className="mt-[7px] text-[15px] text-[#777]">{getCurrentWeekLabel()}</p>

          <div className="mt-[21px] grid grid-cols-[0.77fr_1fr] gap-[24px]">

            <article className="h-[343px] rounded-[9px] bg-white p-[32px]">
              <h3 className="m-0 text-[21px] font-normal text-[#1737ee]">
                <strong>x{goalsCompleted}</strong> <span className="text-[14px] text-[#aeb9ff]">sur objectif de {WEEKLY_GOAL}</span>
              </h3>
              <p className="mt-[8px] mb-[24px] text-[13px] text-[#777]">Courses hebdomadaire réalisées</p>
              <PieChart
                style={{ width: '306px', height: '190px' }}
                responsive
              >
                <Pie
                  data={dataGoals}
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

            <div className="flex flex-col gap-[16px]">
              <article className="rounded-[9px] bg-white px-[30px] py-[21px]">
                <p className="m-0 text-[13px] text-[#777]">Durée d’activité</p>
                <p className="mt-[10px] m-0 text-[20px] text-[#1737ee]">{weekStats.duration} <span className="text-[14px] text-[#aeb9ff]">minutes</span></p>
              </article>
              <article className="rounded-[9px] bg-white px-[30px] py-[21px]">
                <p className="m-0 text-[13px] text-[#777]">Distance</p>
                <p className="mt-[10px] m-0 text-[20px] text-[#f03218]">{weekStats.distance} <span className="text-[14px] text-[#f7b7ac]">kilomètres</span></p>
              </article>
            </div>
          </div>
        </section>
      </div >
    </main>
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

export default Dashboard;