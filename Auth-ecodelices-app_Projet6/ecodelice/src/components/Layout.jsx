import React from 'react';
import Header from './Header';  // Ton Header modifié avec styles et navigation visible
import Footer from './Footer';  // Footer simple ou personnalisé

export default function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
