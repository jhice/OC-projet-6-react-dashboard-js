import { useContext, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { LoginContext } from '../../utils/context';
import {
  toKmData, toHeartRateData, toGoalsData, WEEKLY_GOAL,
  startOfWeek, addDays, getReferenceDate, getKmRangeLabel, getWeekRangeLabel,
  getWeekStats, getCurrentWeekLabel,
  getAvgKm,
  getBpmAverages,
  getAvgBpm,
} from '../../services/activity';
import Profile from './Profile';
import ChartKm from './ChartKm';
import ChartBpm from './ChartBpm';
import ChartWeek from './ChartWeek';
import WeekStats from './WeekStats';

// point de départ des widgets de dates des 2 premiers graphes
const INITIAL_WEEK_START = startOfWeek(new Date(2025, 0, 1));

function Dashboard() {

  const { profile } = useContext(LoginContext);
  // console.log(profile);
  
  // l'API charge toutes les données d'un coup (2 ans)
  const { data, error } = useFetch(`http://localhost:8000/api/user-activity?startWeek=2025-01-01&endWeek=2026-12-31`);

  // fenêtre affichée par chaque graphe : le lundi de sa semaine la plus récente
  const [kmWindowEnd, setKmWindowEnd] = useState(INITIAL_WEEK_START);
  const [bpmWeekStart, setBpmWeekStart] = useState(INITIAL_WEEK_START);

  if (error) {
    return <span>Il y a un problème</span>;
  }

  if (!data || !profile) {
    return <p className='text-center text-[24px] pt-20'>Loading...</p>;
  }

  // data = tableau de sessions (cf. public/activity_sessions.json)
  // kms
  const dataKm = toKmData(data, { windowEnd: kmWindowEnd });
  // bpms
  const dataBpm = toHeartRateData(data, { weekStart: bpmWeekStart });
  // objectifs semaine
  const dataGoals = toGoalsData(data);
  // objectifs complétés (valeur du premier élément reçu {value: xxx})
  const goalsCompleted = dataGoals[0].value;
  // durée et distance pour la semaine
  const weekStats = getWeekStats(data);

  // moyennes affichées dans les en-têtes, calculées sur ce qui est
  // effectivement affiché dans chaque graphe (donc sensibles à la pagination)

  // sommes de kms affichés (dataKm) / nombre de sessions affichées
  const avgKm = getAvgKm(dataKm);
  // tableau des valeurs de bpm non vides
  const bpmAverages = getBpmAverages(dataBpm);
  // si on a des bpms sur cette semaine, sommes des bpms affichés (avgBpm) / nombres de sessions affichées
  const avgBpm = getAvgBpm(bpmAverages);

  // on ne peut pas remonter avant le 1er janvier 2025, ni dépasser la semaine
  // de la session la plus récente disponible dans les données chargées
  const latestWeekStart = data.length ? startOfWeek(getReferenceDate(data)) : INITIAL_WEEK_START;

  // modification de la fenêtre, en passant le setter du state, puis on joue avec les jours pour avancer ou reculer d'une semaine
  const goToPrevWeek = (setWindow) => () =>
    // on retire 7 jours si on a pas atteint la borne inférieure des données
    setWindow((current) => (current > INITIAL_WEEK_START ? addDays(current, -7) : current));
  const goToNextWeek = (setWindow) => () =>
    // on ajoute 7 jours si on a pas atteint la borne max des données
    setWindow((current) => (current < latestWeekStart ? addDays(current, 7) : current));
  // le composant React sera rendu à nouveau après modification de la fenêtre (date)

  // propos
  const chartKmProps = { dataKm, avgKm, setKmWindowEnd, goToPrevWeek, goToNextWeek, getKmRangeLabel, kmWindowEnd, INITIAL_WEEK_START, latestWeekStart };
  const chartBpmProps = { dataBpm, avgBpm, goToPrevWeek, goToNextWeek, getWeekRangeLabel, bpmWeekStart, setBpmWeekStart, INITIAL_WEEK_START, latestWeekStart };
  const chartWeekProps = { goalsCompleted, WEEKLY_GOAL, dataGoals };

  return (
    <main className="mx-auto flex max-w-[1140px] justify-between p-4">
      <div className="mx-auto flex flex-col w-full justify-between">
        <Profile userData={profile} />
        <section className="mt-[104px]">
          <h2 className="m-0 text-[21px] font-normal">Vos dernières performances</h2>
          <div className="mt-[21px] grid grid-cols-[0.77fr_1fr] gap-[24px]">
            <ChartKm props={chartKmProps} />
            <ChartBpm props={chartBpmProps} />
          </div>
        </section>
        <section className="mt-[64px] mb-[120px]">
          <h2 className="m-0 text-[21px] font-normal">Cette semaine</h2>
          <p className="mt-[7px] text-[15px] text-[#777]">{getCurrentWeekLabel()}</p>

          <div className="mt-[21px] grid grid-cols-[0.77fr_1fr] gap-[24px]">
            <ChartWeek props={chartWeekProps} />
            <div className="flex flex-col gap-[16px]">
              <WeekStats weekStats={weekStats} />
            </div>
          </div>
        </section>
      </div >
    </main>
  );
}

export default Dashboard;