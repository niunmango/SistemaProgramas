<!-- src/lib/components/Login.svelte -->
<script lang="ts">
  import { loginWithEmail } from '../auth';
  import type { User } from '../pb';

  interface Props {
    onLoginSuccess: (user: User) => void;
  }

  let { onLoginSuccess }: Props = $props();

  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let loading = $state(false);

  const testAccounts = [
    { email: "daa@example.com", name: "Laura (DAA)", role: "Notificador/a (DAA)" },
    { email: "docente@example.com", name: "Juan (Docente)", role: "Docente - Cs. Ambientales" },
    { email: "docente2@example.com", name: "Maria (Docente)", role: "Docente - Prof. Media" },
    { email: "director_carrera1@example.com", name: "Carlos (Dir. Carrera)", role: "Carrera - Cs. Ambientales" },
    { email: "director_carrera2@example.com", name: "Ana (Dir. Carrera)", role: "Carrera - Prof. Media" },
    { email: "director_escuela1@example.com", name: "Pedro (Dir. Escuela)", role: "Escuela - Cs. Naturales" },
    { email: "director_escuela2@example.com", name: "Marta (Dir. Escuela)", role: "Escuela - Humanidades" },
    { email: "gestion@example.com", name: "Sofia (Gestión)", role: "Gestión" },
    { email: "visualizador@example.com", name: "Luis (Visualizador)", role: "Visualizador Público" }
  ];

  async function handleLogin(e?: Event) {
    if (e) e.preventDefault();
    if (!email || !password) {
      errorMessage = "Por favor ingrese email y contraseña.";
      return;
    }
    
    loading = true;
    errorMessage = "";
    try {
      const user = await loginWithEmail(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      errorMessage = "Credenciales incorrectas o error de conexión.";
    } finally {
      loading = false;
    }
  }

  function quickLogin(targetEmail: string) {
    email = targetEmail;
    password = "password123";
    handleLogin();
  }
</script>

<div class="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-radial from-slate-900 to-slate-950 font-sans text-slate-100">
  <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
    
    <!-- Title / Branding -->
    <div class="md:col-span-5 text-center md:text-left space-y-4">
      <div class="inline-flex items-center justify-center p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/25 text-indigo-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><path d="M21.5 12H16c-.5 0-1 .5-1 1v4.5c0 .3.2.5.5.5h6c.3 0 .5-.2.5-.5V13c0-.5-.5-1-1-1Z"/></svg>
      </div>
      <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
        SPA <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Universidad</span>
      </h1>
      <p class="text-slate-400 text-base max-w-md">
        Sistema de Gestión de Programas Analíticos. Inicie sesión para redactar, revisar, auditar y consultar planes académicos oficiales.
      </p>
    </div>

    <!-- Login card and Quick Access -->
    <div class="md:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 w-full">
      
      <!-- Login Form (Glass card) -->
      <div class="sm:col-span-7 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <h2 class="text-xl font-bold text-white mb-6">Iniciar Sesión</h2>

        {#if errorMessage}
          <div class="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <form onsubmit={handleLogin} class="space-y-4">
          <div>
            <label for="email-field" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email corporativo</label>
            <input 
              id="email-field"
              type="email" 
              bind:value={email} 
              placeholder="usuario@ejemplo.com"
              class="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-650 transition-all duration-200" 
              required
            />
          </div>

          <div>
            <label for="password-field" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
            <input 
              id="password-field"
              type="password" 
              bind:value={password} 
              placeholder="••••••••"
              class="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-650 transition-all duration-200" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            class="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if loading}
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verificando...</span>
            {:else}
              <span>Ingresar al Sistema</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            {/if}
          </button>
        </form>
      </div>

      <!-- Quick Login (Card Panel) -->
      <div class="sm:col-span-5 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Acceso Rápido (Pruebas)</div>
          <div class="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {#each testAccounts as acc}
              <button 
                type="button"
                onclick={() => quickLogin(acc.email)}
                class="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all duration-250 group cursor-pointer"
              >
                <div class="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">{acc.name}</div>
                <div class="text-[10px] text-slate-400 truncate">{acc.role}</div>
              </button>
            {/each}
          </div>
        </div>
        
        <div class="text-[10px] text-slate-500 italic text-center sm:text-left mt-4">
          Clave común: <code class="text-indigo-400 font-mono">password123</code>
        </div>
      </div>

    </div>

  </div>
</div>
