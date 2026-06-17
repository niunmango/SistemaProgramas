/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("94u8nwdi8jwhifz")

  // remove
  collection.schema.removeField("0tean2qh")

  // remove
  collection.schema.removeField("j8r65psg")

  // remove
  collection.schema.removeField("bgdyfuxt")

  // remove
  collection.schema.removeField("nnisi54e")

  // remove
  collection.schema.removeField("yu3qxurd")

  // remove
  collection.schema.removeField("us8ixrsv")

  // remove
  collection.schema.removeField("7u1q2nqi")

  // remove
  collection.schema.removeField("mru2nf4a")

  // remove
  collection.schema.removeField("pysnyz48")

  // remove
  collection.schema.removeField("ivxd8by1")

  // remove
  collection.schema.removeField("qsyj3jkz")

  // remove
  collection.schema.removeField("4nvlgfod")

  // remove
  collection.schema.removeField("0mutafpj")

  // remove
  collection.schema.removeField("l3plxknf")

  // remove
  collection.schema.removeField("egxcecfa")

  // remove
  collection.schema.removeField("c8pvtbu6")

  // remove
  collection.schema.removeField("mqpsaieg")

  // remove
  collection.schema.removeField("j8xtia6o")

  // remove
  collection.schema.removeField("ilcvsyuk")

  // remove
  collection.schema.removeField("vmjf7fta")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hmqojruy",
    "name": "docente_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "drhttcmo",
    "name": "asignatura_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "td04qwctdtmr7vt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hknjpcsh",
    "name": "estado",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "borrador",
        "revision_carrera",
        "revision_escuela",
        "revision_daa",
        "observado",
        "aceptado"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xde3yw97",
    "name": "horas_distancia",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zdwqn9sy",
    "name": "horas_teoricas",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ls75r8bi",
    "name": "horas_practicas",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ycocbyhl",
    "name": "horas_autonomas",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "srmjk0td",
    "name": "fundamentacion",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2easuqqy",
    "name": "propositos",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "03lpjkpf",
    "name": "metodologia",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gn9zqsb6",
    "name": "perspectiva_genero",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xr6yslsa",
    "name": "descripcion_genero",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2psu7drj",
    "name": "actividades_extension",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l5oeihqz",
    "name": "descripcion_extension",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "82cvsvni",
    "name": "propuesta_evaluacion",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wsdj0gsx",
    "name": "requisitos_acreditacion",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jvhele3q",
    "name": "promocionable",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dqgvb5xb",
    "name": "escala_promocionable",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "escala_1_10",
        "escala_aprobado_reprobado",
        "escala_letras",
        "ninguna"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rkip3cz4",
    "name": "rendirse_libre",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sqvdlg2g",
    "name": "historial_revisiones",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("94u8nwdi8jwhifz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0tean2qh",
    "name": "docente_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "j8r65psg",
    "name": "asignatura_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "td04qwctdtmr7vt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bgdyfuxt",
    "name": "estado",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "borrador",
        "revision_carrera",
        "revision_escuela",
        "revision_daa",
        "observado",
        "aceptado"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nnisi54e",
    "name": "horas_distancia",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yu3qxurd",
    "name": "horas_teoricas",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "us8ixrsv",
    "name": "horas_practicas",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7u1q2nqi",
    "name": "horas_autonomas",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mru2nf4a",
    "name": "fundamentacion",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pysnyz48",
    "name": "propositos",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ivxd8by1",
    "name": "metodologia",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qsyj3jkz",
    "name": "perspectiva_genero",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4nvlgfod",
    "name": "descripcion_genero",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0mutafpj",
    "name": "actividades_extension",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l3plxknf",
    "name": "descripcion_extension",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "egxcecfa",
    "name": "propuesta_evaluacion",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c8pvtbu6",
    "name": "requisitos_acreditacion",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mqpsaieg",
    "name": "promocionable",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "j8xtia6o",
    "name": "escala_promocionable",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "escala_1_10",
        "escala_aprobado_reprobado",
        "escala_letras",
        "ninguna"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ilcvsyuk",
    "name": "rendirse_libre",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vmjf7fta",
    "name": "historial_revisiones",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("hmqojruy")

  // remove
  collection.schema.removeField("drhttcmo")

  // remove
  collection.schema.removeField("hknjpcsh")

  // remove
  collection.schema.removeField("xde3yw97")

  // remove
  collection.schema.removeField("zdwqn9sy")

  // remove
  collection.schema.removeField("ls75r8bi")

  // remove
  collection.schema.removeField("ycocbyhl")

  // remove
  collection.schema.removeField("srmjk0td")

  // remove
  collection.schema.removeField("2easuqqy")

  // remove
  collection.schema.removeField("03lpjkpf")

  // remove
  collection.schema.removeField("gn9zqsb6")

  // remove
  collection.schema.removeField("xr6yslsa")

  // remove
  collection.schema.removeField("2psu7drj")

  // remove
  collection.schema.removeField("l5oeihqz")

  // remove
  collection.schema.removeField("82cvsvni")

  // remove
  collection.schema.removeField("wsdj0gsx")

  // remove
  collection.schema.removeField("jvhele3q")

  // remove
  collection.schema.removeField("dqgvb5xb")

  // remove
  collection.schema.removeField("rkip3cz4")

  // remove
  collection.schema.removeField("sqvdlg2g")

  return dao.saveCollection(collection)
})
