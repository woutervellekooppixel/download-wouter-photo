// lib/auth.ts
export function basicAuthCheck(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;

  const base64Credentials = auth.split(" ")[1];
  const credentials = atob(base64Credentials).split(":");
  const [username, password] = credentials;

  return (
    username === process.env.NEXT_PUBLIC_LOGIN_USERNAME &&
    password === process.env.NEXT_PUBLIC_LOGIN_PASSWORD
  );
}