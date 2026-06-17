/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("94u8nwdi8jwhifz")

  // remove
  collection.schema.removeField("d7iruzpk")

  // remove
  collection.schema.removeField("3kywdu3s")

  // remove
  collection.schema.removeField("iehwnrde")

  // remove
  collection.schema.removeField("rk4dd7hq")

  // remove
  collection.schema.removeField("l5trdzau")

  // remove
  collection.schema.removeField("mvygxk6g")

  // remove
  collection.schema.removeField("4caa5qfm")

  // remove
  collection.schema.removeField("lggirrd3")

  // remove
  collection.schema.removeField("aqkkfy64")

  // remove
  collection.schema.removeField("tazmdcsi")

  // remove
  collection.schema.removeField("mew7242x")

  // remove
  collection.schema.removeField("utxxh3px")

  // remove
  collection.schema.removeField("hp2jmfku")

  // remove
  collection.schema.removeField("g2obp12q")

  // remove
  collection.schema.removeField("djbkudkq")

  // remove
  collection.schema.removeField("a7y4ppds")

  // remove
  collection.schema.removeField("6rzjz3lr")

  // remove
  collection.schema.removeField("mouckrxd")

  // remove
  collection.schema.removeField("jlhdt0tv")

  // remove
  collection.schema.removeField("63w1zlla")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("94u8nwdi8jwhifz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d7iruzpk",
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
    "id": "3kywdu3s",
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
    "id": "iehwnrde",
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
    "id": "rk4dd7hq",
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
    "id": "l5trdzau",
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
    "id": "mvygxk6g",
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
    "id": "4caa5qfm",
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
    "id": "lggirrd3",
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
    "id": "aqkkfy64",
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
    "id": "tazmdcsi",
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
    "id": "mew7242x",
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
    "id": "utxxh3px",
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
    "id": "hp2jmfku",
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
    "id": "g2obp12q",
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
    "id": "djbkudkq",
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
    "id": "a7y4ppds",
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
    "id": "6rzjz3lr",
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
    "id": "mouckrxd",
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
    "id": "jlhdt0tv",
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
    "id": "63w1zlla",
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

  return dao.saveCollection(collection)
})
