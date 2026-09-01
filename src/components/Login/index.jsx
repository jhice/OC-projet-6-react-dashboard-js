import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoginContext } from "../../utils/context";
import LoginBg from "../../assets/images/login_bg.jpg"

async function loginUser(credentials) {

  let token = null
  let error = null

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      // 404
      if (response.status === 404) {
        throw new Error("Erreur de connexion au serveur")
      }
      // 400
      const data = await response.json();
      throw new Error(data.message)
    }

    token = await response.json();

  } catch (err) {
    // console.log(err)
    error = err
  }

  return { token, error }
}

function Login() {

  const { token, setToken } = useContext(LoginContext);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // si loggué, goto dashboard
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const { token, error } = await loginUser({
      username,
      password
    });

    if (error) {
      setMessage(error.message)
      return
    }

    setToken(token);
    navigate("/dashboard");
  }

  if (token) {
    return <p>Redirection...</p>;
  }

  return (
    <>
      <div className="flex min-h-screen w-full">

        <section className="relative min-w-[632px] bg-[#f1f3ff]">

          <div className="relative left-[100px] top-[54px] flex items-center gap-[5px]">
            <div className="flex items-center gap-[2px] h-[24px]" aria-hidden="true">
              <span className="w-[3px] h-[17px] rounded-full bg-[#ff5a52]"></span>
              <span className="w-[3px] h-[21px] rounded-full bg-[#ff5a52]"></span>
              <span className="w-[3px] h-[13px] rounded-full bg-[#ff5a52]"></span>
              <span className="w-[3px] h-[19px] rounded-full bg-[#ff5a52]"></span>
              <span className="w-[3px] h-[15px] rounded-full bg-[#ff5a52]"></span>
            </div>
            <span className="text-[28px] font-bold tracking-[-1.2px] text-[#1737ee]">
              SPORTSEE
            </span>
          </div>

          <section className="relative left-[100px] top-[180px] w-[398px] h-[617px] rounded-[18px] bg-white px-[40px] pt-[39px] shadow-none">

            <h1 className="m-0 text-[29px] leading-[1.15] font-bold tracking-[-0.7px] text-[#1737ee]">
              Transformez<br />
              vos stats en résultats
            </h1>

            <h2 className="mt-[43px] mb-0 text-[23px] leading-none font-normal text-[#171717]">
              Se connecter
            </h2>

            <form className="mt-[27px]" onSubmit={handleSubmit}>
              <label htmlFor="username" className="block text-[15px] leading-none text-[#777]">
                Nom d'utilisateur
              </label>
              <input
                onChange={e => setUserName(e.target.value)}
                id="username"
                type="username"
                className="mt-[9px] block h-[58px] w-full rounded-[10px] border border-[#bdbdbd] bg-white px-4 text-[17px] outline-none focus:border-[#1737ee] focus:ring-1 focus:ring-[#1737ee]"
              />

              <label htmlFor="password" className="mt-[26px] block text-[15px] leading-none text-[#777]">
                Mot de passe
              </label>
              <input
                onChange={e => setPassword(e.target.value)}
                id="password"
                type="password"
                className="mt-[9px] block h-[58px] w-full rounded-[10px] border border-[#bdbdbd] bg-white px-4 text-[17px] outline-none focus:border-[#1737ee] focus:ring-1 focus:ring-[#1737ee]"
              />

              <button
                type="submit"
                className="mt-[39px] h-[51px] w-full rounded-[10px] bg-[#142df0] text-[16px] font-normal text-white transition hover:bg-[#1025cf] focus:outline-none focus:ring-2 focus:ring-[#142df0] focus:ring-offset-2"
              >
                Se connecter
              </button>

              {message ? <p className="mt-[1em] text-red-500">{message}</p> : ""}

              <a
                href="#"
                className="mt-[41px] inline-block text-[15px] text-[#171717] no-underline hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </form>
          </section>

        </section>

        <section className="relative flex-1 min-w-0 bg-cover bg-right-top bg-no-repeat" style={{ backgroundImage: "url(" + LoginBg + ")" }} aria-label="Coureurs participant à une course">
          <div className="absolute bottom-[69px] right-[25px] w-[310px] rounded-full bg-white px-[20px] py-[15px] text-center shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
            <p className="m-0 text-[13px] leading-[1.4] text-[#1737ee]">
              Analysez vos performances en un clin d’œil,<br />
              suivez vos progrès et atteignez vos objectifs.
            </p>
          </div>
        </section>

      </div>
    </>
  )
}

export default Login
