# Contexto del Proyecto: Sistema de Programas Analíticos (SPA)
Actúa como un desarrollador Full-Stack experto en SvelteKit y PocketBase. Tu objetivo es desarrollar un Sistema de Gestión de Programas Analíticos (SPA) para una universidad. La aplicación debe ser extremadamente ligera, consumiendo el mínimo de RAM y CPU posible.

## Stack Tecnológico Requerido
* **Backend & Base de Datos:** PocketBase (Colecciones, Autenticación y Reglas de API).
* **Frontend:** SvelteKit (SSR adaptativo o SPA, usando el adaptador estático o de Node según corresponda) + TailwindCSS para el maquetado.
* **Integración:** PocketBase JS SDK.

## Roles de Usuario y Permisos
[cite_start]El sistema contempla 5 tipos de usuarios con responsabilidades específicas[cite: 17]:
1.  [cite_start]**Notificador/a (DAA):** Inicia el circuito notificando a los docentes[cite: 18].
2.  [cite_start]**Docente:** Creador del Programa Analítico (PA)[cite: 19].
3.  [cite_start]**Validador/Auditor:** Roles progresivos (Dirección de Carrera, Dirección de Escuela, DAA) que revisan el PA[cite: 20].
4.  [cite_start]**Visualizador/a:** Acceso de solo lectura a PAs aceptados[cite: 21].
5.  [cite_start]**Gestión:** Configura ventanas de actualización del sistema[cite: 22].

## Estructura de Base de Datos (Colecciones en PocketBase)
Diseña el esquema de PocketBase con las siguientes colecciones principales:

* `users`: Extensión de la colección por defecto. Añadir campo `role` (Select: docente, d_carrera, d_escuela, daa, gestion, visualizador).
* [cite_start]`asignaturas`: `codigo` (Text), `nombre` (Text), `carrera` (Text), `horas_interaccion_pedagogica` (Number)[cite: 144, 145, 149, 160].
* [cite_start]`notificaciones`: `docente` (Relation -> users), `asignatura` (Relation -> asignaturas), `tipo` (Select: lineal, no_lineal)[cite: 25, 39, 64].
* `programas_analiticos`:
    * Relaciones: `docente_id`, `asignatura_id`.
    * [cite_start]Estado: `estado` (Select: borrador, revision_carrera, revision_escuela, revision_daa, observado, aceptado)[cite: 107, 626, 645, 655].
    * [cite_start]Horas: `horas_distancia`, `horas_teoricas`, `horas_practicas`, `horas_autonomas`[cite: 165, 166, 167, 168].
    * [cite_start]Contenidos: `fundamentacion` (Editor), `propositos` (Editor), `metodologia` (Editor)[cite: 278, 308, 313].
    * [cite_start]Informativos: `perspectiva_genero` (Bool), `actividades_extension` (Bool)[cite: 328, 357].
    * [cite_start]Evaluación: `propuesta_evaluacion`, `requisitos_acreditacion`, `promocionable` (Bool + Select escala), `rendirse_libre` (Bool)[cite: 512, 515, 548, 559].
* [cite_start]`unidades` (Sub-colección de PA): `pa_id` (Relation), `titulo` (Text), `semanas_dictado` (JSON array 1-16), `actividades` (Text), `biblio_obligatoria` (Editor), `biblio_complementaria` (Editor)[cite: 412, 417, 425].

## Lógica de Negocio y Validaciones Estrictas (SvelteKit)
Implementa las siguientes reglas en el frontend antes de permitir el guardado/envío de datos a PocketBase:

1.  [cite_start]**Validación de Horas:** La suma de `horas_teoricas` y `horas_practicas` DEBE ser exactamente igual a las `horas_interaccion_pedagogica` estipuladas para esa asignatura[cite: 169]. Bloquear el botón de siguiente paso si no coincide.
2.  **Carga de Unidades (Semanas):** El docente debe cargar unidades y asignarles "Semanas de dictado". [cite_start]El sistema NO debe permitir avanzar al Paso 4 si no se han cubierto exactamente las 16 semanas de cursado[cite: 454].
3.  [cite_start]**Campos de Texto Enriquecido:** Implementa un editor ligero (ej. Quill o un componente nativo de Svelte) para la bibliografía, ya que el manual exige herramientas de formato de texto (negrita, viñetas)[cite: 425, 426].
4.  [cite_start]**Perspectiva y Extensión:** Los campos de "Perspectiva de género" y "Actividades de extensión" son informativos y deben requerir descripción si se marcan como "Sí", pero NO deben visualizarse en el PDF o vista final del PA público[cite: 328, 357].

## Circuito de Revisión (Máquina de Estados)
Implementa la lógica de botones de acción condicionada por el rol del usuario logueado y el estado del PA:

* [cite_start]**Docente:** Puede crear, "Editar" (si está en *borrador* u *observado*) y "Presentar programa"[cite: 587, 597, 645]. [cite_start]Al presentar, pasa a revisión de Dirección de Carrera[cite: 682].
* **Director/a de Carrera:** Ve PAs pendientes. [cite_start]Puede "Aceptar" (avanza a Escuela) u "Observar" (retrocede a Docente con un mensaje)[cite: 749, 750, 720].
* [cite_start]**Director/a de Escuela:** Puede "Aceptar" (avanza a DAA) u "Observar"[cite: 764].
* **DAA:** Nivel final. [cite_start]Al "Aceptar", el estado cambia definitivamente a "Aceptado"[cite: 797, 802].
* [cite_start]Si una revisión es *No Lineal* (múltiples directores de un mismo nivel), todos deben aceptar para avanzar[cite: 814].

## Estilo y UX
* Mantén un diseño muy limpio y estructurado. [cite_start]Utiliza un wizard/stepper para los 4 pasos de carga del PA (1: Datos, 2: Contenidos, 3: Unidades, 4: Evaluación)[cite: 125, 126, 205, 394, 500].
* Minimiza la reactividad innecesaria para mantener el consumo de RAM bajo.
