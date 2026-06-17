<!-- src/lib/components/DaaDashboard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '../pb';
  import type { User, Asignatura, Notification, ProgramaAnalitico } from '../pb';

  // State
  let docentes: User[] = $state([]);
  let asignaturas: Asignatura[] = $state([]);
  let notifications: Notification[] = $state([]);
  let programs: ProgramaAnalitico[] = $state([]);

  let selectedDocenteId = $state("");
  let notificationType = $state<'lineal' | 'no_lineal'>("lineal");
  let subjectSearch = $state("");
  let selectedSubjectIds = $state<string[]>([]);
  
  let loading = $state(false);
  let actionLoading = $state<string | null>(null);
  let message = $state("");
  let messageType = $state<'success' | 'error'>("success");

  // Load everything on mount
  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      // 1. Fetch docentes
      const docentesRes = await pb.collection('users').getFullList<User>({
        filter: 'role = "docente"',
        sort: 'name'
      });
      docentes = docentesRes;

      // 2. Fetch asignaturas
      const asignaturasRes = await pb.collection('asignaturas').getFullList<Asignatura>({
        sort: 'codigo'
      });
      asignaturas = asignaturasRes;

      // 3. Fetch notifications
      const notifRes = await pb.collection('notificaciones').getFullList<Notification>({
        expand: 'docente,asignatura',
        sort: '-created'
      });
      notifications = notifRes;

      // 4. Fetch programs to check which notifications have created programs
      const progRes = await pb.collection('programas_analiticos').getFullList<ProgramaAnalitico>();
      programs = progRes;
    } catch (err) {
      console.error("Error loading DAA data:", err);
      showMessage("Error al cargar datos del servidor.", "error");
    } finally {
      loading = false;
    }
  }

  function showMessage(msg: string, type: 'success' | 'error') {
    message = msg;
    messageType = type;
    setTimeout(() => {
      message = "";
    }, 5000);
  }

  // Filter asignaturas based on search text
  const filteredAsignaturas = $derived(
    subjectSearch.trim() === "" 
      ? asignaturas 
      : asignaturas.filter(a => 
          a.codigo.toLowerCase().includes(subjectSearch.toLowerCase()) ||
          a.nombre.toLowerCase().includes(subjectSearch.toLowerCase()) ||
          a.carrera.toLowerCase().includes(subjectSearch.toLowerCase())
        )
  );

  // Toggle subject selection
  function handleSelectSubject(id: string) {
    const sub = asignaturas.find(x => x.id === id);
    if (!sub) return;

    if (notificationType === 'lineal') {
      // Linear: exactly one subject
      selectedSubjectIds = [id];
    } else {
      // Non-linear: can select multiple, but they MUST have the same code!
      if (selectedSubjectIds.includes(id)) {
        selectedSubjectIds = selectedSubjectIds.filter(x => x !== id);
      } else {
        if (selectedSubjectIds.length > 0) {
          const firstSelected = asignaturas.find(x => x.id === selectedSubjectIds[0]);
          if (firstSelected && firstSelected.codigo !== sub.codigo) {
            showMessage("En una notificación No Lineal, todas las asignaturas seleccionadas deben compartir el mismo Código Guaraní.", "error");
            return;
          }
        }
        selectedSubjectIds.push(id);
      }
    }
  }

  // Check if a program exists for a notification
  function hasProgramCreated(notif: Notification): boolean {
    // A notification is created if there is a PA where docente_id matches notif.docente
    // and its asignatura_id matches any of the asignaturas in notif.asignatura
    return programs.some(p => 
      p.docente_id === notif.docente && 
      p.asignatura_id.some(id => notif.asignatura.includes(id))
    );
  }

  // Create new notification
  async function handleSubmitNotification(e: Event) {
    e.preventDefault();
    if (!selectedDocenteId) {
      showMessage("Seleccione un docente.", "error");
      return;
    }
    if (selectedSubjectIds.length === 0) {
      showMessage("Seleccione al menos una asignatura.", "error");
      return;
    }

    loading = true;
    try {
      // Create the notification record
      await pb.collection('notificaciones').create({
        docente: selectedDocenteId,
        asignatura: selectedSubjectIds,
        tipo: notificationType
      });

      showMessage("Notificación creada con éxito.", "success");
      // Reset form
      selectedDocenteId = "";
      selectedSubjectIds = [];
      subjectSearch = "";
      // Reload
      await loadData();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al guardar la notificación: " + err.message, "error");
    } finally {
      loading = false;
    }
  }

  // Cancel notification (Delete)
  async function handleCancelNotification(id: string) {
    actionLoading = id;
    try {
      await pb.collection('notificaciones').delete(id);
      showMessage("Notificación cancelada con éxito.", "success");
      await loadData();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al cancelar la notificación: " + err.message, "error");
    } finally {
      actionLoading = null;
    }
  }

  // Renotify (Updates created timestamp)
  async function handleRenotify(id: string) {
    actionLoading = id;
    try {
      // PocketBase supports updating fields. Updating the record will trigger 'updated' field.
      // We can also patch it to force a reload
      await pb.collection('notificaciones').update(id, {
        updated: new Date().toISOString() // force change
      });
      showMessage("Docente renotificado con éxito.", "success");
      await loadData();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al renotificar: " + err.message, "error");
    } finally {
      actionLoading = null;
    }
  }
