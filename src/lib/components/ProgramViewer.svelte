<!-- src/lib/components/ProgramViewer.svelte -->
<script lang="ts">
  import type { ProgramaAnalitico, Asignatura, Unidad } from '../pb';

  interface Props {
    pa: ProgramaAnalitico;
    asignaturas: Asignatura[];
    unidades: Unidad[];
    publicMode?: boolean;
    onClose?: () => void;
  }

  let { pa, asignaturas, unidades, publicMode = true, onClose }: Props = $props();

  // Find associated subjects
  const linkedAsignaturas = $derived(
    asignaturas.filter(a => pa.asignatura_id.includes(a.id))
  );

  const primaryAsignatura = $derived(linkedAsignaturas[0] || null);

  // Group careers
  const carreras = $derived(linkedAsignaturas.map(a => a.carrera));
  const uniqueCarreras = $derived([...new Set(carreras)]);

  // Group schools
  const escuelas = $derived(linkedAsignaturas.map(a => a.escuela || "Sin Escuela"));
  const uniqueEscuelas = $derived([...new Set(escuelas)]);

  // Sorting units by their first week
  const sortedUnidades = $derived(
    [...unidades].sort((a, b) => {
      const aMin = Math.min(...(a.semanas_dictado || [99]));
      const bMin = Math.min(...(b.semanas_dictado || [99]));
      return aMin - bMin;
    })
  );

  // Helper to format scale names
  function formatEscala(escala: string) {
    switch(escala) {
      case 'escala_1_10': return 'Numérica (1 a 10)';
      case 'escala_aprobado_reprobado': return 'Aprobado / Reprobado';
      case 'escala_letras': return 'Cualitativa (Letras A-F)';
      default: return 'Ninguna / Escala General';
    }
  }

  function handlePrint() {
    window.print();
  }
</script>

