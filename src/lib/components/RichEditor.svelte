<!-- src/lib/components/RichEditor.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    value: string;
    label?: string;
    placeholder?: string;
    id?: string;
  }

  let { value = $bindable(), label = "", placeholder = "", id = "" }: Props = $props();

  let textareaEl: HTMLTextAreaElement | null = $state(null);

  function insertTag(openTag: string, closeTag: string) {
    if (!textareaEl) return;
    const start = textareaEl.selectionStart;
    const end = textareaEl.selectionEnd;
    const text = textareaEl.value;
    const selected = text.substring(start, end);
    const replacement = openTag + (selected || "texto") + closeTag;
    
    value = text.substring(0, start) + replacement + text.substring(end);
    
    // Restore focus and selection
    setTimeout(() => {
      if (!textareaEl) return;
      textareaEl.focus();
      textareaEl.setSelectionRange(start + openTag.length, start + openTag.length + (selected || "texto").length);
    }, 50);
  }

  function addBold() {
    insertTag("<strong>", "</strong>");
  }

  function addItalic() {
    insertTag("<em>", "</em>");
  }

  function addBulletList() {
    insertTag("\n<ul>\n  <li>", "</li>\n</ul>\n");
  }

  function addNumberedList() {
    insertTag("\n<ol>\n  <li>", "</li>\n</ol>\n");
  }

  function addLineBreak() {
    insertTag("<br>", "");
  }
</script>

<div class="flex flex-col w-full text-slate-100">
  {#if label}
    <label for={id} class="text-sm font-semibold mb-1 text-indigo-300">{label}</label>
  {/if}
  
  <div class="border border-slate-700 rounded-lg overflow-hidden bg-slate-900 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
    <!-- Toolbar -->
    <div class="flex items-center gap-1 bg-slate-850 border-b border-slate-800 p-2 flex-wrap">
      <button 
        type="button" 
        onclick={addBold} 
        class="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700" 
        title="Negrita"
      >
        B
      </button>
      <button 
        type="button" 
        onclick={addItalic} 
        class="px-2.5 py-1 text-xs italic rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700" 
        title="Itálica"
      >
        I
      </button>
      <button 
        type="button" 
        onclick={addBulletList} 
        class="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700" 
        title="Lista con viñetas"
      >
        • Lista
      </button>
      <button 
        type="button" 
        onclick={addNumberedList} 
        class="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700" 
        title="Lista numerada"
      >
        1. Lista
      </button>
      <button 
        type="button" 
        onclick={addLineBreak} 
        class="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700" 
        title="Salto de línea"
      >
        ↵ Salto
      </button>
      <span class="text-xs text-slate-500 ml-auto hidden sm:inline-block">Formatos HTML admitidos</span>
    </div>

    <!-- Textarea -->
    <textarea
      bind:this={textareaEl}
      {id}
      {placeholder}
      bind:value
      rows="5"
      class="w-full bg-transparent border-0 p-3 text-slate-100 text-sm focus:outline-none focus:ring-0 resize-y min-h-[100px]"
    ></textarea>
  </div>
</div>
