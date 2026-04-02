export function BtnWhatsapp({
  children,
  href = "https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F",
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-3xl bg-[#0043FE] px-3 py-2 md:px-4 font-semibold text-white transition-all duration-300 hover:bg-[#0135c5] hover:scale-[1.03]";

  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${baseStyles} ${className}`}>
      {children}
    </a>
  );
}
