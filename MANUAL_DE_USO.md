# Manual de Uso del Sistema de Programas Analíticos (SPA)

Este manual describe el funcionamiento, lógica interna y modo de uso para los distintos roles que intervienen en el circuito del **Sistema de Programas Analíticos (SPA)**.

---

## 1. Conceptos Básicos y Flujo del Trámite

El SPA digitaliza la confección y aprobación de los Programas Analíticos (PA) de las materias universitarias. El ciclo de vida de un programa consta de las siguientes etapas:

1.  **Notificación (Inicio):** El notificador de la Dirección de Asuntos Académicos (DAA) solicita al docente la creación del programa.
2.  **Carga (Redacción):** El docente a cargo redacta el programa a través de un asistente de 4 pasos (Wizard).
3.  **Auditoría (Validación):** El programa pasa por revisiones jerárquicas y sucesivas:
    *   **Dirección de Carrera**
    *   **Dirección de Escuela**
    *   **Dirección de Asuntos Académicos (DAA)**
4.  **Aceptación (Cierre):** El programa es aprobado definitivamente y queda disponible para consulta pública en formato de solo lectura.
5.  **Actualización (Vigencia):** Durante plazos específicos (Ventanas de Actualización), los docentes pueden actualizar voluntariamente programas vigentes.

---

## 2. Guía por Roles de Usuario

### 2.1. Rol: Notificador/a (DAA)
Este rol es responsable de iniciar el circuito. Su panel consta de dos secciones principales:

*   **Nueva Notificación:**
    1.  Seleccione al **Docente Responsable** de la lista desplegable.
    2.  Elija el **Tipo de Revisión** (Lineal o No Lineal).
    3.  Busque la materia por código Guaraní, nombre o carrera en el buscador integrado.
    4.  Seleccione la o las materias deseadas de la lista:
        *   *Notificación Lineal:* Permite seleccionar exactamente **una (1)** materia para asociarla al docente.
        *   *Notificación No Lineal:* Permite seleccionar **múltiples** registros de materias de la lista, siempre y cuando **todas compartan el mismo código Guaraní**.
    5.  Presione **Crear Notificación**.
*   **Reporte de Notificaciones:**
    *   Lista todas las solicitudes.
    *   Si el docente aún no ha creado el programa analítico, el notificador tiene disponibles las acciones de **Renotificar** (actualizar fecha de solicitud) y **Anular** (cancelar el pedido).

### 2.2. Rol: Docente
El docente ingresa y visualiza su bandeja de entrada (**Solicitudes de Programas Analíticos**).
*   **Crear/Editar Programa:** Al hacer clic, se abre el asistente secuencial (Wizard):
    *   **Paso 1 (Datos):** Muestra metadatos y solicita ingresar las horas semanales o totales.
        *   *Validación Estricta:* La suma de **Horas Teóricas + Horas Prácticas** debe dar exactamente el total de **Horas de Interacción Pedagógica** estipuladas. Si no coincide, se mostrará un mensaje de error en rojo y no se podrá avanzar al siguiente paso.
    *   **Paso 2 (Contenidos):** Redacte la Fundamentación, Propósitos y Metodología.
        *   Use la barra superior de los editores para formatear con **Negrita**, *Itálica*, viñetas o listas.
        *   Si marca "Sí" en Perspectiva de Género o Actividades de Extensión, se abrirá obligatoriamente un campo de texto para detallar el abordaje interno.
    *   **Paso 3 (Unidades):** Administre las unidades de la materia.
        *   Haga clic en **+ Agregar Unidad** para crear una nueva sección.
        *   Para cada unidad, asigne las semanas de dictado haciendo clic en los botones del 1 al 16.
        *   *Validación Estricta:* El total de semanas seleccionadas entre todas las unidades debe cubrir **exactamente las 16 semanas** de la cursada, sin que ninguna semana quede vacía y sin que haya semanas asignadas a más de una unidad a la vez (duplicadas). Un mapa de calor numérico en la parte superior te ayudará mostrando en verde (OK), rojo (Duplicado) u oscuro (Sin asignar) cada semana. No podrás avanzar al paso 4 si el mapa no está completamente en verde.
    *   **Paso 4 (Evaluación):** Defina el régimen de aprobación.
        *   Indique si la materia es promocionable y asigne la escala correspondiente.
        *   Haga clic en **Guardar Borrador** en cualquier momento para resguardar su avance sin enviarlo.
        *   Haga clic en **Presentar Programa** cuando el documento esté completo. El estado cambiará a revisión.

