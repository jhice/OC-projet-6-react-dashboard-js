function Footer() {

  return (
    <footer className="fixed bottom-0 left-0 flex h-[46px] w-full items-center bg-white">
      <div className="mx-auto flex w-[1140px] items-center justify-between px-[10px] text-[13px]">
        <span>
          ©Sportsee&nbsp;&nbsp; Tous droits réservés
        </span>

        <div className="flex items-center gap-[20px]">
          <a href="#" className="text-[#171717] no-underline">
            Conditions générales
          </a>
          <a href="#" className="text-[#171717] no-underline">
            Contact
          </a>

          <span className="flex items-center gap-[2px]" aria-hidden="true">
            <i className="h-[14px] w-[3px] rounded-full bg-[#ff5a52]"></i>
            <i className="h-[19px] w-[3px] rounded-full bg-[#ff5a52]"></i>
            <i className="h-[12px] w-[3px] rounded-full bg-[#ff5a52]"></i>
            <i className="h-[17px] w-[3px] rounded-full bg-[#ff5a52]"></i>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer