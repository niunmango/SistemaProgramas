<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '../lib/pb';
  import { getLoggedInUser, logout } from '../lib/auth';
  import type { User } from '../lib/pb';
  
  // Component imports
  import Login from '../lib/components/Login.svelte';
  import DocenteDashboard from '../lib/components/DocenteDashboard.svelte';
  import DaaDashboard from '../lib/components/DaaDashboard.svelte';
  import AuditorDashboard from '../lib/components/AuditorDashboard.svelte';
  import GestionDashboard from '../lib/components/GestionDashboard.svelte';
  import VisualizadorDashboard from '../lib/components/VisualizadorDashboard.svelte';

  // State
  let user = $state<User | null>(null);
  let initialized = $state(false);
  let daaActiveTab = $state<'notificar' | 'auditar'>('notificar');

  onMount(() => {
    // Check if user is already logged in
    user = getLoggedInUser();
    initialized = true;

    // Listen for auth store changes to sync login/logout state automatically
    pb.authStore.onChange((token, model) => {
      user = getLoggedInUser();
    });
  });

  function handleLoginSuccess(loggedInUser: User) {
    user = loggedInUser;
  }

  function handleLogout() {
    logout();
    user = null;
  }

  function formatRole(role: string): string {
    switch (role) {
      case 'docente': return 'Docente Creador';
      case 'd_carrera': return 'Director/a de Carrera';
      case 'd_escuela': return 'Director/a de Escuela';
      case 'daa': return 'Dirección de Asuntos Académicos (DAA)';
      case 'gestion': return 'Gestor del Sistema';
      case 'visualizador': return 'Visualizador Público';
      default: return role;
    }
  }
</script>

<svelte:head>
  <title>Sistema de Gestión de Programas Analíticos (SPA)</title>
  <meta name="description" content="Gestión oficial de programas académicos universitarios." />
</svelte:head>

{#if !initialized}
  <!-- Loading screen while checking auth -->
  <div class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
    <div class="flex flex-col items-center gap-3">
      <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-xs text-slate-400 font-medium">Iniciando aplicación...</span>
    </div>
  </div>
{:else if !user}
  <!-- Login view -->
  <Login onLoginSuccess={handleLoginSuccess} />
{:else}
  <!-- Main layout for logged-in users -->
  <div class="min-h-screen flex flex-col bg-radial from-slate-900 to-slate-950 text-slate-100 font-sans">
    
    <!-- Global Header -->
    <header class="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
        </div>
        <div>
          <h1 class="text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
            SPA <span class="text-indigo-400 text-xs font-normal">Programas Analíticos</span>
          </h1>
          <span class="text-[10px] text-slate-500 font-medium">Universidad Nacional</span>
        </div>
      </div>

      <!-- User context info & Logout -->
      <div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-between sm:justify-end">
        <div class="text-left sm:text-right">
          <div class="font-bold text-xs text-slate-200">{user.name}</div>
          <div class="text-[10px] text-slate-400 font-medium flex flex-wrap items-center gap-1.5 sm:justify-end">
            <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[9px] uppercase font-bold tracking-wide">
              {formatRole(user.role)}
            </span>
            {#if user.carrera}
              <span class="text-slate-500">|</span>
              <span class="text-slate-400 italic">{user.carrera}</span>
            {/if}
            {#if user.escuela}
              <span class="text-slate-500">|</span>
              <span class="text-slate-400 italic">{user.escuela}</span>
            {/if}
          </div>
        </div>

        <button 
          onclick={handleLogout}
          class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors text-xs font-bold cursor-pointer"
        >
          Salir
        </button>
      </div>
    </header>

    <!-- Navigation Tab for DAA who has dual roles (Notificador & Auditor) -->
    {#if user.role === 'daa'}
      <div class="bg-slate-900/40 border-b border-slate-850 px-6 py-2 flex gap-3 text-xs">
        <button 
          onclick={() => daaActiveTab = 'notificar'}
          class="px-4 py-2 font-bold rounded-lg transition-colors cursor-pointer"
          class:bg-indigo-650={daaActiveTab === 'notificar'}
          class:text-white={daaActiveTab === 'notificar'}
          class:text-slate-400={daaActiveTab !== 'notificar'}
          class:hover:text-slate-200={daaActiveTab !== 'notificar'}
        >
          Notificar Docentes
        </button>
        <button 
          onclick={() => daaActiveTab = 'auditar'}
          class="px-4 py-2 font-bold rounded-lg transition-colors cursor-pointer"
          class:bg-indigo-650={daaActiveTab === 'auditar'}
          class:text-white={daaActiveTab === 'auditar'}
          class:text-slate-400={daaActiveTab !== 'auditar'}
          class:hover:text-slate-200={daaActiveTab !== 'auditar'}
        >
          Bandeja de Auditoría
        </button>
      </div>
    {/if}

    <!-- Dashboard Main Area -->
    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
      {#if user.role === 'docente'}
        <DocenteDashboard {user} />
      {:else if user.role === 'd_carrera' || user.role === 'd_escuela'}
        <AuditorDashboard {user} />
      {:else if user.role === 'daa'}
        {#if daaActiveTab === 'notificar'}
          <DaaDashboard />
        {:else}
          <AuditorDashboard {user} />
        {/if}
      {:else if user.role === 'gestion'}
        <GestionDashboard />
      {:else if user.role === 'visualizador'}
        <VisualizadorDashboard />
      {/if}
    </main>

    <!-- Global Footer -->
    <footer class="bg-slate-900/35 border-t border-slate-850 text-center py-4 text-[10px] text-slate-500">
      SPA - Sistema de Gestión de Programas Analíticos © 2026. Universidad Nacional. Todos los derechos reservados.
    </footer>

  </div>
{/if}
