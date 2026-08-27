import { useFetch } from "../../hooks/useFetch"

function Profile() {

  // le state de data est suivi depuis useEffect() ?
  const { data, error } = useFetch(`http://localhost:8000/api/user-info`)
  // console.log(data);

  if (error) {
    return <span>Il y a un problème</span>
  }

  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <div style={{ display: "flex", gap: "100px" }}>
      <section>
        <h1>Profil</h1>
        <div>{data.profile.firstName} {data.profile.lastName}</div>
        <div>Membre depuis le {data.profile.createdAt}</div>
        <div>Âge : {data.profile.age}</div>
        <div>Poids : {data.profile.weight} kg</div>
        <div>Taille : {data.profile.height} cm</div>
        <div><img height={200} src={data.profile.profilePicture} alt="Image de profil" /></div>
      </section>
      <section>
        <h2>Vos statistiques</h2>
        <div>Depuis le {data.profile.createdAt}</div>
        <div>Temps total couru {data.statistics.totalDuration} min</div>
        <div>Distance totale parcourue {data.statistics.totalDistance} km</div>
        <div>Nombre de sessions {data.statistics.totalSessions} sessions</div>
      </section>
    </div>
  )
}

export default Profile