</script>

<div class="space-y-8 max-w-6xl mx-auto py-6 text-slate-100 font-sans">
  
  <!-- Alert message banner -->
  {#if message}
    <div class="p-4 rounded-2xl border text-sm flex items-center gap-3 transition-all duration-350 shadow-lg {messageType === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}">
      {#if messageType === 'success'}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      {/if}
      <span>{message}</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Left column: New Notification -->
    <div class="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Nueva Notificación</h2>
          <p class="text-xs text-slate-400">Seleccione un docente y las asignaturas correspondientes para iniciar el circuito del PA.</p>
        </div>

        <form onsubmit={handleSubmitNotification} class="space-y-5">
          <!-- 1. Select Docente -->
          <div>
            <label for="select-docente" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Docente Responsable</label>
            <select 
              id="select-docente"
              bind:value={selectedDocenteId}
              class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100"
              required
            >
              <option value="">-- Seleccionar Docente --</option>
              {#each docentes as d}
                <option value={d.id}>{d.name} ({d.email})</option>
              {/each}
            </select>
          </div>

          <!-- 2. Type selection -->
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipo de Revisión</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onclick={() => { notificationType = 'lineal'; selectedSubjectIds = []; }}
                class="py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer"
                class:bg-indigo-650={notificationType === 'lineal'}
                class:border-indigo-550={notificationType === 'lineal'}
                class:text-white={notificationType === 'lineal'}
                class:bg-slate-950={notificationType !== 'lineal'}
                class:border-slate-850={notificationType !== 'lineal'}
                class:text-slate-400={notificationType !== 'lineal'}
              >
                Lineal
              </button>
              <button 
                type="button"
                onclick={() => { notificationType = 'no_lineal'; selectedSubjectIds = []; }}
                class="py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer"
                class:bg-indigo-650={notificationType === 'no_lineal'}
                class:border-indigo-550={notificationType === 'no_lineal'}
                class:text-white={notificationType === 'no_lineal'}
                class:bg-slate-950={notificationType !== 'no_lineal'}
                class:border-slate-850={notificationType !== 'no_lineal'}
                class:text-slate-400={notificationType !== 'no_lineal'}
              >
                No Lineal
              </button>
            </div>
            <p class="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              {#if notificationType === 'lineal'}
                * **Lineal:** Un PA para una asignatura y carrera. Permite seleccionar una materia.
              {:else}
                * **No Lineal:** Un único PA para una materia dictada en múltiples carreras. Permite seleccionar múltiples carreras con el mismo Código Guaraní.
              {/if}
            </p>
          </div>

          <!-- 3. Subject Filter & List -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label for="subject-search" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Asignaturas ({filteredAsignaturas.length})</label>
              {#if selectedSubjectIds.length > 0}
                <span class="text-[10px] bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {selectedSubjectIds.length} seleccionada(s)
                </span>
              {/if}
            </div>
            
            <input 
              id="subject-search"
              type="text" 
              bind:value={subjectSearch}
              placeholder="Buscar por código, nombre o carrera..."
              class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 transition-all duration-200"
            />

            <div class="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/40 max-h-[200px] overflow-y-auto divide-y divide-slate-850/80">
              {#if filteredAsignaturas.length === 0}
                <div class="p-4 text-center text-xs text-slate-600">No se encontraron materias.</div>
              {:else}
                {#each filteredAsignaturas as a}
                  <button 
                    type="button"
                    onclick={() => handleSelectSubject(a.id)}
                    class="w-full p-2.5 text-left text-xs transition-colors flex justify-between items-center gap-3 cursor-pointer group {selectedSubjectIds.includes(a.id) ? 'bg-indigo-500/10' : 'hover:bg-slate-850'}"
                  >
                    <div class="space-y-0.5 truncate">
                      <div class="font-bold text-slate-350 group-hover:text-white transition-colors">
                        ({a.codigo}) {a.nombre}
                      </div>
                      <div class="text-[10px] text-slate-500 truncate">{a.carrera}</div>
                    </div>
                    <div class="shrink-0 flex items-center">
                      {#if selectedSubjectIds.includes(a.id)}
                        <span class="w-4 h-4 rounded-full bg-indigo-550 border border-indigo-400 flex items-center justify-center text-white text-[9px]">✔</span>
                      {:else}
                        <span class="w-4 h-4 rounded-full border border-slate-800 bg-slate-900 group-hover:border-slate-700 transition-colors"></span>
                      {/if}
                    </div>
                  </button>
                {/each}
              {/if}
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            disabled={loading}
            class="w-full mt-4 bg-indigo-600 hover:bg-indigo-550 active:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-650/20 hover:shadow-indigo-650/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Crear Notificación</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>

    <!-- Right column: Report of Notifications -->
    <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Reporte de Notificaciones</h2>
          <p class="text-xs text-slate-400">Seguimiento de solicitudes enviadas y control de anulaciones / renotificaciones.</p>
        </div>
        <button 
          onclick={loadData}
          class="self-start sm:self-auto p-2 bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          title="Actualizar Datos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>

      <!-- Table -->
      <div class="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/20 flex-1 overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs min-w-[600px]">
          <thead>
            <tr class="bg-slate-900 border-b border-slate-850 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th class="p-3">Docente</th>
              <th class="p-3">Código</th>
              <th class="p-3">Asignatura / Carrera(s)</th>
              <th class="p-3">Tipo</th>
              <th class="p-3">Programa</th>
              <th class="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850/80">
            {#if notifications.length === 0}
              <tr>
                <td colspan="6" class="p-8 text-center text-slate-600">No hay notificaciones registradas.</td>
              </tr>
            {:else}
              {#each notifications as n}
                {@const created = hasProgramCreated(n)}
                {@const doc = n.expand?.docente}
                {@const asigs = n.expand?.asignatura || []}
                <tr class="hover:bg-slate-900/30 transition-colors group">
                  <td class="p-3">
                    <div class="font-bold text-white">{doc?.name || 'Incompleto'}</div>
                    <div class="text-[10px] text-slate-500">{doc?.email}</div>
                  </td>
                  <td class="p-3 font-mono text-slate-400">{asigs[0]?.codigo || '-'}</td>
                  <td class="p-3 space-y-1">
                    <div class="font-semibold text-slate-200">{asigs[0]?.nombre || 'Cargando...'}</div>
                    <div class="text-[10px] text-slate-500 space-y-0.5">
                      {#each asigs as a}
                        <div>• {a.carrera}</div>
                      {/each}
                    </div>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold border uppercase {n.tipo === 'no_lineal' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}">
                      {n.tipo === 'no_lineal' ? 'No Lineal' : 'Lineal'}
                    </span>
                  </td>
                  <td class="p-3">
                    <span class="inline-flex items-center gap-1 font-semibold text-[10px] uppercase"
                      class:text-emerald-400={created}
                      class:text-amber-500={!created}
                    >
                      <span class="w-1.5 h-1.5 rounded-full"
                        class:bg-emerald-500={created}
                        class:bg-amber-500={!created}
                      ></span>
                      {created ? 'Creado' : 'Pendiente'}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    {#if !created}
                      <div class="flex items-center justify-end gap-1.5">
                        <button 
                          onclick={() => handleRenotify(n.id)}
                          disabled={actionLoading !== null}
                          class="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-semibold text-[10px] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Renotificar docente"
                        >
                          Renotificar
                        </button>
                        <button 
                          onclick={() => handleCancelNotification(n.id)}
                          disabled={actionLoading !== null}
                          class="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all font-semibold text-[10px] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Cancelar notificación"
                        >
                          Anular
                        </button>
                      </div>
                    {:else}
                      <span class="text-[10px] text-slate-500 italic pr-2">En proceso</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div>
