function Profile({ profile }) {
  return (
    <section className="flex h-[168px] items-center rounded-[18px] bg-white px-[40px]">
      <img
        src={profile.profilePicture}
        alt={`Photo de profil de ${profile.firstName} ${profile.lastName}`}
        className="h-[118px] w-[104px] rounded-[9px] object-cover" />
      <div className="ml-[38px]">
        <h1 className="m-0 text-[22px] font-normal leading-[1.1]">{profile.firstName} {profile.lastName}</h1>
        <p className="mt-[6px] text-[15px] text-[#777]">Membre depuis le {profile.createdAt}</p>
      </div>

      <div className="ml-auto flex items-center gap-[17px]">
        <span className="text-[14px] text-[#777]">Distance totale parcourue</span>
        <div className="flex h-[91px] w-[183px] items-center justify-center rounded-[9px] bg-[#1737ee]">
          <p className="mt-[9px] m-0 text-[23px] text-white">
            {profile.totalDistance}<span className="ml-[5px] text-[15px]">km</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Profile;