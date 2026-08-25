import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, Pie, PieChart, XAxis, YAxis } from 'recharts';

const dataKm = [
  {
    name: 'S1',
    Km: 20,
  },
  {
    name: 'S2',
    Km: 25,
  },
  {
    name: 'S3',
    Km: 15,
  },
  {
    name: 'S4',
    Km: 30,
  },
];

const dataBpm = [
  {
    name: 'Lun',
    minBpm: 140,
    maxBpm: 178,
    averageBpm: 163,
  },
  {
    name: 'Mar',
    minBpm: 148,
    maxBpm: 184,
    averageBpm: 171,
  },
  {
    name: 'Mer',
    minBpm: 140,
    maxBpm: 176,
    averageBpm: 163,
  },
  {
    name: 'Jeu',
    minBpm: 138,
    maxBpm: 178,
    averageBpm: 162,
  },
  {
    name: 'Ven',
    minBpm: 141,
    maxBpm: 177,
    averageBpm: 165,
  },
  {
    name: 'Sam',
    minBpm: 143,
    maxBpm: 179,
    averageBpm: 166,
  },
  {
    name: 'Dim',
    minBpm: 146,
    maxBpm: 183,
    averageBpm: 170,
  },
];

const dataGoals = [
  {
    label: 'réalisés',
    value: 4,
    fill: "#0B23F4",
  },
  {
    label: 'restants',
    value: 2,
    fill: "#B6BDFC",
  },
]

function Dashboard() {

  return (
    <>
      <h1>Vos dernières performances</h1>
      <div style={{ display: "flex", gap: "100px" }}>
        <section>
          <h2>18 km en moyenne</h2>
          <p>Total des kilomètres 4 dernières semaines</p>
          <BarChart style={{ width: "330px", height: "307px", fontSize: "12px" }} responsive data={dataKm}>
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="Km" fill="#B6BDFC" barSize={14} radius={14} />
            <XAxis dataKey="name" margin="10px" />
            <YAxis width="auto" niceTicks="snap125" />
            {/* <Legend content={() => "🔵 Km"} /> */}
            <Legend />
          </BarChart>
        </section>
        <section>
          <h2>163 BPM</h2>
          <p>Fréquence cardiaque moyenne</p>
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
        </section>
        <section>
          <h2>Cette semaine</h2>
          <p>Du 23/06/2025 au 30/06/2025</p>
          <PieChart
            style={{ width: '306px', height: '190px', padding: "50px" }}
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
              // label={() => `🔵 ${dataGoals.name}`}
              isAnimationActive={true}
            />
          </PieChart>
        </section>
      </div>
    </>
  )
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
  )
};

export default Dashboard