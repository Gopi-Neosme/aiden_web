// app/page.tsx
import { redirect } from 'next/navigation';
import "@/styles/globals.css";

//app   
export default function RootPage() {
  redirect('/dashboard');
}