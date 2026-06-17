<!-- src/lib/components/VisualizadorDashboard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '../pb';
  import type { ProgramaAnalitico, Asignatura, Unidad } from '../pb';
  import ProgramViewer from './ProgramViewer.svelte';

  // State
  let pas: ProgramaAnalitico[] = $state([]);
  let asignaturas: Asignatura[] = $state([]);
  
  let selectedPa: ProgramaAnalitico | null = $state(null);
  let selectedUnidades = $state<Unidad[]>([]);
  
  let searchText = $state("");
  let loading = $state(false);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      // 1. Fetch all asignaturas
      const asigsRes = await pb.collection('asignaturas').getFullList<Asignatura>();
      asignaturas = asigsRes;

      // 2. Fetch all accepted programs
      const pasRes = await pb.collection('programas_analiticos').getFullList<ProgramaAnalitico>({
        filter: 'estado = "aceptado"',
        expand: 'docente_id,asignatura_id',
        sort: '-updated'
      });
      pas = pasRes;
    } catch (err) {
      console.error("Error loading accepted programs:", err);
    } finally {
      loading = false;
    }
  }

  // Filter accepted PAs based on search text (code, name, career)
  const filteredPAs = $derived.by(() => {
    if (searchText.trim() === "") return pas;
    
    return pas.filter(pa => {
      const linkedAsigs = asignaturas.filter(a => pa.asignatura_id.includes(a.id));
      return linkedAsigs.some(a => 
        a.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
        a.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        a.carrera.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  });

  async function handleOpenDetail(pa: ProgramaAnalitico) {
    selectedPa = pa;
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
  }
</script>

<div class="space-y-6 max-w-6xl mx-auto py-6 text-slate-100 font-sans">

  {#if !selectedPa}
    <!-- Public search list -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      <div class="border-b border-slate-800 pb-4 space-y-2">
        <h2 class="text-xl font-bold text-white">Catálogo de Programas Analíticos Aceptados</h2>
        <p class="text-xs text-slate-400">Consulte y descargue los programas analíticos vigentes y validados por las autoridades.</p>
      </div>

      <!-- Search bar -->
      <div class="max-w-md">
        <label for="catalog-search" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Buscador de Materias</label>
        <div class="relative">
          <input 
            id="catalog-search"
            type="text" 
            bind:value={searchText}
            placeholder="Buscar por código Guaraní, asignatura o carrera..."
            class="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all duration-200"
          />
          <svg class="absolute left-3.5 top-3.5 text-slate-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <!-- Table list -->
      <div class="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/20 overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead>
            <tr class="bg-slate-900 border-b border-slate-850 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th class="p-3">Código</th>
              <th class="p-3">Asignatura</th>
              <th class="p-3">Carrera(s)</th>
              <th class="p-3">Docente a cargo</th>
              <th class="p-3">Aceptación</th>
              <th class="p-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850/80">
            {#if filteredPAs.length === 0}
              <tr>
                <td colspan="6" class="p-8 text-center text-slate-650">No se encontraron programas analíticos aceptados en esta consulta.</td>
              </tr>
            {:else}
              {#each filteredPAs as pa}
                {@const linkedAsigs = asignaturas.filter(a => pa.asignatura_id.includes(a.id))}
                <tr class="hover:bg-slate-900/30 transition-colors">
                  <td class="p-3 font-mono text-indigo-400 font-bold">{linkedAsigs[0]?.codigo}</td>
                  <td class="p-3 font-bold text-white">{linkedAsigs[0]?.nombre}</td>
                  <td class="p-3 space-y-0.5 text-slate-350">
                    {#each linkedAsigs as a}
                      <div>• {a.carrera}</div>
                    {/each}
                  </td>
                  <td class="p-3 text-slate-400">{pa.expand?.docente_id?.name || 'Incompleto'}</td>
                  <td class="p-3 text-slate-500">{new Date(pa.updated).toLocaleDateString()}</td>
                  <td class="p-3 text-right">
                    <button 
                      onclick={() => handleOpenDetail(pa)}
                      class="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-400 border border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold text-xs"
                      title="Ver Programa Analítico"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      <span>Ver Programa</span>
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
    <!-- Detail public viewer (publicMode = true forces hiding sensitive details) -->
    <ProgramViewer 
      pa={selectedPa}
      {asignaturas}
      unidades={selectedUnidades}
      publicMode={true}
      onClose={handleCloseDetail}
    />
  {/if}

</div>
