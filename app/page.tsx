import { redirect } from 'next/navigation';

// ...

if (!download) {
  redirect('https://wouter.photo');
}
