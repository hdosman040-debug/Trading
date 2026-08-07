import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { NavBar } from '../components/layout/nav-bar';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <NavBar />
      <main className="pb-12">
        <Outlet />
      </main>
    </div>
  ),
});
