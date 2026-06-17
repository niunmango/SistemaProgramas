# Sistema de Gestión de Programas Analíticos (SPA)

Este es el **Sistema de Gestión de Programas Analíticos (SPA)**, una plataforma web moderna diseñada para la gestión, redacción, auditoría y publicación de planes de estudio oficiales en el ámbito universitario.

El sistema está optimizado para funcionar con un consumo mínimo de recursos (RAM y CPU), utilizando un backend ágil basado en **PocketBase** y un frontend reactivo ultraligero implementado en **SvelteKit (Svelte 5) + TailwindCSS (v4)**.

---

## 🚀 Características Clave

*   **Flujo Completo de Roles:** Cobertura total para 5 roles de usuario (Notificador DAA, Docente, Directores de Carrera y Escuela, Gestores, y Visualizador Público).
*   **Formulario de Carga Asistido (Stepper Wizard):** Carga estructurada de programas en 4 pasos (Datos, Contenidos, Unidades y Evaluación).
*   **Validaciones en Tiempo Real:**
    *   **Horas de Cursada:** Impide avanzar si las horas teóricas y prácticas no se alinean exactamente con las horas estipuladas por la asignatura.
    *   **Control de Semanas (1 a 16):** Panel interactivo de casilleros que garantiza que cada semana del ciclo lectivo esté cubierta exactamente una vez (sin vacíos ni duplicidades) antes de enviar el programa.
*   **Auditoría Lineal y No Lineal (Consenso):** Soporte de revisiones simultáneas para programas compartidos por múltiples carreras o escuelas, requiriendo el consenso total de los directivos e implementando una devolución inmediata al docente si cualquiera realiza una observación.
*   **Privacidad de Datos:** Ocultamiento automático de campos de uso interno (como Perspectiva de Género o Actividades de Extensión) en las vistas de impresión y consulta pública final.
*   **Panel de Gestión:** Configuración dinámica de las ventanas de fechas hábiles para las actualizaciones académicas anuales.

---

## 🛠️ Requisitos Técnicos

*   **Node.js:** v20.17.0 o superior.
*   **PocketBase:** v0.22.x o superior (se incluye ejecutable precompilado para Linux x86_64).

---

## ⚡ Instalación y Ejecución Rápida

1.  **Instalar dependencias del proyecto:**
    ```bash
    npm install
    ```
2.  **Iniciar la Base de Datos (Backend):**
    Asegúrate de que PocketBase esté activo en el puerto `8090`:
    ```bash
    ./pocketbase serve --http=127.0.0.1:8090
    ```
3.  **Configurar e Inicializar la Base de Datos (Solo la primera vez):**
    Ejecuta el script de migración y carga de semillas para configurar las colecciones y crear las cuentas de prueba:
    ```bash
    node scripts/setup-pb.cjs
    ```
4.  **Iniciar el Servidor de Desarrollo (Frontend):**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 🔑 Credenciales de Acceso Rápido (Entorno de Pruebas)

La pantalla de inicio de sesión incorpora botones de **Acceso Rápido de un clic** para facilitar el testeo de cada rol académico:

| Email de prueba | Rol | Jurisdicción (Carrera / Escuela) |
| :--- | :--- | :--- |
| `daa@example.com` | **DAA (Notificador / Auditor)** | Universidad Completa |
| `docente@example.com` | **Docente** | Licenciatura en Ciencias Ambientales |
| `docente2@example.com` | **Docente** | Profesorado en Enseñanza Media |
| `director_carrera1@example.com` | **Dir. de Carrera** | Licenciatura en Ciencias Ambientales |
| `director_carrera2@example.com` | **Dir. de Carrera** | Profesorado en Enseñanza Media |
| `director_escuela1@example.com` | **Dir. de Escuela** | Escuela de Ciencias |
| `director_escuela2@example.com` | **Dir. de Escuela** | Escuela de Humanidades |
| `gestion@example.com` | **Gestión** | Configuración de Ventanas y Monitor General |
| `visualizador@example.com` | **Visualizador** | Consulta Pública de Programas Aceptados |

*Contraseña común para todas las cuentas de prueba:* `password123`

---

## 📝 Documentación Adicional

Para una guía detallada sobre cómo operar el circuito, estructurar los programas y resolver dudas operativas, consulte el [Manual de Uso Oficial (MANUAL_DE_USO.md)](file:///home/ramiro/SistemaProgramas/MANUAL_DE_USO.md).

---

## ⚖️ Licencia

Este proyecto está bajo la Licencia **GNU General Public License v3.0 (GPLv3)**. Consulte el archivo de licencia correspondiente para más detalles.

***

*Desarrollado para la gestión académica oficial de programas analíticos universitarios (SPA).*
