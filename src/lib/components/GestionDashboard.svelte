<!-- src/lib/components/GestionDashboard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '../pb';
  import type { VentanaActualizacion, ProgramaAnalitico, Asignatura } from '../pb';

  // State
  let windows: VentanaActualizacion[] = $state([]);
  let pas: ProgramaAnalitico[] = $state([]);
  let asignaturas: Asignatura[] = $state([]);

  // Form State
  let fechaInicio = $state("");
  let fechaFin = $state("");
  let anioLectivo = $state("");
  let activa = $state(true);

  let loading = $state(false);
  let actionLoading = $state<string | null>(null);
  let message = $state("");
  let messageType = $state<'success' | 'error'>("success");

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      // 1. Fetch update windows
      const winRes = await pb.collection('ventanas_actualizacion').getFullList<VentanaActualizacion>({
        sort: '-fecha_inicio'
      });
      windows = winRes;

      // 2. Fetch all asignaturas
      const asigsRes = await pb.collection('asignaturas').getFullList<Asignatura>();
      asignaturas = asigsRes;

      // 3. Fetch all PAs
      const pasRes = await pb.collection('programas_analiticos').getFullList<ProgramaAnalitico>({
        expand: 'docente_id,asignatura_id',
        sort: '-updated'
      });
      pas = pasRes;
    } catch (err) {
      console.error("Error loading gestion data:", err);
      showMessage("Error al cargar la información del panel de gestión.", "error");
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

  // Create update window
  async function handleCreateWindow(e: Event) {
    e.preventDefault();
    if (!fechaInicio || !fechaFin || !anioLectivo) {
      showMessage("Complete todos los campos obligatorios.", "error");
      return;
    }

    loading = true;
    try {
      await pb.collection('ventanas_actualizacion').create({
        fecha_inicio: new Date(fechaInicio).toISOString(),
        fecha_fin: new Date(fechaFin).toISOString(),
        anio_lectivo: anioLectivo,
        activa: activa
      });

      showMessage("Ventana de actualización configurada con éxito.", "success");
      // Reset form
      fechaInicio = "";
      fechaFin = "";
      anioLectivo = "";
      activa = true;

      await loadData();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al guardar la ventana de actualización: " + err.message, "error");
    } finally {
      loading = false;
    }
  }

  // Toggle active status
  async function handleToggleActive(w: VentanaActualizacion) {
    actionLoading = w.id;
    try {
      await pb.collection('ventanas_actualizacion').update(w.id, {
        activa: !w.activa
      });
      showMessage("Estado de la ventana actualizado.", "success");
      await loadData();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al actualizar estado: " + err.message, "error");
    } finally {
      actionLoading = null;
    }
  }

  // Delete window
  async function handleDeleteWindow(id: string) {
    if (!confirm("¿Está seguro que desea eliminar esta ventana de actualización?")) return;
    actionLoading = id;
    try {
      await pb.collection('ventanas_actualizacion').delete(id);
      showMessage("Ventana de actualización eliminada con éxito.", "success");
      await loadData();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al eliminar la ventana: " + err.message, "error");
    } finally {
      actionLoading = null;
    }
  }

  function getStatusStyle(estado: string) {
    switch(estado) {
      case 'borrador': return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case 'revision_carrera': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'revision_escuela': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'revision_daa': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'observado': return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case 'aceptado': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  }
</script>

<div class="space-y-8 max-w-6xl mx-auto py-6 text-slate-100 font-sans">

  {#if message}
    <div class="p-4 rounded-2xl border text-sm flex items-center gap-3 shadow-lg {messageType === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}">
      <span>{message}</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Left column: Configure window -->
    <div class="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 self-start">
      <div>
        <h2 class="text-xl font-bold text-white mb-1">Ventanas de Actualización</h2>
        <p class="text-xs text-slate-400">Configure los plazos válidos en los cuales los docentes pueden crear y editar programas analíticos.</p>
      </div>

      <form onsubmit={handleCreateWindow} class="space-y-4">
        <div>
          <label for="fecha-inicio" class="block text-xs font-semibold text-slate-400 mb-1.5">Fecha de Inicio</label>
          <input 
            id="fecha-inicio"
            type="datetime-local" 
            bind:value={fechaInicio}
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-xs text-slate-150"
            required
          />
        </div>

        <div>
          <label for="fecha-fin" class="block text-xs font-semibold text-slate-400 mb-1.5">Fecha de Cierre (Vencimiento)</label>
          <input 
            id="fecha-fin"
            type="datetime-local" 
            bind:value={fechaFin}
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-xs text-slate-150"
            required
          />
        </div>

        <div>
          <label for="input-anio" class="block text-xs font-semibold text-slate-400 mb-1.5">Año Lectivo Válido</label>
          <input 
            id="input-anio"
            type="text" 
            bind:value={anioLectivo}
            placeholder="Ej: 2026"
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            required
          />
        </div>

        <div class="flex items-center gap-3 py-1">
          <input 
            id="switch-activa"
            type="checkbox" 
            bind:checked={activa}
            class="w-4 h-4 text-indigo-600 border-slate-850 bg-slate-950 focus:ring-indigo-500 rounded cursor-pointer"
          />
          <label for="switch-activa" class="text-xs font-bold text-slate-350 select-none cursor-pointer">¿Ventana Activa de inmediato?</label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          class="w-full mt-4 bg-indigo-600 hover:bg-indigo-550 active:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-650/20 hover:shadow-indigo-650/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>Establecer Ventana</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </button>
      </form>

      <!-- Windows list -->
      <div class="space-y-3 pt-4 border-t border-slate-850">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Ventanas Configuradas</h3>
        <div class="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {#if windows.length === 0}
            <div class="p-4 text-center text-xs text-slate-600">No hay ventanas configuradas.</div>
          {:else}
            {#each windows as w}
              <div class="p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-xs flex justify-between items-center gap-3">
                <div class="space-y-1">
                  <div class="font-bold text-white flex items-center gap-2">
                    Ciclo Lectivo: {w.anio_lectivo}
                    <span class="w-1.5 h-1.5 rounded-full" class:bg-emerald-500={w.activa} class:bg-rose-500={!w.activa}></span>
                  </div>
                  <div class="text-[10px] text-slate-500">
                    Desde: {new Date(w.fecha_inicio).toLocaleDateString()}
                  </div>
                  <div class="text-[10px] text-slate-500">
                    Hasta: {new Date(w.fecha_fin).toLocaleDateString()}
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <button 
                    onclick={() => handleToggleActive(w)}
                    disabled={actionLoading !== null}
                    class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-350 border border-slate-700 font-semibold text-[9px] uppercase cursor-pointer"
                    title={w.activa ? "Desactivar" : "Activar"}
                  >
                    {w.activa ? "Pausar" : "Habilitar"}
                  </button>
                  <button 
                    onclick={() => handleDeleteWindow(w.id)}
                    disabled={actionLoading !== null}
                    class="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/20 font-semibold text-[9px] uppercase cursor-pointer"
                    title="Eliminar"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>

    <!-- Right column: General Program Monitor -->
    <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Monitor General del SPA</h2>
          <p class="text-xs text-slate-400">Inspeccione el estado general de todos los programas analíticos creados en la universidad.</p>
        </div>
        <button 
          onclick={loadData}
          class="p-2 bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>

      <!-- Monitor Table -->
      <div class="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/20 flex-1 overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs min-w-[650px]">
          <thead>
            <tr class="bg-slate-900 border-b border-slate-850 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th class="p-3">Docente</th>
              <th class="p-3">Asignatura</th>
              <th class="p-3">Carreras vinculadas</th>
              <th class="p-3">Último cambio</th>
              <th class="p-3">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850/80">
            {#if pas.length === 0}
              <tr>
                <td colspan="5" class="p-8 text-center text-slate-650">No hay programas analíticos registrados en el sistema.</td>
              </tr>
            {:else}
              {#each pas as pa}
                {@const linkedAsigs = asignaturas.filter(a => pa.asignatura_id.includes(a.id))}
                <tr class="hover:bg-slate-900/30 transition-colors">
                  <td class="p-3">
                    <div class="font-bold text-white">{pa.expand?.docente_id?.name || 'Desconocido'}</div>
                    <div class="text-[10px] text-slate-500">{pa.expand?.docente_id?.email}</div>
                  </td>
                  <td class="p-3 font-semibold text-slate-200">
                    ({linkedAsigs[0]?.codigo || '-'}) {linkedAsigs[0]?.nombre || 'Cargando...'}
                  </td>
                  <td class="p-3">
                    <div class="space-y-0.5 text-slate-400">
                      {#each linkedAsigs as a}
                        <div>• {a.carrera}</div>
                      {/each}
                    </div>
                  </td>
                  <td class="p-3 text-slate-500 font-mono">
                    {new Date(pa.updated).toLocaleDateString()}
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold border {getStatusStyle(pa.estado)}">
                      {pa.estado.replace('_', ' ')}
                    </span>
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
