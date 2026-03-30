import IdleLogoutHandler from "@/components/login-diretoria/idle-logout-handler";
import DiretoriaDashboard from "@/components/login-diretoria/diretoria-dashboard";

export const metadata = {
  title: "Area da Diretoria | notPaper",
  description: "Area autenticada da diretoria.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiretoriaPage() {
  return (
    <>
      <IdleLogoutHandler />
      <DiretoriaDashboard />
    </>
  );
}
