<!-- src/lib/components/AuditorDashboard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '../pb';
  import type { User, ProgramaAnalitico, Asignatura, Unidad } from '../pb';
  import ProgramViewer from './ProgramViewer.svelte';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  // State
  let pas: ProgramaAnalitico[] = $state([]);
  let asignaturas: Asignatura[] = $state([]);
  
  let selectedPa: ProgramaAnalitico | null = $state(null);
  let selectedUnidades = $state<Unidad[]>([]);
  
  let observationText = $state("");
  let showObservationForm = $state(false);

  let loading = $state(false);
  let actionLoading = $state(false);
  let message = $state("");
  let messageType = $state<'success' | 'error'>("success");

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      // 1. Load asignaturas
      const asigsRes = await pb.collection('asignaturas').getFullList<Asignatura>();
      asignaturas = asigsRes;

      // 2. Load all programs that are in revision states
      const pasRes = await pb.collection('programas_analiticos').getFullList<ProgramaAnalitico>({
        filter: 'estado != "borrador" && estado != "aceptado"',
        expand: 'docente_id,asignatura_id',
        sort: '-updated'
      });
      pas = pasRes;
    } catch (err) {
      console.error("Error loading auditor data:", err);
      showMessage("Error al cargar la bandeja de entrada.", "error");
    } finally {
      loading = false;
    }
  }

  function showMessage(msg: string, type: 'success' | 'error') {
    message = msg;
    messageType = type;
    setTimeout(() => {
      message = "";
    }, 6000);
  }

  // Filter inbox based on user role and career/school
  const inboxPAs = $derived.by(() => {
    return pas.filter(pa => {
      // Find the subjects linked to this PA
      const linkedAsigs = asignaturas.filter(a => pa.asignatura_id.includes(a.id));
      if (linkedAsigs.length === 0) return false;

      if (user.role === 'd_carrera') {
        // Must be in state revision_carrera
        if (pa.estado !== 'revision_carrera') return false;
        
        // Director's career must match one of the careers of the PA's subjects
        const careersOfPA = linkedAsigs.map(a => a.carrera);
        const matchesCareer = careersOfPA.includes(user.carrera || "");
        if (!matchesCareer) return false;

        // Director has not approved already
        const alreadyApproved = pa.historial_revisiones?.aprobaciones_carrera?.includes(user.carrera || "");
        return !alreadyApproved;
      }

      if (user.role === 'd_escuela') {
        // Must be in state revision_escuela
        if (pa.estado !== 'revision_escuela') return false;

        // Director's school must match one of the schools of the PA's subjects
        const schoolsOfPA = linkedAsigs.map(a => a.escuela || "");
        const matchesSchool = schoolsOfPA.includes(user.escuela || "");
        if (!matchesSchool) return false;

        // Director has not approved already
        const alreadyApproved = pa.historial_revisiones?.aprobaciones_escuela?.includes(user.escuela || "");
        return !alreadyApproved;
      }

      if (user.role === 'daa') {
        // Must be in state revision_daa
        return pa.estado === 'revision_daa';
      }

      return false;
    });
  });

  async function handleOpenDetail(pa: ProgramaAnalitico) {
    selectedPa = pa;
    showObservationForm = false;
    observationText = "";
    try {
      const unitsRes = await pb.collection('unidades').getFullList<Unidad>({
        filter: `pa_id = "${pa.id}"`
      });
      selectedUnidades = unitsRes;
    } catch (err) {
      console.error("Error loading units:", err);
      selectedUnidades = [];
    }
  }

  function handleCloseDetail() {
    selectedPa = null;
    selectedUnidades = [];
    showObservationForm = false;
    observationText = "";
    loadData();
  }

  // Action: ACEPTAR / APROBAR
  async function handleAccept() {
    if (!selectedPa) return;
    
    actionLoading = true;
    try {
      const linkedAsigs = asignaturas.filter(a => selectedPa!.asignatura_id.includes(a.id));
      const payload: any = { ...selectedPa };
      
      const revisionLog = {
        fecha: new Date().toISOString(),
        usuario: user.name,
        rol: user.role,
        accion: 'aceptar' as const,
        mensaje: ""
      };

      const hist = selectedPa.historial_revisiones || { aprobaciones_carrera: [], aprobaciones_escuela: [], historial: [] };
      if (!hist.aprobaciones_carrera) hist.aprobaciones_carrera = [];
      if (!hist.aprobaciones_escuela) hist.aprobaciones_escuela = [];
      if (!hist.historial) hist.historial = [];

      if (user.role === 'd_carrera') {
        // Add current career approval
        const currentCareer = user.carrera || "";
        if (!hist.aprobaciones_carrera.includes(currentCareer)) {
          hist.aprobaciones_carrera.push(currentCareer);
        }

        // Get unique list of required careers
        const reqCareers = [...new Set(linkedAsigs.map(a => a.carrera))];
        
        // Check if all approved
        const allApproved = reqCareers.every(c => hist.aprobaciones_carrera?.includes(c));

        if (allApproved) {
          payload.estado = 'revision_escuela';
          revisionLog.mensaje = "Aprobado por todas las Direcciones de Carrera. Avanza a revisión de Escuela.";
        } else {
          revisionLog.mensaje = `Aprobado por Dirección de Carrera (${currentCareer}). Pendiente de otras aprobaciones.`;
        }
      } 
      
      else if (user.role === 'd_escuela') {
        // Add current school approval
        const currentSchool = user.escuela || "";
        if (!hist.aprobaciones_escuela.includes(currentSchool)) {
          hist.aprobaciones_escuela.push(currentSchool);
        }

        // Get unique list of required schools
        const reqSchools = [...new Set(linkedAsigs.map(a => a.escuela || ""))].filter(Boolean);
        
        // Check if all approved
        const allApproved = reqSchools.every(s => hist.aprobaciones_escuela?.includes(s));

        if (allApproved || reqSchools.length === 0) {
          payload.estado = 'revision_daa';
          revisionLog.mensaje = "Aprobado por todas las Direcciones de Escuela. Avanza a revisión de Dirección de Asuntos Académicos (DAA).";
        } else {
          revisionLog.mensaje = `Aprobado por Dirección de Escuela (${currentSchool}). Pendiente de otras escuelas.`;
        }
      } 
      
      else if (user.role === 'daa') {
        // DAA is the final level. When DAA accepts, it goes straight to "aceptado"
        payload.estado = 'aceptado';
        revisionLog.mensaje = "Programa Analítico aprobado definitivamente.";
      }

      hist.historial.push(revisionLog);
      payload.historial_revisiones = hist;

      await pb.collection('programas_analiticos').update(selectedPa.id, payload);
      showMessage("Programa analítico aceptado con éxito.", "success");
      handleCloseDetail();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al procesar la aceptación: " + err.message, "error");
    } finally {
      actionLoading = false;
    }
  }

  // Action: OBSERVAR (Return to teacher)
  async function handleObserve(e: Event) {
    e.preventDefault();
    if (!selectedPa) return;
    if (!observationText.trim()) {
      showMessage("Debe ingresar el motivo de la observación.", "error");
      return;
    }

    actionLoading = true;
    try {
      const payload: any = { ...selectedPa };
      
      // Observing REVERTS the state to "observado"
      payload.estado = 'observado';

      // Clear current approvals for this level so that once the teacher resubmits,
      // it must be approved by everyone at this level again!
      const hist = selectedPa.historial_revisiones || { aprobaciones_carrera: [], aprobaciones_escuela: [], historial: [] };
      
      if (user.role === 'd_carrera') {
        hist.aprobaciones_carrera = [];
      } else if (user.role === 'd_escuela') {
        hist.aprobaciones_escuela = [];
      }

      hist.historial?.push({
        fecha: new Date().toISOString(),
        usuario: user.name,
        rol: user.role,
        accion: 'observar' as const,
        mensaje: observationText
      });

      payload.historial_revisiones = hist;

      await pb.collection('programas_analiticos').update(selectedPa.id, payload);
      showMessage("Programa analítico devuelto con observaciones al docente.", "success");
      handleCloseDetail();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al registrar la observación: " + err.message, "error");
    } finally {
      actionLoading = false;
    }
  }
