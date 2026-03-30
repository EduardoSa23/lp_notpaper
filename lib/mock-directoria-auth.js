export const AUTH_COOKIE_NAME = "notpaper_directoria_auth";

export const MOCK_DIRETORIA_CREDENTIALS = {
  login: "admin",
  senha: "@SiloPrime_2611#",
};

export const MOCK_DIRETORIA_SESSION_TOKEN = "mock-directoria-session-token";
export const DIRETORIA_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function isValidDirectoriaCredentials(login, senha) {
  return login === MOCK_DIRETORIA_CREDENTIALS.login && senha === MOCK_DIRETORIA_CREDENTIALS.senha;
}
