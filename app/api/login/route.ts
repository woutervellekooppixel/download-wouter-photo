import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.LOGIN_USERNAME &&
    password === process.env.LOGIN_PASSWORD
  ) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('auth', password, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 uur
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}