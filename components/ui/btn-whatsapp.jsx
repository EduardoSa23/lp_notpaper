export function BtnWhatsapp({
  children,
  href = "https://api.whatsapp.com/send?phone=5511941398031&text=Olá",
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-3xl bg-[#0043FE] px-3 py-2 md:px-4 font-semibold text-white transition-all duration-300 hover:bg-[#0135c5] hover:scale-[1.03]";

    return (
      <a href={href} target="_blank" rel="noreferrer">
        <button className={`${baseStyles} ${className}`}>
          {children}
        </button>
      </a>
    );
}