<div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none">
  
  <!-- Header / Actions -->
  <div class="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800 print:hidden">
    <div class="flex items-center gap-2">
      <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
      <h3 class="text-sm font-semibold tracking-wider text-slate-300 uppercase">Vista del Programa Analítico</h3>
      {#if publicMode}
        <span class="px-2 py-0.5 text-[10px] rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold uppercase">Público / Solo Lectura</span>
      {:else}
        <span class="px-2 py-0.5 text-[10px] rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold uppercase">Vista Auditor / Interna</span>
      {/if}
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        onclick={handlePrint}
        class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14" rx="1"/></svg>
        Imprimir
      </button>
      
      {#if onClose}
        <button 
          onclick={onClose}
          class="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      {/if}
    </div>
  </div>

  <!-- Main Document Content -->
  <div class="p-8 md:p-12 space-y-8 print:p-0 print:text-black">
    
    <!-- Title Page / Document Header -->
    <div class="text-center pb-8 border-b border-slate-800 print:border-slate-300">
      <h1 class="text-3xl font-extrabold text-white print:text-black tracking-tight mb-2">PROGRAMA ANALÍTICO</h1>
      {#if primaryAsignatura}
        <h2 class="text-xl font-bold text-indigo-400 print:text-black">({primaryAsignatura.codigo}) {primaryAsignatura.nombre}</h2>
      {/if}
      <div class="mt-4 flex flex-wrap gap-2 justify-center text-xs text-slate-400 print:text-black">
        <span class="px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700 print:border-none print:bg-transparent">
          Vigencia: Ciclo Lectivo {new Date(pa.created || Date.now()).getFullYear()}
        </span>
        <span class="px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700 print:border-none print:bg-transparent">
          Estado: <strong class="uppercase text-indigo-400 print:text-black">{pa.estado}</strong>
        </span>
      </div>
    </div>

    <!-- Metadata Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-950/40 rounded-2xl border border-slate-800/80 print:bg-transparent print:border-slate-350 print:p-2">
      <div class="space-y-3">
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-slate-500">Carrera(s)</span>
          <span class="font-semibold text-slate-200 text-sm print:text-black">{uniqueCarreras.join(', ')}</span>
        </div>
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-slate-500">Escuela(s)</span>
          <span class="font-semibold text-slate-200 text-sm print:text-black">{uniqueEscuelas.join(', ')}</span>
        </div>
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-slate-500">Docente Responsable</span>
          <span class="font-semibold text-slate-200 text-sm print:text-black">{pa.expand?.docente_id?.name || 'Cargando...'} ({pa.expand?.docente_id?.email})</span>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-slate-500">Distribución de Horas Reloj</span>
          <div class="grid grid-cols-2 gap-2 mt-1.5 text-xs text-slate-300 print:text-black">
            <div class="p-2 bg-slate-900 border border-slate-800 rounded-lg print:border-none print:bg-transparent print:p-0">
              <span class="block text-[10px] text-slate-500">Horas Presenciales (Teóricas)</span>
              <strong class="text-sm text-white print:text-black">{pa.horas_teoricas} hs</strong>
            </div>
            <div class="p-2 bg-slate-900 border border-slate-800 rounded-lg print:border-none print:bg-transparent print:p-0">
              <span class="block text-[10px] text-slate-500">Horas Prácticas</span>
              <strong class="text-sm text-white print:text-black">{pa.horas_practicas} hs</strong>
            </div>
            <div class="p-2 bg-slate-900 border border-slate-800 rounded-lg print:border-none print:bg-transparent print:p-0 col-span-2 flex justify-between items-center">
              <div>
                <span class="block text-[10px] text-slate-500">Interacción Pedagógica Estipulada</span>
                <strong class="text-sm text-indigo-400 print:text-black">{primaryAsignatura?.horas_interaccion_pedagogica || (pa.horas_teoricas + pa.horas_practicas)} hs</strong>
              </div>
              <div class="text-right">
                <span class="block text-[10px] text-slate-500">Horas a Distancia</span>
                <strong class="text-sm text-white print:text-black">{pa.horas_distancia} hs</strong>
              </div>
            </div>
            <div class="p-2 bg-slate-900 border border-slate-800 rounded-lg print:border-none print:bg-transparent print:p-0 col-span-2">
              <span class="block text-[10px] text-slate-500">Horas Trabajo Autónomo Alumno</span>
              <strong class="text-sm text-white print:text-black">{pa.horas_autonomas} hs</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Syllabus Sections -->
    <div class="space-y-6">
      
      <!-- Section 1: Fundamentacion -->
      <div class="space-y-2">
        <h3 class="text-lg font-bold text-white print:text-black border-b border-slate-800 print:border-slate-350 pb-1 uppercase tracking-tight">1. Fundamentación</h3>
        <div class="text-slate-300 text-sm leading-relaxed print:text-black max-w-none">
          {#if pa.fundamentacion}
            {@html pa.fundamentacion}
          {:else}
            <p class="italic text-slate-500">No especificada.</p>
          {/if}
        </div>
      </div>

      <!-- Section 2: Propositos -->
      <div class="space-y-2">
        <h3 class="text-lg font-bold text-white print:text-black border-b border-slate-800 print:border-slate-350 pb-1 uppercase tracking-tight">2. Propósitos pedagógicos</h3>
        <div class="text-slate-300 text-sm leading-relaxed print:text-black max-w-none">
          {#if pa.propositos}
            {@html pa.propositos}
          {:else}
            <p class="italic text-slate-500">No especificados.</p>
          {/if}
        </div>
      </div>

      <!-- Section 3: Metodologia -->
      <div class="space-y-2">
        <h3 class="text-lg font-bold text-white print:text-black border-b border-slate-800 print:border-slate-350 pb-1 uppercase tracking-tight">3. Metodología de enseñanza y aprendizaje</h3>
        <div class="text-slate-300 text-sm leading-relaxed print:text-black max-w-none">
          {#if pa.metodologia}
            {@html pa.metodologia}
          {:else}
            <p class="italic text-slate-500">No especificada.</p>
          {/if}
        </div>
      </div>

      <!-- Section 4: Unidades -->
      <div class="space-y-3">
        <h3 class="text-lg font-bold text-white print:text-black border-b border-slate-800 print:border-slate-350 pb-1 uppercase tracking-tight">4. Unidades Didácticas (Planificación de las 16 semanas)</h3>
        {#if sortedUnidades.length === 0}
          <p class="italic text-slate-500 text-sm">No hay unidades cargadas.</p>
        {:else}
          <div class="space-y-4">
            {#each sortedUnidades as u, i}
              <div class="p-5 bg-slate-950/20 border border-slate-800 rounded-2xl space-y-3 print:border-slate-300 print:p-2">
                <div class="flex justify-between items-start gap-4 border-b border-slate-900 pb-2 print:border-slate-200">
                  <h4 class="font-bold text-slate-200 text-sm print:text-black">Unidad {i + 1}: {u.titulo}</h4>
                  <span class="shrink-0 text-xs px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-semibold rounded-full print:border-none print:text-black print:p-0">
                    Semanas: {[...u.semanas_dictado].sort((a,b)=>a-b).join(', ')}
                  </span>
                </div>
                <div class="grid grid-cols-1 gap-3 text-xs">
                  {#if u.actividades}
                    <div>
                      <strong class="text-indigo-300 uppercase tracking-wider text-[10px] print:text-black">Actividades principales:</strong>
                      <p class="text-slate-300 mt-1 print:text-black">{u.actividades}</p>
                    </div>
                  {/if}
                  {#if u.biblio_obligatoria}
                    <div>
                      <strong class="text-indigo-300 uppercase tracking-wider text-[10px] print:text-black">Bibliografía Obligatoria:</strong>
                      <div class="text-slate-300 mt-1 print:text-black">{@html u.biblio_obligatoria}</div>
                    </div>
                  {/if}
                  {#if u.biblio_complementaria}
                    <div>
                      <strong class="text-indigo-300 uppercase tracking-wider text-[10px] print:text-black">Bibliografía Complementaria:</strong>
                      <div class="text-slate-300 mt-1 print:text-black">{@html u.biblio_complementaria}</div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Section 5: Evaluacion -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white print:text-black border-b border-slate-800 print:border-slate-350 pb-1 uppercase tracking-tight">5. Régimen de Evaluación y Acreditación</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-950/30 border border-slate-800 rounded-xl print:border-none print:bg-transparent print:p-0">
            <span class="block text-[10px] uppercase tracking-wider text-slate-500">¿Es materia promocionable?</span>
            <span class="text-sm font-semibold text-slate-200 print:text-black">
              {pa.promocionable ? 'Sí' : 'No'}
            </span>
            {#if pa.promocionable}
              <span class="block text-[10px] uppercase tracking-wider text-slate-500 mt-2">Escala de Promoción</span>
              <span class="text-xs font-semibold text-slate-300 print:text-black">{formatEscala(pa.escala_promocionable)}</span>
            {/if}
          </div>

          <div class="p-4 bg-slate-950/30 border border-slate-800 rounded-xl print:border-none print:bg-transparent print:p-0">
            <span class="block text-[10px] uppercase tracking-wider text-slate-500">¿Admite rendirse en condición de Libre?</span>
            <span class="text-sm font-semibold text-slate-200 print:text-black">
              {pa.rendirse_libre ? 'Sí, la materia admite rendir en condición de alumno libre.' : 'No, no se admite rendir en condición de alumno libre.'}
            </span>
          </div>
        </div>

        <div class="space-y-2 mt-2">
          <strong class="block text-xs text-indigo-300 uppercase tracking-wider print:text-black">Propuesta de Evaluación</strong>
          <div class="text-slate-300 text-sm leading-relaxed print:text-black">
            {#if pa.propuesta_evaluacion}
              {@html pa.propuesta_evaluacion}
            {:else}
              <p class="italic text-slate-500">No especificada.</p>
            {/if}
          </div>
        </div>

        <div class="space-y-2">
          <strong class="block text-xs text-indigo-300 uppercase tracking-wider print:text-black">Requisitos de Acreditación (Aprobación)</strong>
          <div class="text-slate-300 text-sm leading-relaxed print:text-black">
            {#if pa.requisitos_acreditacion}
              {@html pa.requisitos_acreditacion}
            {:else}
              <p class="italic text-slate-500">No especificados.</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Section 6: Perspectiva y Extension (Hiden in publicMode, shown as Info in AuditorMode) -->
      {#if !publicMode}
        <div class="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-5 space-y-4 print:hidden">
          <div class="flex items-center gap-2 border-b border-amber-500/10 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-400"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
            <h4 class="font-bold text-amber-300 text-sm uppercase tracking-wider">Datos Informativos Internos (Ocultos al Público)</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <strong class="block text-amber-250 uppercase tracking-wider text-[10px]">Perspectiva de Género:</strong>
              <span class="font-semibold text-slate-200">{pa.perspectiva_genero ? 'Sí' : 'No'}</span>
              {#if pa.perspectiva_genero && pa.descripcion_genero}
                <p class="text-slate-400 mt-1.5 p-3 rounded-lg bg-slate-950/50">{pa.descripcion_genero}</p>
              {/if}
            </div>

            <div>
              <strong class="block text-amber-250 uppercase tracking-wider text-[10px]">Actividades de Extensión:</strong>
              <span class="font-semibold text-slate-200">{pa.actividades_extension ? 'Sí' : 'No'}</span>
              {#if pa.actividades_extension && pa.descripcion_extension}
                <p class="text-slate-400 mt-1.5 p-3 rounded-lg bg-slate-950/50">{pa.descripcion_extension}</p>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Historical Audit logs (Auditor Mode) -->
      {#if !publicMode && pa.historial_revisiones?.historial?.length}
        <div class="border border-slate-800 rounded-2xl p-5 space-y-3 print:hidden">
          <h4 class="font-bold text-slate-300 text-xs uppercase tracking-wider border-b border-slate-850 pb-2">Historial de Revisiones</h4>
          <div class="space-y-3 max-h-[200px] overflow-y-auto pr-1">
            {#each pa.historial_revisiones.historial as hist}
              <div class="text-xs p-2.5 rounded-lg bg-slate-950/30 border border-slate-900 flex flex-col gap-1">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-slate-200">{hist.usuario} ({hist.rol.toUpperCase()})</span>
                  <span class="text-[10px] text-slate-500">{new Date(hist.fecha).toLocaleString()}</span>
                </div>
                <div>
                  Acción: <strong class="uppercase text-indigo-400">{hist.accion}</strong>
                </div>
                {#if hist.mensaje}
                  <div class="text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-850 mt-1">
                    "{hist.mensaje}"
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}

    </div>

  </div>
</div>
