export default function getCookie(name: string, cookies?: string) {
  return cookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith(`${name}=`))
    ?.replace(`${name}=`, "");
}
