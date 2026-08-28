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
    <>
      <section className="w-[500px]">

        <article className="flex h-[161px] items-center rounded-[10px] bg-white px-[32px]">
          <img
            src={data.profile.profilePicture}
            alt={`Photo de profil de ${data.profile.firstName} ${data.profile.lastName}`}
            className="h-[114px] w-[102px] rounded-[9px] object-cover"
          />

          <div className="ml-[25px]">
            <h1 className="m-0 text-[24px] font-normal leading-none">
              {data.profile.firstName} {data.profile.lastName}
            </h1>
            <p className="mt-[8px] text-[15px] text-[#777]">
              Membre depuis le {data.profile.createdAt}
            </p>
          </div>
        </article>

        <article className="mt-[16px] h-[325px] rounded-[10px] bg-white px-[28px] pt-[39px]">

          <h2 className="m-0 text-[24px] font-normal">
            Votre profil
          </h2>

          <div className="mt-[22px] h-px w-full bg-[#dedede]"></div>

          <div className="mt-[29px] space-y-[23px] text-[16px] text-[#777]">
            <p className="m-0">Âge : {data.profile.age} ans</p>
            <p className="m-0 line-through">Genre : Femme</p>
            <p className="m-0">Taille : {data.profile.height} cm</p>
            <p className="m-0">Poids : {data.profile.weight} kg</p>
          </div>

        </article>
      </section>

      <section className="w-[562px]">

        <h2 className="m-0 text-[24px] font-normal">
          Vos statistiques
        </h2>

        <p className="mt-[7px] text-[15px] text-[#777]">
          depuis le {data.profile.createdAt}
        </p>

        <div className="mt-[31px] grid grid-cols-2 gap-[18px]">

          <article className="h-[102px] rounded-[10px] bg-[#1737ee] px-[30px] pt-[21px] text-white">
            <p className="m-0 text-[14px]">
              Temps total couru
            </p>
            <p className="mt-[9px] m-0 text-[23px]">
              {data.statistics.totalDuration} min
              <span className="ml-[5px] text-[15px]">15min</span>
            </p>
          </article>

          <article className="line-through h-[102px] rounded-[10px] bg-[#1737ee] px-[30px] pt-[21px] text-white">
            <p className="m-0 text-[14px]">
              Calories brûlées
            </p>
            <p className="mt-[9px] m-0 text-[23px]">
              25000<span className="ml-[5px] text-[15px]">cal</span>
            </p>
          </article>

          <article className="h-[102px] rounded-[10px] bg-[#1737ee] px-[30px] pt-[21px] text-white">
            <p className="m-0 text-[14px]">
              Distance totale parcourue
            </p>
            <p className="mt-[9px] m-0 text-[23px]">
              {data.statistics.totalDistance}<span className="ml-[5px] text-[15px]">km</span>
            </p>
          </article>

          <article className="line-through h-[102px] rounded-[10px] bg-[#1737ee] px-[30px] pt-[21px] text-white">
            <p className="m-0 text-[14px]">
              Nombre de jours de repos
            </p>
            <p className="mt-[9px] m-0 text-[23px]">
              9<span className="ml-[5px] text-[15px]">jours</span>
            </p>
          </article>

          <article className="h-[102px] rounded-[10px] bg-[#1737ee] px-[30px] pt-[21px] text-white">
            <p className="m-0 text-[14px]">
              Nombre de sessions
            </p>
            <p className="mt-[9px] m-0 text-[23px]">
              {data.statistics.totalSessions}<span className="ml-[5px] text-[15px]">sessions</span>
            </p>
          </article>

        </div>
      </section>
    </>
  )
}

export default Profile