</script>

<div class="space-y-6 max-w-6xl mx-auto py-6 text-slate-100 font-sans">

  {#if message}
    <div class="p-4 rounded-2xl border text-sm flex items-center gap-3 shadow-lg {messageType === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}">
      <span>{message}</span>
    </div>
  {/if}

  {#if !selectedPa}
    <!-- Inbox View -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Bandeja de Entrada de Auditoría</h2>
          <p class="text-xs text-slate-400">Audite y apruebe las solicitudes académicas correspondientes a su jurisdicción.</p>
        </div>
        <div class="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-350 self-start sm:self-auto uppercase tracking-wide">
          Jurisdicción: {user.role === 'daa' ? 'Toda la Universidad (DAA)' : user.role === 'd_carrera' ? `Carrera: ${user.carrera}` : `Escuela: ${user.escuela}`}
        </div>
      </div>

      <div class="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/20 overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead>
            <tr class="bg-slate-900 border-b border-slate-850 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th class="p-3">Fecha Presentación</th>
              <th class="p-3">Asignatura</th>
              <th class="p-3">Docente</th>
              <th class="p-3">Carrera(s) del PA</th>
              <th class="p-3">Nivel de Revisión</th>
              <th class="p-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850/80">
            {#if inboxPAs.length === 0}
              <tr>
                <td colspan="6" class="p-8 text-center text-slate-650">No tiene programas analíticos pendientes de revisión.</td>
              </tr>
            {:else}
              {#each inboxPAs as pa}
                {@const linkedAsigs = asignaturas.filter(a => pa.asignatura_id.includes(a.id))}
                <tr class="hover:bg-slate-900/30 transition-colors">
                  <td class="p-3 text-slate-450 font-mono">{new Date(pa.updated).toLocaleDateString()}</td>
                  <td class="p-3">
                    <div class="font-bold text-white">({linkedAsigs[0]?.codigo}) {linkedAsigs[0]?.nombre}</div>
                    <div class="text-[10px] text-slate-500">Horas: {linkedAsigs[0]?.horas_interaccion_pedagogica} hs</div>
                  </td>
                  <td class="p-3">
                    <div class="font-semibold text-slate-200">{pa.expand?.docente_id?.name}</div>
                    <div class="text-[10px] text-slate-500">{pa.expand?.docente_id?.email}</div>
                  </td>
                  <td class="p-3">
                    <div class="space-y-0.5 text-slate-350">
                      {#each linkedAsigs as a}
                        <div>• {a.carrera}</div>
                      {/each}
                    </div>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border border-amber-500/20 bg-amber-500/5 text-amber-400">
                      {pa.estado.replace('revision_', 'revisión ')}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    <button 
                      onclick={() => handleOpenDetail(pa)}
                      class="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold text-xs"
                      title="Auditar Programa Analítico"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      <span>Revisar</span>
                    </button>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <!-- Detail Audit View -->
    <div class="space-y-6">
      <!-- Program Document Viewer in Internal Mode (publicMode = false to show gender/extension info) -->
      <ProgramViewer 
        pa={selectedPa}
        {asignaturas}
        unidades={selectedUnidades}
        publicMode={false}
        onClose={handleCloseDetail}
      />

      <!-- Audit Actions Bar -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        {#if !showObservationForm}
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 class="text-sm font-bold text-white">¿Cuál es su dictamen sobre el Programa Analítico?</h4>
              <p class="text-xs text-slate-400">Aceptar elevará el programa al siguiente nivel. Observar devolverá el programa al docente.</p>
            </div>
            
            <div class="flex items-center gap-3">
              <button 
                onclick={() => showObservationForm = true}
                class="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs transition-colors cursor-pointer"
              >
                Observar / Devolver
              </button>
              
              <button 
                onclick={handleAccept}
                disabled={actionLoading}
                class="px-5 py-2.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-650/20 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Guardando...' : 'Aceptar / Aprobar'}
              </button>
            </div>
          </div>
        {:else}
          <!-- Observation Form -->
          <form onsubmit={handleObserve} class="space-y-4">
            <div>
              <label for="observation-textarea" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Describa las correcciones requeridas (se enviará al docente):</label>
              <textarea 
                id="observation-textarea"
                bind:value={observationText}
                placeholder="Indique claramente los puntos a subsanar (ej: corregir bibliografía obligatoria en la Unidad 2, ampliar fundamentación...)"
                class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-4 text-xs text-slate-100"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div class="flex items-center gap-3 justify-end">
              <button 
                type="button"
                onclick={() => { showObservationForm = false; observationText = ""; }}
                class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700 transition-colors text-xs cursor-pointer"
              >
                Volver
              </button>
              
              <button 
                type="submit"
                disabled={actionLoading}
                class="px-5 py-2 rounded-xl bg-rose-650 hover:bg-rose-600 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-rose-650/20 disabled:opacity-50"
              >
                {actionLoading ? 'Enviando...' : 'Confirmar Devolución'}
              </button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  {/if}

</div>
