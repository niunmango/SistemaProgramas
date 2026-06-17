const fs = require('fs');

async function main() {
  console.log("Starting PocketBase Database Schema Setup...");

  const adminEmail = "admin@example.com";
  const adminPassword = "password123";
  const baseUrl = "http://127.0.0.1:8090";

  let token = "";

  // Helper to make API requests
  async function request(path, method = "GET", body = null) {
    const headers = {};
    if (token) {
      headers["Authorization"] = token;
    }
    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Request to ${path} failed with status ${res.status}: ${errText}`);
    }

    if (res.status === 204) {
      return null;
    }

    return await res.json();
  }

  // 1. Authenticate as Admin
  try {
    const authData = await request("/api/admins/auth-with-password", "POST", {
      identity: adminEmail,
      password: adminPassword
    });
    token = authData.token;
    console.log("Successfully authenticated as Admin.");
  } catch (err) {
    console.error("Could not authenticate as admin. Make sure PocketBase is running on http://127.0.0.1:8090");
    process.exit(1);
  }

  // 2. Fetch existing collections
  const collectionsData = await request("/api/collections?perPage=100");
  const collections = collectionsData.items;
  
  const findCollection = (name) => collections.find(c => c.name === name);

  // 3. Update 'users' collection to add 'role', 'carrera', 'escuela' fields
  console.log("Updating 'users' collection...");
  const usersCollection = findCollection("users");
  if (!usersCollection) {
    throw new Error("Could not find default 'users' collection");
  }

  // Check if role field already exists
  const hasRoleField = usersCollection.schema.some(f => f.name === "role");
  if (!hasRoleField) {
    usersCollection.schema.push({
      name: "role",
      type: "select",
      required: true,
      options: {
        values: ["docente", "d_carrera", "d_escuela", "daa", "gestion", "visualizador"],
        maxSelect: 1
      }
    });
  }

  // Add name fields if they don't exist
  if (!usersCollection.schema.some(f => f.name === "carrera")) {
    usersCollection.schema.push({
      name: "carrera",
      type: "text",
      required: false
    });
  }

  if (!usersCollection.schema.some(f => f.name === "escuela")) {
    usersCollection.schema.push({
      name: "escuela",
      type: "text",
      required: false
    });
  }

  // Make users API public for list/view/create/update
  usersCollection.listRule = "";
  usersCollection.viewRule = "";
  usersCollection.createRule = "";
  usersCollection.updateRule = "";

  await request(`/api/collections/${usersCollection.id}`, "PATCH", usersCollection);
  console.log("Updated 'users' collection schema and rules.");

  // Helper to create or update collection
  async function createOrUpdateCollection(schemaDef) {
    const existing = findCollection(schemaDef.name);
    if (existing) {
      console.log(`Collection '${schemaDef.name}' already exists. Updating...`);
      const updated = {
        ...existing,
        schema: schemaDef.schema,
        listRule: schemaDef.listRule,
        viewRule: schemaDef.viewRule,
        createRule: schemaDef.createRule,
        updateRule: schemaDef.updateRule,
        deleteRule: schemaDef.deleteRule
      };
      await request(`/api/collections/${existing.id}`, "PATCH", updated);
      console.log(`Updated collection '${schemaDef.name}'`);
    } else {
      console.log(`Creating collection '${schemaDef.name}'...`);
      const created = await request("/api/collections", "POST", schemaDef);
      collections.push(created);
      console.log(`Created collection '${schemaDef.name}'`);
    }
  }

  // 4. Create 'asignaturas' collection
  const asignaturasSchema = {
    name: "asignaturas",
    type: "base",
    schema: [
      { name: "codigo", type: "text", required: true },
      { name: "nombre", type: "text", required: true },
      { name: "carrera", type: "text", required: true },
      { name: "escuela", type: "text", required: false },
      { name: "horas_interaccion_pedagogica", type: "number", required: true, options: { min: 1 } }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  };
  await createOrUpdateCollection(asignaturasSchema);

  // Re-fetch collections to get correct IDs
  const freshCols = await request("/api/collections?perPage=100");
  const usersColId = freshCols.items.find(c => c.name === "users").id;
  const asignaturasColId = freshCols.items.find(c => c.name === "asignaturas").id;

  // 5. Create 'notificaciones' collection
  const notificacionesSchema = {
    name: "notificaciones",
    type: "base",
    schema: [
      {
        name: "docente",
        type: "relation",
        required: true,
        options: {
          collectionId: usersColId,
          cascadeDelete: false,
          maxSelect: 1
        }
      },
      {
        name: "asignatura",
        type: "relation",
        required: true,
        options: {
          collectionId: asignaturasColId,
          cascadeDelete: false,
          maxSelect: null
        }
      },
      {
        name: "tipo",
        type: "select",
        required: true,
        options: {
          values: ["lineal", "no_lineal"],
          maxSelect: 1
        }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  };
  await createOrUpdateCollection(notificacionesSchema);

  // 6. Create 'programas_analiticos' collection
  const paSchema = {
    name: "programas_analiticos",
    type: "base",
    schema: [
      {
        name: "docente_id",
        type: "relation",
        required: true,
        options: {
          collectionId: usersColId,
          cascadeDelete: false,
          maxSelect: 1
        }
      },
      {
        name: "asignatura_id",
        type: "relation",
        required: true,
        options: {
          collectionId: asignaturasColId,
          cascadeDelete: false,
          maxSelect: null
        }
      },
      {
        name: "estado",
        type: "select",
        required: true,
        options: {
          values: ["borrador", "revision_carrera", "revision_escuela", "revision_daa", "observado", "aceptado"],
          maxSelect: 1
        }
      },
      { name: "horas_distancia", type: "number", options: { min: 0 } },
      { name: "horas_teoricas", type: "number", options: { min: 0 } },
      { name: "horas_practicas", type: "number", options: { min: 0 } },
      { name: "horas_autonomas", type: "number", options: { min: 0 } },
      { name: "fundamentacion", type: "editor" },
      { name: "propositos", type: "editor" },
      { name: "metodologia", type: "editor" },
      { name: "perspectiva_genero", type: "bool" },
      { name: "descripcion_genero", type: "text" },
      { name: "actividades_extension", type: "bool" },
      { name: "descripcion_extension", type: "text" },
      { name: "propuesta_evaluacion", type: "editor" },
      { name: "requisitos_acreditacion", type: "editor" },
      { name: "promocionable", type: "bool" },
      {
        name: "escala_promocionable",
        type: "select",
        options: {
          values: ["escala_1_10", "escala_aprobado_reprobado", "escala_letras", "ninguna"],
          maxSelect: 1
        }
      },
      { name: "rendirse_libre", type: "bool" },
      { name: "historial_revisiones", type: "json", options: { maxSize: 2000000 } }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  };
  await createOrUpdateCollection(paSchema);

  // Re-fetch to get PA collection ID
  const freshCols2 = await request("/api/collections?perPage=100");
  const paColId = freshCols2.items.find(c => c.name === "programas_analiticos").id;

  // 7. Create 'unidades' collection
  const unidadesSchema = {
    name: "unidades",
    type: "base",
    schema: [
      {
        name: "pa_id",
        type: "relation",
        required: true,
        options: {
          collectionId: paColId,
          cascadeDelete: true,
          maxSelect: 1
        }
      },
      { name: "titulo", type: "text", required: true },
      { name: "semanas_dictado", type: "json", required: true, options: { maxSize: 2000000 } },
      { name: "actividades", type: "text" },
      { name: "biblio_obligatoria", type: "editor" },
      { name: "biblio_complementaria", type: "editor" }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  };
  await createOrUpdateCollection(unidadesSchema);

  // 8. Create 'ventanas_actualizacion' collection
  const ventanasSchema = {
    name: "ventanas_actualizacion",
    type: "base",
    schema: [
      { name: "fecha_inicio", type: "date", required: true },
      { name: "fecha_fin", type: "date", required: true },
      { name: "anio_lectivo", type: "text", required: true },
      { name: "activa", type: "bool" }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  };
  await createOrUpdateCollection(ventanasSchema);

  console.log("All schemas successfully created/updated.");

  // 9. Seed Users
  console.log("Seeding users...");
  const seedUsers = [
    { email: "docente@example.com", username: "docente", name: "Docente Juan", role: "docente", carrera: "Licenciatura en Ciencias Ambientales", escuela: "Escuela de Ciencias" },
    { email: "docente2@example.com", username: "docente2", name: "Docente Maria", role: "docente", carrera: "Profesorado en Enseñanza Media", escuela: "Escuela de Humanidades" },
    { email: "director_carrera1@example.com", username: "d_carrera1", name: "Director Carrera Carlos", role: "d_carrera", carrera: "Licenciatura en Ciencias Ambientales", escuela: "Escuela de Ciencias" },
    { email: "director_carrera2@example.com", username: "d_carrera2", name: "Director Carrera Ana", role: "d_carrera", carrera: "Profesorado en Enseñanza Media", escuela: "Escuela de Humanidades" },
    { email: "director_escuela1@example.com", username: "d_escuela1", name: "Director Escuela Pedro", role: "d_escuela", carrera: "", escuela: "Escuela de Ciencias" },
    { email: "director_escuela2@example.com", username: "d_escuela2", name: "Director Escuela Marta", role: "d_escuela", carrera: "", escuela: "Escuela de Humanidades" },
    { email: "daa@example.com", username: "daa", name: "DAA Laura", role: "daa", carrera: "", escuela: "" },
    { email: "gestion@example.com", username: "gestion", name: "Gestion Sofia", role: "gestion", carrera: "", escuela: "" },
    { email: "visualizador@example.com", username: "visualizador", name: "Visualizador Luis", role: "visualizador", carrera: "", escuela: "" }
  ];

  // Fetch current users to prevent duplicates
  const existingUsers = await request("/api/collections/users/records?perPage=100");

  for (const u of seedUsers) {
    const exists = existingUsers.items.find(x => x.email === u.email);
    if (!exists) {
      try {
        await request("/api/collections/users/records", "POST", {
          ...u,
          password: "password123",
          passwordConfirm: "password123",
          emailVisibility: true
        });
        console.log(`Seeded user: ${u.email}`);
      } catch (err) {
        console.error(`Failed to seed user ${u.email}:`, err.message);
      }
    } else {
      // Update existing user with correct fields (like escuela)
      try {
        await request(`/api/collections/users/records/${exists.id}`, "PATCH", {
          carrera: u.carrera,
          escuela: u.escuela
        });
        console.log(`Updated user: ${u.email}`);
      } catch (err) {
        console.error(`Failed to update user ${u.email}:`, err.message);
      }
    }
  }

  // 10. Seed Asignaturas
  console.log("Seeding asignaturas...");
  const seedAsignaturas = [
    { codigo: "B5774", nombre: "Técnicas de Muestreo, Análisis e Interpretación", carrera: "Licenciatura en Ciencias Ambientales", escuela: "Escuela de Ciencias", horas_interaccion_pedagogica: 64 },
    { codigo: "B5145", nombre: "Didáctica General", carrera: "Profesorado en Enseñanza Media", escuela: "Escuela de Humanidades", horas_interaccion_pedagogica: 96 }
  ];

  // Fetch current asignaturas
  const existingAsignaturas = await request("/api/collections/asignaturas/records?perPage=100");

  for (const a of seedAsignaturas) {
    const exists = existingAsignaturas.items.find(x => x.codigo === a.codigo && x.carrera === a.carrera);
    if (!exists) {
      try {
        await request("/api/collections/asignaturas/records", "POST", a);
        console.log(`Seeded asignatura: ${a.nombre} (${a.codigo})`);
      } catch (err) {
        console.error(`Failed to seed asignatura ${a.nombre}:`, err.message);
      }
    } else {
      // Update existing asignatura with correct fields (like escuela)
      try {
        await request(`/api/collections/asignaturas/records/${exists.id}`, "PATCH", {
          escuela: a.escuela
        });
        console.log(`Updated asignatura: ${a.nombre}`);
      } catch (err) {
        console.error(`Failed to update asignatura ${a.nombre}:`, err.message);
      }
    }
  }

  // 11. Seed default update window (fecha_inicio = yesterday, fecha_fin = 1 month from now)
  console.log("Seeding update window...");
  const existingWindows = await request("/api/collections/ventanas_actualizacion/records?perPage=100");
  if (existingWindows.items.length === 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    try {
      await request("/api/collections/ventanas_actualizacion/records", "POST", {
        fecha_inicio: yesterday.toISOString(),
        fecha_fin: nextMonth.toISOString(),
        anio_lectivo: "2026",
        activa: true
      });
      console.log("Seeded default update window for year 2026");
    } catch (err) {
      console.error("Failed to seed default update window:", err.message);
    }
  } else {
    console.log("Update window already exists.");
  }

  // 12. Seed an Accepted Program (so the Visualizador has a program to display immediately)
  console.log("Checking if we need to seed an accepted program...");
  try {
    const freshUsers = await request("/api/collections/users/records?perPage=100");
    const docenteUser = freshUsers.items.find(x => x.email === "docente@example.com");

    const freshAsignaturas = await request("/api/collections/asignaturas/records?perPage=100");
    const asignaturaMuestreo = freshAsignaturas.items.find(x => x.codigo === "B5774");

    if (docenteUser && asignaturaMuestreo) {
      const existingPAs = await request("/api/collections/programas_analiticos/records?perPage=100");
      const hasAccepted = existingPAs.items.some(x => x.estado === "aceptado");

      if (!hasAccepted) {
        console.log("Seeding an accepted program for B5774...");
        const newPa = await request("/api/collections/programas_analiticos/records", "POST", {
          docente_id: docenteUser.id,
          asignatura_id: [asignaturaMuestreo.id],
          estado: "aceptado",
          horas_teoricas: 32,
          horas_practicas: 32,
          horas_distancia: 0,
          horas_autonomas: 16,
          fundamentacion: "<strong>Fundamentación del Muestreo:</strong> Esta asignatura fundamenta y justifica los métodos de muestreo estadístico aplicados a las ciencias ambientales.",
          propositos: "<strong>Propósitos:</strong> <ul><li>Capacitar al estudiante en el diseño de muestras representativas.</li><li>Entrenar en la estimación de parámetros poblacionales.</li></ul>",
          metodologia: "<strong>Metodología:</strong> Clases teóricas participativas combinadas con resolución de problemas prácticos en gabinete y salidas de campo.",
          perspectiva_genero: true,
          descripcion_genero: "Abordaje equitativo e integrador de género en las salidas técnicas de campo.",
          actividades_extension: true,
          descripcion_extension: "Análisis y recolección de datos ambientales de interés comunitario en conjunto con organizaciones locales.",
          propuesta_evaluacion: "<strong>Régimen:</strong> Dos evaluaciones parciales de carácter teórico-práctico y un trabajo práctico final integrador.",
          requisitos_acreditacion: "<strong>Requisitos:</strong> Aprobar ambas instancias de evaluación con nota mínima de 6 y contar con el 80% de asistencia presencial.",
          promocionable: true,
          escala_promocionable: "escala_1_10",
          rendirse_libre: false,
          historial_revisiones: {
            aprobaciones_carrera: ["Licenciatura en Ciencias Ambientales"],
            aprobaciones_escuela: ["Escuela de Ciencias"],
            historial: [
              {
                fecha: new Date().toISOString(),
                usuario: "Docente Juan",
                rol: "docente",
                accion: "presentar",
                mensaje: "Programa presentado en primer término."
              },
              {
                fecha: new Date().toISOString(),
                usuario: "Director Carrera Carlos",
                rol: "d_carrera",
                accion: "aceptar",
                mensaje: "Aprobado por Dirección de Carrera."
              },
              {
                fecha: new Date().toISOString(),
                usuario: "Director Escuela Pedro",
                rol: "d_escuela",
                accion: "aceptar",
                mensaje: "Aprobado por Escuela de Ciencias."
              },
              {
                fecha: new Date().toISOString(),
                usuario: "DAA Laura",
                rol: "daa",
                accion: "aceptar",
                mensaje: "Aprobación definitiva del programa analítico."
              }
            ]
          }
        });

        // Seed Units for this PA
        console.log("Seeding units for the accepted program...");
        await request("/api/collections/unidades/records", "POST", {
          pa_id: newPa.id,
          titulo: "Unidad 1: Fundamentos y Muestreo Aleatorio Simple",
          semanas_dictado: [1, 2, 3, 4, 5, 6, 7, 8],
          actividades: "Ejercicios de cálculo de tamaño muestral y muestreo sistemático.",
          biblio_obligatoria: "<strong>Cochran, W.G. (1977).</strong> <em>Sampling Techniques</em>. 3rd Edition. John Wiley & Sons.",
          biblio_complementaria: "<strong>Kish, Leslie. (1965).</strong> <em>Survey Sampling</em>. John Wiley & Sons."
        });

        await request("/api/collections/unidades/records", "POST", {
          pa_id: newPa.id,
          titulo: "Unidad 2: Muestreo Estratificado y Conglomerados",
          semanas_dictado: [9, 10, 11, 12, 13, 14, 15, 16],
          actividades: "Casos prácticos de muestreo complejo mediante software R.",
          biblio_obligatoria: "<strong>Lohr, Sharon L. (2010).</strong> <em>Sampling: Design and Analysis</em>. Duxbury Press.",
          biblio_complementaria: "<strong>Särndal, C.E., Swensson, B. and Wretman, J. (1992).</strong> <em>Model Assisted Survey Sampling</em>. Springer-Verlag."
        });

        console.log("Successfully seeded accepted program and its units.");
      } else {
        console.log("Accepted program already exists.");
      }
    }
  } catch (err) {
    console.error("Failed to seed accepted program:", err.message);
  }

  console.log("PocketBase Setup Complete!");
}

main().catch(err => {
  console.error("Fatal Error during setup:", err);
  process.exit(1);
});
