import { Link } from "react-router";

function Error404() {
  return (
    <main className="mx-auto flex w-[1140px] justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl">Oups 🙈 Cette page n'existe pas</h1>
        <p className="mt-[1em]">La page que vous cherchez semble introuvable.</p>
        <Link to="/dashboard" className="mt-[1em] text-[#171717] underline hover:text-[#1737ee]">
          Retour au dashboard
        </Link>
      </div>
    </main>
  );
}

export default Error404;