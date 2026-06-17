<!-- src/lib/components/DocenteDashboard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '../pb';
  import type { User, Notification, Asignatura, ProgramaAnalitico, Unidad, VentanaActualizacion } from '../pb';
  import RichEditor from './RichEditor.svelte';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  // State
  let notifications: Notification[] = $state([]);
  let asignaturas: Asignatura[] = $state([]);
  let pas: ProgramaAnalitico[] = $state([]);
  let activeWindow: VentanaActualizacion | null = $state(null);

  // Editor Wizard State
  let editingPA: Partial<ProgramaAnalitico> | null = $state(null);
  let editingUnidades = $state<Partial<Unidad>[]>([]);
  let linkedNotification: Notification | null = $state(null);
  let primaryAsignatura = $derived(
    linkedNotification?.expand?.asignatura?.[0] || null
  );

  let currentStep = $state(1); // 1: Datos, 2: Contenidos, 3: Unidades, 4: Evaluación
  
  let loading = $state(false);
  let actionLoading = $state(false);
  let message = $state("");
  let messageType = $state<'success' | 'error'>("success");

  // Load data on mount
  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      // 1. Load active update window
      const now = new Date().toISOString();
      const windowsRes = await pb.collection('ventanas_actualizacion').getFullList<VentanaActualizacion>({
        filter: `fecha_inicio <= "${now}" && fecha_fin >= "${now}" && activa = true`
      });
      activeWindow = windowsRes[0] || null;

      // 2. Load notifications for this teacher
      const notifRes = await pb.collection('notificaciones').getFullList<Notification>({
        filter: `docente = "${user.id}"`,
        expand: 'asignatura',
        sort: '-created'
      });
      notifications = notifRes;

      // 3. Load all asignaturas
      const asigsRes = await pb.collection('asignaturas').getFullList<Asignatura>();
      asignaturas = asigsRes;

      // 4. Load all existing PAs for this teacher
      const pasRes = await pb.collection('programas_analiticos').getFullList<ProgramaAnalitico>({
        filter: `docente_id = "${user.id}"`,
        expand: 'asignatura_id'
      });
      pas = pasRes;
    } catch (err) {
      console.error("Error loading docente data:", err);
      showMessage("Error al conectar con la base de datos.", "error");
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

  // Get status of a notification
  function getPAForNotification(notif: Notification): ProgramaAnalitico | null {
    // Find a PA that references the asignaturas in this notification
    return pas.find(p => 
      p.asignatura_id.some(id => notif.asignatura.includes(id))
    ) || null;
  }

  function getStatusLabel(notif: Notification) {
    const pa = getPAForNotification(notif);
    if (!pa) return { label: "Programa sin crear", color: "bg-slate-800 text-slate-400 border-slate-700" };
    
    switch(pa.estado) {
      case 'borrador': return { label: "Borrador", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" };
      case 'revision_carrera': return { label: "En revisión (Carrera)", color: "bg-amber-500/10 text-amber-400 border-amber-500/25" };
      case 'revision_escuela': return { label: "En revisión (Escuela)", color: "bg-amber-500/10 text-amber-400 border-amber-500/25" };
      case 'revision_daa': return { label: "En revisión (DAA)", color: "bg-amber-500/10 text-amber-400 border-amber-500/25" };
      case 'observado': return { label: "Observado / Subsanación", color: "bg-rose-500/10 text-rose-400 border-rose-500/25" };
      case 'aceptado': return { label: "Aceptado", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" };
      default: return { label: pa.estado, color: "bg-slate-800 text-slate-400 border-slate-700" };
    }
  }

  // Check if teacher can edit (Must be inside active window, and state must be 'borrador' or 'observado' or not created yet)
  function isEditable(notif: Notification): boolean {
    // Editing is allowed if the update window is active
    if (!activeWindow) return false;
    
    const pa = getPAForNotification(notif);
    if (!pa) return true; // not created yet -> editable
    return pa.estado === 'borrador' || pa.estado === 'observado';
  }

  // Initialize wizard for creating/editing a PA
  async function handleOpenWizard(notif: Notification) {
    linkedNotification = notif;
    const pa = getPAForNotification(notif);
    
    if (pa) {
      // Load existing PA and its units
      editingPA = { ...pa };
      try {
        const unitsRes = await pb.collection('unidades').getFullList<Unidad>({
          filter: `pa_id = "${pa.id}"`
        });
        editingUnidades = unitsRes;
      } catch (err) {
        console.error("Error loading units:", err);
        editingUnidades = [];
      }
    } else {
      // Initialize new PA
      editingPA = {
        docente_id: user.id,
        asignatura_id: notif.asignatura,
        estado: 'borrador',
        horas_distancia: 0,
        horas_teoricas: 0,
        horas_practicas: 0,
        horas_autonomas: 0,
        fundamentacion: "",
        propositos: "",
        metodologia: "",
        perspectiva_genero: false,
        descripcion_genero: "",
        actividades_extension: false,
        descripcion_extension: "",
        propuesta_evaluacion: "",
        requisitos_acreditacion: "",
        promocionable: false,
        escala_promocionable: 'ninguna',
        rendirse_libre: false,
        historial_revisiones: {
          aprobaciones_carrera: [],
          aprobaciones_escuela: [],
          historial: []
        }
      };
      editingUnidades = [];
    }
    
    currentStep = 1;
  }

  function handleCloseWizard() {
    editingPA = null;
    editingUnidades = [];
    linkedNotification = null;
    currentStep = 1;
    loadData();
  }

  // --- Step 1 Validation (Horas) ---
  const sumHours = $derived(
    (editingPA?.horas_teoricas || 0) + (editingPA?.horas_practicas || 0)
  );

  const reqHours = $derived(
    primaryAsignatura?.horas_interaccion_pedagogica || 0
  );

  const isHoursValid = $derived(
    sumHours === reqHours
  );

  // --- Step 3 Validation (Weeks 1..16) ---
  // Returns week counts: maps week 1..16 to the number of units teaching it
  const weekStats = $derived.by(() => {
    const counts = Array(17).fill(0); // index 1 to 16
    for (const unit of editingUnidades) {
      if (unit.semanas_dictado && Array.isArray(unit.semanas_dictado)) {
        for (const week of unit.semanas_dictado) {
          if (week >= 1 && week <= 16) {
            counts[week]++;
          }
        }
      }
    }
    return counts;
  });

  const isWeeksCovered = $derived.by(() => {
    // Every week 1 to 16 must have count exactly 1 (no gaps, no overlaps)
    for (let w = 1; w <= 16; w++) {
      if (weekStats[w] !== 1) {
        return false;
      }
    }
    return true;
  });

  function handleAddUnit() {
    editingUnidades.push({
      titulo: `Nueva Unidad ${editingUnidades.length + 1}`,
      semanas_dictado: [],
      actividades: "",
      biblio_obligatoria: "",
      biblio_complementaria: ""
    });
  }

  function handleRemoveUnit(index: number) {
    editingUnidades = editingUnidades.filter((_, i) => i !== index);
  }

  function toggleWeekInUnit(unitIndex: number, week: number) {
    const unit = editingUnidades[unitIndex];
    if (!unit.semanas_dictado) {
      unit.semanas_dictado = [];
    }
    if (unit.semanas_dictado.includes(week)) {
      unit.semanas_dictado = unit.semanas_dictado.filter(w => w !== week);
    } else {
      unit.semanas_dictado.push(week);
    }
  }

  // --- Database Save Operations ---
  async function saveDatabase(submitToReview: boolean) {
    if (!editingPA || !linkedNotification) return;

    // Strict validation blocks
    if (currentStep >= 1 && !isHoursValid) {
      showMessage("La suma de Horas Teóricas y Prácticas debe coincidir exactamente con las Horas de Interacción Pedagógica.", "error");
      return;
    }
    if (currentStep >= 3 && !isWeeksCovered && submitToReview) {
      showMessage("Debe cubrir exactamente las 16 semanas de dictado para presentar el programa.", "error");
      return;
    }

    actionLoading = true;
    try {
      const payload: any = { ...editingPA };
      
      if (submitToReview) {
        // Linear notification advances to revision_carrera.
        // What about non-linear? Non-linear also advances to revision_carrera!
        payload.estado = 'revision_carrera';
        
        // Reset approval records for fresh audit cycle
        payload.historial_revisiones = {
          aprobaciones_carrera: [],
          aprobaciones_escuela: [],
          historial: [
            ...(editingPA.historial_revisiones?.historial || []),
            {
              fecha: new Date().toISOString(),
              usuario: user.name,
              rol: 'docente',
              accion: 'presentar',
              mensaje: "Programa Analítico presentado para revisión."
            }
          ]
        };
      } else {
        // Keep status as borrador or observado
        payload.estado = editingPA.id ? editingPA.estado : 'borrador';
        
        if (!editingPA.id) {
          // Add creation log
          payload.historial_revisiones = {
            aprobaciones_carrera: [],
            aprobaciones_escuela: [],
            historial: [{
              fecha: new Date().toISOString(),
              usuario: user.name,
              rol: 'docente',
              accion: 'crear',
              mensaje: "Borrador creado."
            }]
          };
        }
      }

      let paId = editingPA.id || "";
      if (paId) {
        // Update existing PA
        await pb.collection('programas_analiticos').update(paId, payload);
      } else {
        // Create new PA
        const createdPa = await pb.collection('programas_analiticos').create(payload);
        paId = createdPa.id;
      }

      // Save/sync units
      // Easiest sync way: delete all existing units for this PA, and insert all current ones
      const existingUnits = await pb.collection('unidades').getFullList<Unidad>({
        filter: `pa_id = "${paId}"`
      });
      for (const u of existingUnits) {
        await pb.collection('unidades').delete(u.id);
      }

      for (const u of editingUnidades) {
        await pb.collection('unidades').create({
          pa_id: paId,
          titulo: u.titulo,
          semanas_dictado: u.semanas_dictado,
          actividades: u.actividades,
          biblio_obligatoria: u.biblio_obligatoria,
          biblio_complementaria: u.biblio_complementaria
        });
      }

      showMessage(submitToReview ? "Programa presentado con éxito." : "Borrador guardado con éxito.", "success");
      handleCloseWizard();
    } catch (err: any) {
      console.error(err);
      showMessage("Error al guardar en el servidor: " + err.message, "error");
    } finally {
      actionLoading = false;
    }
  }

  function handleNextStep() {
    if (currentStep === 1 && !isHoursValid) {
      showMessage("No puede avanzar. Las horas no coinciden.", "error");
      return;
    }
    if (currentStep === 3 && !isWeeksCovered) {
      showMessage("No puede avanzar. Debe cubrir exactamente las 16 semanas sin vacíos ni duplicados.", "error");
      return;
    }
    
    currentStep++;
  }

  function handlePrevStep() {
    currentStep--;
  }
</script>

<div class="space-y-6 max-w-6xl mx-auto py-6 text-slate-100 font-sans">
  
  {#if message}
    <div class="p-4 rounded-2xl border text-sm flex items-center gap-3 shadow-lg transition-all duration-350 {messageType === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}">
      <span class="font-semibold">{message}</span>
    </div>
  {/if}

  {#if !editingPA}
    <!-- Main Dashboard view -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Solicitudes de Programas Analíticos</h2>
          <p class="text-xs text-slate-400">Acceda a crear o modificar los programas analíticos que le han sido solicitados.</p>
        </div>
        {#if activeWindow}
          <div class="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Ventana {activeWindow.anio_lectivo} Abierta (Hasta {new Date(activeWindow.fecha_fin).toLocaleDateString()})
          </div>
        {:else}
          <div class="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            Edición cerrada (Fuera de ventana de actualización)
          </div>
        {/if}
      </div>

      <div class="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/20 overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead>
            <tr class="bg-slate-900 border-b border-slate-850 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th class="p-3">Notificación</th>
              <th class="p-3">Asignatura</th>
              <th class="p-3">Carreras vinculadas</th>
              <th class="p-3">Tipo</th>
              <th class="p-3">Estado PA</th>
              <th class="p-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850/80">
            {#if notifications.length === 0}
              <tr>
                <td colspan="6" class="p-8 text-center text-slate-650">No tiene solicitudes asignadas en este momento.</td>
              </tr>
            {:else}
              {#each notifications as n}
                {@const status = getStatusLabel(n)}
                {@const pa = getPAForNotification(n)}
                {@const editable = isEditable(n)}
                {@const asigs = n.expand?.asignatura || []}
                <tr class="hover:bg-slate-900/30 transition-colors">
                  <td class="p-3 text-slate-450 font-mono">{new Date(n.created).toLocaleDateString()}</td>
                  <td class="p-3">
                    <div class="font-bold text-white">({asigs[0]?.codigo}) {asigs[0]?.nombre}</div>
                    <div class="text-[10px] text-slate-500">Interacción: {asigs[0]?.horas_interaccion_pedagogica} hs</div>
                  </td>
                  <td class="p-3">
                    <div class="text-slate-300 font-semibold space-y-0.5">
                      {#each asigs as a}
                        <div>• {a.carrera}</div>
                      {/each}
                    </div>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold border {n.tipo === 'no_lineal' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}">
                      {n.tipo === 'no_lineal' ? 'No Lineal' : 'Lineal'}
                    </span>
                  </td>
                  <td class="p-3">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold border tracking-wide uppercase {status.color}">
                      {status.label}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    {#if editable}
                      <button 
                        onclick={() => handleOpenWizard(n)}
                        class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {pa ? 'Editar Programa' : 'Crear Programa'}
                      </button>
                    {:else if pa}
                      <span class="text-[10px] text-slate-500 italic pr-2">Solo lectura (Enviado)</span>
                    {:else}
                      <span class="text-[10px] text-rose-500 italic pr-2">Edición cerrada</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <!-- Wizard editor view -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      
      <!-- Wizard Title Header -->
      <div class="px-6 py-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
        <div>
          <span class="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">Creador de Programa Analítico</span>
          <h3 class="text-base font-bold text-white">
            {#if primaryAsignatura}
              ({primaryAsignatura.codigo}) {primaryAsignatura.nombre}
            {/if}
          </h3>
        </div>
        <button 
          onclick={handleCloseWizard}
          class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          Volver a Solicitudes
        </button>
      </div>

      <!-- Stepper Progress Bar -->
      <div class="px-6 py-5 bg-slate-950/20 border-b border-slate-850/80 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        <div class="space-y-1.5" class:text-indigo-400={currentStep >= 1} class:text-slate-500={currentStep < 1}>
          <div class="h-1 rounded-full bg-slate-800" class:bg-indigo-500={currentStep >= 1}></div>
          <span>1. Datos</span>
        </div>
        <div class="space-y-1.5" class:text-indigo-400={currentStep >= 2} class:text-slate-500={currentStep < 2}>
          <div class="h-1 rounded-full bg-slate-800" class:bg-indigo-500={currentStep >= 2}></div>
          <span>2. Contenidos</span>
        </div>
        <div class="space-y-1.5" class:text-indigo-400={currentStep >= 3} class:text-slate-500={currentStep < 3}>
          <div class="h-1 rounded-full bg-slate-800" class:bg-indigo-500={currentStep >= 3}></div>
          <span>3. Unidades</span>
        </div>
        <div class="space-y-1.5" class:text-indigo-400={currentStep >= 4} class:text-slate-500={currentStep < 4}>
          <div class="h-1 rounded-full bg-slate-800" class:bg-indigo-500={currentStep >= 4}></div>
          <span>4. Evaluación</span>
        </div>
      </div>

      <!-- Step content container -->
      <div class="p-6 md:p-8 min-h-[350px]">
        
        <!-- STEP 1: DATOS HORAS -->
        {#if currentStep === 1}
          <div class="space-y-6">
            <h4 class="text-base font-bold text-white border-b border-slate-850 pb-2">Paso 1: Distribución Horaria del Programa</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Info cards -->
              <div class="p-5 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-4">
                <h5 class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Datos de Asignatura</h5>
                <div class="space-y-2 text-xs">
                  <div>
                    <span class="block text-slate-500">Materia</span>
                    <strong class="text-sm text-white">{primaryAsignatura?.nombre}</strong>
                  </div>
                  <div>
                    <span class="block text-slate-500">Código Guaraní</span>
                    <strong class="text-sm text-slate-300 font-mono">{primaryAsignatura?.codigo}</strong>
                  </div>
                  <div>
                    <span class="block text-slate-500">Horas de Interacción Pedagógica Obligatorias</span>
                    <strong class="text-sm text-indigo-400">{reqHours} horas reloj</strong>
                  </div>
                </div>
              </div>

              <!-- Input fields -->
              <div class="space-y-4">
                <h5 class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Cargar Horas Semanales / Totales</h5>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="hours-theoretical" class="block text-xs font-semibold text-slate-400 mb-1.5">Presencial (Teórica)</label>
                    <input 
                      id="hours-theoretical"
                      type="number" 
                      min="0"
                      bind:value={editingPA!.horas_teoricas}
                      class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label for="hours-practical" class="block text-xs font-semibold text-slate-400 mb-1.5">Práctica</label>
                    <input 
                      id="hours-practical"
                      type="number" 
                      min="0"
                      bind:value={editingPA!.horas_practicas}
                      class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label for="hours-distance" class="block text-xs font-semibold text-slate-400 mb-1.5">A Distancia (Virtual)</label>
                    <input 
                      id="hours-distance"
                      type="number" 
                      min="0"
                      bind:value={editingPA!.horas_distancia}
                      class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label for="hours-autonomous" class="block text-xs font-semibold text-slate-400 mb-1.5">Autónoma (Alumno)</label>
                    <input 
                      id="hours-autonomous"
                      type="number" 
                      min="0"
                      bind:value={editingPA!.horas_autonomas}
                      class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <!-- Hours validation banner -->
                <div class="p-3.5 rounded-xl border flex flex-col gap-1 text-xs {isHoursValid ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}">
                  <div class="flex justify-between font-bold">
                    <span>Horas Teóricas + Prácticas:</span>
                    <span>{sumHours} / {reqHours} hs</span>
                  </div>
                  {#if isHoursValid}
                    <span>✔ Coincidencia correcta. Botón de Siguiente habilitado.</span>
                  {:else}
                    <span>✘ Error: La suma ({sumHours} hs) debe ser exactamente igual a las horas estipuladas ({reqHours} hs).</span>
                  {/if}
                </div>

              </div>

            </div>
          </div>
        {/if}

        <!-- STEP 2: CONTENIDOS -->
        {#if currentStep === 2}
          <div class="space-y-6">
            <h4 class="text-base font-bold text-white border-b border-slate-850 pb-2">Paso 2: Contenidos Académicos</h4>
            
            <div class="space-y-4">
              <RichEditor 
                id="pa-fundamentacion"
                label="Fundamentación de la asignatura"
                placeholder="Escriba la fundamentación del programa analítico..."
                bind:value={editingPA!.fundamentacion}
              />

              <RichEditor 
                id="pa-propositos"
                label="Propósitos Pedagógicos"
                placeholder="Escriba los propósitos de la asignatura..."
                bind:value={editingPA!.propositos}
              />

              <RichEditor 
                id="pa-metodologia"
                label="Metodología de enseñanza y aprendizaje"
                placeholder="Metodologías, dinámicas y enfoques de cursado..."
                bind:value={editingPA!.metodologia}
              />

              <!-- Informativos: Perspectiva de género & Actividades de extensión -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-950/40 border border-slate-850 rounded-2xl">
                <!-- Género -->
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <input 
                      id="checkbox-genero"
                      type="checkbox" 
                      bind:checked={editingPA!.perspectiva_genero}
                      class="w-4 h-4 text-indigo-600 border-slate-800 bg-slate-950 focus:ring-indigo-500 focus:ring-0 rounded cursor-pointer"
                    />
                    <label for="checkbox-genero" class="text-xs font-bold text-slate-350 select-none cursor-pointer">¿Posee perspectiva de género?</label>
                  </div>
                  {#if editingPA!.perspectiva_genero}
                    <div class="pl-7 space-y-1">
                      <label for="desc-genero" class="block text-[10px] font-semibold text-indigo-400">Descripción requerida (Informativa interna):</label>
                      <textarea 
                        id="desc-genero"
                        bind:value={editingPA!.descripcion_genero}
                        placeholder="Describa cómo se aborda la perspectiva de género..."
                        class="w-full text-xs p-3 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
                        required={editingPA!.perspectiva_genero}
                      ></textarea>
                    </div>
                  {/if}
                </div>

                <!-- Extensión -->
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <input 
                      id="checkbox-extension"
                      type="checkbox" 
                      bind:checked={editingPA!.actividades_extension}
                      class="w-4 h-4 text-indigo-600 border-slate-800 bg-slate-950 focus:ring-indigo-500 focus:ring-0 rounded cursor-pointer"
                    />
                    <label for="checkbox-extension" class="text-xs font-bold text-slate-350 select-none cursor-pointer">¿Incluye actividades de extensión?</label>
                  </div>
                  {#if editingPA!.actividades_extension}
                    <div class="pl-7 space-y-1">
                      <label for="desc-extension" class="block text-[10px] font-semibold text-indigo-400">Descripción requerida (Informativa interna):</label>
                      <textarea 
                        id="desc-extension"
                        bind:value={editingPA!.descripcion_extension}
                        placeholder="Describa las actividades de extensión..."
                        class="w-full text-xs p-3 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
                        required={editingPA!.actividades_extension}
                      ></textarea>
                    </div>
                  {/if}
                </div>
              </div>

            </div>
          </div>
        {/if}

        <!-- STEP 3: UNIDADES Y SEMANAS -->
        {#if currentStep === 3}
          <div class="space-y-6">
            <div class="flex justify-between items-center border-b border-slate-850 pb-2">
              <h4 class="text-base font-bold text-white">Paso 3: Carga de Unidades y Semanas de Dictado</h4>
              <button 
                type="button"
                onclick={handleAddUnit}
                class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Agregar Unidad</span>
              </button>
            </div>

            <!-- Weeks Checker indicator -->
            <div class="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span class="text-xs font-bold text-slate-350">Control de semanas de cursada (Debe cubrir exactamente 16 semanas):</span>
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border {isWeeksCovered ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}">
                  {isWeeksCovered ? 'Semanas Cubiertas' : 'Semanas Incompletas'}
                </span>
              </div>
              
              <!-- Week list indicator grid -->
              <div class="grid grid-cols-8 sm:grid-cols-16 gap-1.5 text-center font-mono">
                {#each Array(16) as _, wIndex}
                  {@const weekNum = wIndex + 1}
                  {@const count = weekStats[weekNum]}
                  <div 
                    class="py-2.5 rounded-lg text-xs font-bold border transition-all duration-200 {count === 1 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : count > 1 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-650'}"
                    title="Semana {weekNum}: {count === 0 ? 'Sin asignar' : count === 1 ? 'Asignada una vez' : `Asignada ${count} veces`}"
                  >
                    {weekNum}
                  </div>
                {/each}
              </div>
              <p class="text-[10px] text-slate-500 leading-relaxed pl-1">
                * Las semanas con fondo verde están asignadas a una sola unidad. Las semanas oscuras no están asignadas. Las semanas rojas están duplicadas.
              </p>
            </div>

            <!-- Units List Accordion/Cards -->
            {#if editingUnidades.length === 0}
              <div class="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                No ha cargado ninguna unidad didáctica todavía. Haga clic en "+ Agregar Unidad" arriba.
              </div>
            {:else}
              <div class="space-y-6">
                {#each editingUnidades as unit, uIndex}
                  <div class="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4 relative">
                    <!-- Remove Button -->
                    <button 
                      type="button" 
                      onclick={() => handleRemoveUnit(uIndex)}
                      class="absolute top-4 right-4 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="Eliminar Unidad"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>

                    <h5 class="text-xs uppercase tracking-wider text-slate-500 font-bold">Unidad #{uIndex + 1}</h5>

                    <!-- Unit title input -->
                    <div>
                      <label for="unit-title-{uIndex}" class="block text-xs font-semibold text-slate-400 mb-1">Título de la Unidad</label>
                      <input 
                        id="unit-title-{uIndex}"
                        type="text" 
                        bind:value={unit.titulo}
                        placeholder="Ej: Introducción a la programación"
                        class="w-full max-w-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100"
                        required
                      />
                    </div>

                    <!-- Weeks Checklist selector -->
                    <div>
                      <span class="block text-xs font-semibold text-slate-400 mb-1.5">Semanas de dictado para esta unidad:</span>
                      <div class="flex flex-wrap gap-1">
                        {#each Array(16) as _, wIndex}
                          {@const week = wIndex + 1}
                          {@const selected = unit.semanas_dictado?.includes(week)}
                          <button 
                            type="button"
                            onclick={() => toggleWeekInUnit(uIndex, week)}
                            class="w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all duration-200 border cursor-pointer"
                            class:bg-indigo-650={selected}
                            class:border-indigo-550={selected}
                            class:text-white={selected}
                            class:bg-slate-950={!selected}
                            class:border-slate-850={!selected}
                            class:text-slate-450={!selected}
                            class:hover:bg-slate-800={!selected}
                          >
                            {week}
                          </button>
                        {/each}
                      </div>
                    </div>

                    <div class="space-y-4">
                      <div>
                        <label for="unit-activities-{uIndex}" class="block text-xs font-semibold text-slate-400 mb-1">Actividades de Aprendizaje</label>
                        <textarea 
                          id="unit-activities-{uIndex}"
                          bind:value={unit.actividades}
                          placeholder="Descripción breve de los trabajos prácticos, lecturas, etc..."
                          class="w-full text-xs p-3 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
                          rows="2"
                        ></textarea>
                      </div>

                      <RichEditor 
                        id="unit-biblio-o-{uIndex}"
                        label="Bibliografía Obligatoria"
                        placeholder="Autor, Título, Editorial, Año..."
                        bind:value={unit.biblio_obligatoria}
                      />

                      <RichEditor 
                        id="unit-biblio-c-{uIndex}"
                        label="Bibliografía Complementaria"
                        placeholder="Otras lecturas recomendadas..."
                        bind:value={unit.biblio_complementaria}
                      />
                    </div>

                  </div>
                {/each}
              </div>
            {/if}

          </div>
        {/if}

        <!-- STEP 4: EVALUACIÓN -->
        {#if currentStep === 4}
          <div class="space-y-6">
            <h4 class="text-base font-bold text-white border-b border-slate-850 pb-2">Paso 4: Régimen de Evaluación y Acreditación</h4>

            <div class="space-y-4">
              <RichEditor 
                id="pa-propuesta-eval"
                label="Propuesta de Evaluación"
                placeholder="Exámenes, monografías, participación, entregas parciales..."
                bind:value={editingPA!.propuesta_evaluacion}
              />

              <RichEditor 
                id="pa-requisitos-acred"
                label="Requisitos de Acreditación (Aprobación)"
                placeholder="Asistencia mínima, notas requeridas, etc..."
                bind:value={editingPA!.requisitos_acreditacion}
              />

              <!-- Promocionable & Libre toggles -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-950/40 border border-slate-850 rounded-2xl text-xs">
                
                <!-- Promocionable trigger -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <input 
                      id="checkbox-promocionable"
                      type="checkbox" 
                      bind:checked={editingPA!.promocionable}
                      class="w-4 h-4 text-indigo-600 border-slate-850 bg-slate-950 focus:ring-indigo-500 focus:ring-0 rounded cursor-pointer"
                    />
                    <label for="checkbox-promocionable" class="font-bold text-slate-350 select-none cursor-pointer">¿La asignatura admite régimen de Promocionable?</label>
                  </div>
                  
                  {#if editingPA!.promocionable}
                    <div class="pl-7 space-y-1.5">
                      <label for="select-escala" class="block font-semibold text-indigo-400">Escala de Calificación requerida:</label>
                      <select 
                        id="select-escala"
                        bind:value={editingPA!.escala_promocionable}
                        class="bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-100"
                        required={editingPA!.promocionable}
                      >
                        <option value="ninguna">-- Seleccionar Escala --</option>
                        <option value="escala_1_10">Escala numérica 1 a 10</option>
                        <option value="escala_aprobado_reprobado">Aprobado / Reprobado</option>
                        <option value="escala_letras">Escala cualitativa (Letras A-F)</option>
                      </select>
                    </div>
                  {/if}
                </div>

                <!-- Rendirse Libre trigger -->
                <div class="space-y-2 flex flex-col justify-start">
                  <div class="flex items-center gap-3 mt-1">
                    <input 
                      id="checkbox-libre"
                      type="checkbox" 
                      bind:checked={editingPA!.rendirse_libre}
                      class="w-4 h-4 text-indigo-600 border-slate-850 bg-slate-950 focus:ring-indigo-500 focus:ring-0 rounded cursor-pointer"
                    />
                    <label for="checkbox-libre" class="font-bold text-slate-350 select-none cursor-pointer">¿Se puede rendir la asignatura en condición de Libre?</label>
                  </div>
                  <p class="pl-7 text-[10px] text-slate-500">
                    Active esta casilla si el alumno cuenta con la posibilidad de rendir el examen final en calidad de alumno no regular (Libre).
                  </p>
                </div>

              </div>

            </div>
          </div>
        {/if}

      </div>

      <!-- Wizard action footer -->
      <div class="px-6 py-4 bg-slate-850 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Draft status info -->
        <span class="text-xs text-slate-450 italic">
          * Los borradores permanecen en su bandeja para posterior edición.
        </span>

        <div class="flex items-center gap-3 self-end sm:self-auto">
          <!-- Back button -->
          {#if currentStep > 1}
            <button 
              type="button" 
              onclick={handlePrevStep}
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors font-semibold text-xs cursor-pointer"
            >
              Anterior
            </button>
          {/if}

          <!-- Guardar Borrador (Available on any step) -->
          <button 
            type="button" 
            onclick={() => saveDatabase(false)}
            disabled={actionLoading}
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-650 hover:text-white text-slate-250 border border-slate-700 transition-all font-semibold text-xs cursor-pointer"
          >
            Guardar Borrador
          </button>

          <!-- Next or Submit -->
          {#if currentStep < 4}
            <button 
              type="button" 
              onclick={handleNextStep}
              class="px-5 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white transition-colors font-semibold text-xs cursor-pointer"
            >
              Siguiente
            </button>
          {:else}
            <button 
              type="button" 
              onclick={() => saveDatabase(true)}
              disabled={actionLoading}
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-550 active:bg-emerald-750 text-white transition-colors font-semibold text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-650/20"
            >
              {#if actionLoading}
                <span>Guardando...</span>
              {:else}
                <span>Presentar Programa</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {/if}
            </button>
          {/if}
        </div>
      </div>

    </div>
  {/if}

</div>