### 2.3. Rol: Validador / Auditor (Carrera, Escuela y DAA)
Acceden a una bandeja de entrada donde auditan los programas analíticos pendientes:

*   **Bandeja de Entrada:**
    *   Muestra los expedientes correspondientes a su carrera o escuela específica.
    *   Haga clic en **Revisar** (lupa) para ver el detalle.
*   **Auditoría y Dictamen:**
    *   Verá el documento completo con marcas especiales para evaluar los campos informativos internos (Perspectiva de Género y Extensión).
    *   **Aceptar / Aprobar:** Aprueba el documento en su instancia.
        *   *Circuito Lineal:* Pasa automáticamente al siguiente nivel jerárquico.
        *   *Circuito No Lineal (Consenso):* El programa está asociado a múltiples carreras. El sistema requiere que **todos** los directores de carrera involucrados acepten el PA para que este pueda ascender a la etapa de Escuela. Mientras falte alguna aprobación, el PA permanecerá en revisión de carrera con una lista parcial de aprobaciones registradas en el historial.
    *   **Observar / Devolver:**
        *   Si detecta un error, presione esta opción e introduzca un mensaje detallado con las correcciones requeridas.
        *   El PA cambiará su estado a `observado` y volverá a la bandeja del docente.
        *   *Efecto Inmediato:* En circuitos no lineales, la observación de cualquiera de los directores causa la devolución inmediata del programa, **retirándolo al instante de las bandejas del resto de los directores** del mismo nivel para evitar revisiones en paralelo de versiones rechazadas.

### 2.4. Rol: Gestión
Personal del Departamento de Carreras de Grado y Bibliotecas.
*   **Ventanas de Actualización:** Configura las fechas de inicio y cierre del año académico lectivo. Si la fecha actual está fuera de la ventana activa, los docentes no podrán crear o editar programas.
*   **Monitor General:** Permite visualizar una tabla de auditoría general en tiempo real de todos los programas analíticos de la universidad y conocer su estado exacto y fecha de última modificación.

### 2.5. Rol: Visualizador / Consulta Pública
Acceso libre para la comunidad educativa y estudiantes.
*   Presenta un buscador para localizar materias por nombre, código Guaraní o carrera.
*   Al abrir el programa analítico aceptado, se muestra en **modo público de solo lectura**, con opción de imprimir o guardar en PDF.
*   *Privacidad:* Las descripciones internas de Perspectiva de Género y Actividades de Extensión **no son visibles en esta pantalla** ni en la impresión, resguardando la privacidad de la planificación interna del docente.

---

## 3. Resolución de Problemas Frecuentes

1.  **La página se recarga constantemente al hacer clics:**
    *   *Causa:* Ocurre si la base de datos escribe cambios y el servidor de desarrollo de Vite está vigilando la carpeta de base de datos (`pb_data/`).
    *   *Solución:* Esto ya se encuentra solucionado de manera persistente en `vite.config.ts` excluyendo la ruta `**/pb_data/**` del watch del servidor.
2.  **No puedo avanzar de paso en el formulario del Docente:**
    *   Revise las alertas en rojo:
        *   En el Paso 1: Asegúrese de que la suma de horas teóricas y prácticas coincida exactamente con las horas estipuladas.
        *   En el Paso 3: Revise el mapa de semanas 1 a 16. Asegúrese de que no haya números en rojo (duplicados) ni en gris oscuro (sin asignar).
3.  **Los directores no ven los programas analíticos en su bandeja:**
    *   Asegúrese de que el director logueado pertenezca a la misma Carrera (para Dirección de Carrera) o Escuela (para Dirección de Escuela) a la que está asociada la materia en la notificación.
    *   Verifique el estado del programa: los directores de carrera solo ven programas en `revision_carrera`; los de escuela, en `revision_escuela`.
