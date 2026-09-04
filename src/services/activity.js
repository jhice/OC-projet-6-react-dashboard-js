// Transformation des sessions d'activité (public/activity_sessions.json, ou
// GET /api/user-activity) vers les jeux de données attendus par les 3 charts
// Recharts du Dashboard : dataKm, dataBpm, dataGoals.
//
// Fonctions pures : elles reçoivent le tableau de sessions et renvoient le
// tableau prêt à passer à <BarChart data={...} />. Aucun réseau, aucun hook,
// donc réutilisables et testables.
//
// Forme d'une session en entrée :
//   {
//     date: "2025-01-04",
//     distance: 5.8,            // km
//     duration: 38,             // min
//     heartRate: { min: 140, max: 178, average: 163 },
//     caloriesBurned: 422
//   }

// Objectif de courses par semaine : n'existe dans aucun JSON pour l'instant.
export const WEEKLY_GOAL = 6;

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const round1 = (n) => Math.round(n * 10) / 10;

/**
 * "2025-01-04" -> Date locale à minuit.
 * On parse à la main : new Date("2025-01-04") est interprété en UTC et peut
 * faire glisser le jour de la semaine selon le fuseau.
 */
function parseDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Lundi 00:00 de la semaine (lundi -> dimanche) contenant `date`. */
export function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = dimanche ... 6 = samedi
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  return d;
}

/** Nouvelle date = `date` + `days` jours. */
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** true si `date` appartient à l'intervalle [start, start + 7 jours[. */
function isInWeek(date, start) {
  return date >= start && date < addDays(start, 7);
}

/**
 * "30/12", pour l'affichage des widgets de plage de dates.
 * Format numérique compact : les noms de mois ("30 décembre") font passer
 * les libellés de plage sur 2 lignes dans la carte étroite du graphe Km
 * (330px) et désalignent les boutons ‹ ›.
 */
export function formatDateFr(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

/** Libellé de la plage affichée par le graphe Km (fenêtre de `weeks` semaines se terminant à `windowEnd`). */
export function getKmRangeLabel(windowEnd, weeks = 4) {
  const start = addDays(windowEnd, -(weeks - 1) * 7);
  const end = addDays(windowEnd, 6);
  return `${formatDateFr(start)} - ${formatDateFr(end)}`;
}

/** Libellé de la plage affichée par le graphe BPM (une semaine commençant à `weekStart`). */
export function getWeekRangeLabel(weekStart) {
  return `${formatDateFr(weekStart)} - ${formatDateFr(addDays(weekStart, 6))}`;
}

/**
 * Date de référence = date de la session la plus récente du jeu de données.
 * Sert de « maintenant » pour « cette semaine » et « les 4 dernières semaines ».
 */
export function getReferenceDate(sessions) {
  return sessions
    .map((s) => parseDate(s.date))
    .reduce((latest, d) => (d > latest ? d : latest));
}

/**
 * dataKm — somme des kilomètres par semaine, sur `weeks` semaines se terminant
 * à `windowEnd` (par défaut, la semaine de la dernière session).
 * -> [{ name: "S1", Km: 9 }, ... ] , S1 = la plus ancienne.
 */
export function toKmData(sessions, { weeks = 4, windowEnd } = {}) {
  const currentWeekStart =
    windowEnd ?? (sessions?.length ? startOfWeek(getReferenceDate(sessions)) : null);

  return Array.from({ length: weeks }, (_, i) => {
    if (!currentWeekStart) {
      return { name: `S${i + 1}`, Km: 0 };
    }
    const weekStart = addDays(currentWeekStart, (i - (weeks - 1)) * 7);
    const km = sessions
      .filter((s) => isInWeek(parseDate(s.date), weekStart))
      .reduce((sum, s) => sum + s.distance, 0);
    return { name: `S${i + 1}`, Km: round1(km) };
  });
}

/**
 * dataBpm — fréquence cardiaque sur une semaine (`weekStart`, par défaut la
 * semaine de la dernière session), un point par jour réel (Lun -> Dim).
 * Jour sans session = valeurs à null (Recharts saute le point / la barre).
 * -> [{ name: "Lun", minBpm: 140, maxBpm: 178, averageBpm: 163 }, ... ]
 */
export function toHeartRateData(sessions, { weekStart } = {}) {
  const start =
    weekStart ?? (sessions?.length ? startOfWeek(getReferenceDate(sessions)) : null);

  return DAY_LABELS.map((name, i) => {
    const session =
      start &&
      sessions?.find(
        (s) => parseDate(s.date).getTime() === addDays(start, i).getTime()
      );

    if (!session) {
      return { name, minBpm: null, maxBpm: null, averageBpm: null };
    }
    return {
      name,
      minBpm: session.heartRate.min,
      maxBpm: session.heartRate.max,
      averageBpm: session.heartRate.average,
    };
  });
}

/** Sessions de la semaine de la dernière session (« cette semaine »). */
function getCurrentWeekSessions(sessions) {
  if (!sessions?.length) return [];
  const weekStart = startOfWeek(getReferenceDate(sessions));
  return sessions.filter((s) => isInWeek(parseDate(s.date), weekStart));
}

/**
 * dataGoals — courses réalisées vs restantes sur la semaine de la dernière
 * session, par rapport à WEEKLY_GOAL.
 * -> [{ label: "réalisés", value, fill }, { label: "restants", value, fill }]
 */
export function toGoalsData(sessions) {
  const done = getCurrentWeekSessions(sessions).length;

  return [
    { label: "réalisés", value: Math.min(done, WEEKLY_GOAL), fill: "#0B23F4" },
    { label: "restants", value: Math.max(WEEKLY_GOAL - done, 0), fill: "#B6BDFC" },
  ];
}

/**
 * Durée (min) et distance (km) cumulées sur la semaine de la dernière
 * session (« cette semaine », même semaine que toGoalsData).
 * -> { duration: 140, distance: 21.7 }
 */
export function getWeekStats(sessions) {
  const weekSessions = getCurrentWeekSessions(sessions);
  return {
    duration: weekSessions.reduce((sum, s) => sum + s.duration, 0),
    distance: round1(weekSessions.reduce((sum, s) => sum + s.distance, 0)),
  };
}

