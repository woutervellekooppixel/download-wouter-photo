import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Suspense fallback={<p className="text-white">Laden...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}