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
  // conversion tableau de chaines en tableau de nombres
  const [year, month, day] = iso.split("-").map(c => Number(c));
  // nouvel object date manipulable
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
  // S1 : on retire 4 semaines en jours
  const start = addDays(windowEnd, -(weeks - 1) * 7);
  // S4 : on va jusqu'au denrier jour de la semaine
  const end = addDays(windowEnd, 6);
  return `${formatDateFr(start)} - ${formatDateFr(end)}`;
}

/** Libellé de la plage affichée par le graphe BPM (une semaine commençant à `weekStart`). */
export function getWeekRangeLabel(weekStart) {
  // premier jour de la semaine - dernier jour de la semaine
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
  // console.log(currentWeekStart);

  // équivalent d'une boucle for sur les 4 semaines
  return Array.from({ length: weeks }, (_, i) => {
    // si pas de données
    if (!currentWeekStart) {
      return { name: `S${i + 1}`, Km: 0 };
    }
    // début de la semaine qui correspond à la boucle (de 0 à 3)
    const weekStart = addDays(currentWeekStart, (i - (weeks - 1)) * 7);
    // cumul des kilomètres de la semaine parcourue
    const km = sessions
      // on filtre les sessions JSON contenues dans la semaine
      .filter((s) => isInWeek(parseDate(s.date), weekStart))
      // sommes des kms à partir de 0 + les kms des sessions filtrées
      .reduce((sum, s) => sum + s.distance, 0);
    // objet attendu par Recharts
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
  // en théorie notre date de départ en dur, donc start = weekStart
  const start =
    weekStart ?? (sessions?.length ? startOfWeek(getReferenceDate(sessions)) : null);

  // pour chaque jour de ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  return DAY_LABELS.map((name, i) => {
    // session qui correspond au jour parcouru
    const session =
      // une date de démarage est nécessaire
      start &&
      // on va chercher la session qui correspond à l'index du tableau des jours
      sessions?.find(
        (s) => parseDate(s.date).getTime() === addDays(start, i).getTime()
      );

    // si aucune session/journée trouvée
    if (!session) {
      // on retourne des données valides mais à null pour Recharts
      return { name, minBpm: null, maxBpm: null, averageBpm: null };
    }
    // données pour la session/journée trouvée
    return {
      name,
      minBpm: session.heartRate.min,
      maxBpm: session.heartRate.max,
      averageBpm: session.heartRate.average,
    };
  });
}

/**
 * Sessions de « cette semaine » : la vraie semaine calendaire en cours
 * (contrairement aux graphes Km/BPM, cette section n'est pas paginable).
 */
function getCurrentWeekSessions(sessions) {
  // aucune session
  if (!sessions?.length) return [];
  const weekStart = startOfWeek(new Date());
  // sessions contenues dans la semaine courante
  return sessions.filter((s) => isInWeek(parseDate(s.date), weekStart));
}

/**
 * dataGoals — courses réalisées vs restantes cette semaine (vraie semaine
 * calendaire en cours), par rapport à WEEKLY_GOAL.
 * -> [{ label: "réalisés", value, fill }, { label: "restants", value, fill }]
 */
export function toGoalsData(sessions) {
  // nombre de sessions cette semaine
  const done = getCurrentWeekSessions(sessions).length;
  // retour des infos utiles pour Recharts
  return [
    { label: "réalisés", value: Math.min(done, WEEKLY_GOAL), fill: "#0B23F4" },
    { label: "restants", value: Math.max(WEEKLY_GOAL - done, 0), fill: "#B6BDFC" },
  ];
}

/**
 * Durée (min) et distance (km) cumulées cette semaine (même semaine que
 * toGoalsData).
 * -> { duration: 140, distance: 21.7 }
 */
export function getWeekStats(sessions) {
  // sessions de la semaine
  const weekSessions = getCurrentWeekSessions(sessions);
  // données attendues par Recharts
  return {
    // somme des durées
    duration: weekSessions.reduce((sum, s) => sum + s.duration, 0),
    // somme des distance (arrondie)
    distance: round1(weekSessions.reduce((sum, s) => sum + s.distance, 0)),
  };
}

/** "23/06/2025", pour l'en-tête "Du ... au ..." de la section "Cette semaine". */
function formatFullDateFr(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/** "Du 23/06/2025 au 29/06/2025" — plage de la vraie semaine calendaire en cours. */
export function getCurrentWeekLabel() {
  // semaine courante
  const start = startOfWeek(new Date());
  // + 6 jours
  const end = addDays(start, 6);
  // retour formaté
  return `Du ${formatFullDateFr(start)} au ${formatFullDateFr(end)}`;
}

/**
 * calculs pour les données des composants
 */
export function getAvgKm(dataKm) {
  return Math.round(dataKm.reduce((sum, d) => sum + d.Km, 0) / dataKm.length);
}

export function getBpmAverages(dataBpm) {
  return dataBpm.map((d) => d.averageBpm).filter((v) => v != null);
}

export function getAvgBpm(bpmAverages) {
  return bpmAverages.length
    ? Math.round(bpmAverages.reduce((sum, v) => sum + v, 0) / bpmAverages.length)
    // sinon vide
    : null;
}