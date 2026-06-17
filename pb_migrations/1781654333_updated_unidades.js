/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lu1z5crqewqar4l")

  // remove
  collection.schema.removeField("muz4mu6s")

  // remove
  collection.schema.removeField("vzsicbno")

  // remove
  collection.schema.removeField("uyjizwcd")

  // remove
  collection.schema.removeField("ahvrr3pw")

  // remove
  collection.schema.removeField("eotlk4sb")

  // remove
  collection.schema.removeField("joazdjkj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vszm7kpo",
    "name": "pa_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "94u8nwdi8jwhifz",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jfr4rogw",
    "name": "titulo",
    "type": "text",
    "required": true,
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
    "id": "pskogbng",
    "name": "semanas_dictado",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hdoiy5mk",
    "name": "actividades",
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
    "id": "ln2uoego",
    "name": "biblio_obligatoria",
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
    "id": "gsu9lon7",
    "name": "biblio_complementaria",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lu1z5crqewqar4l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "muz4mu6s",
    "name": "pa_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "94u8nwdi8jwhifz",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vzsicbno",
    "name": "titulo",
    "type": "text",
    "required": true,
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
    "id": "uyjizwcd",
    "name": "semanas_dictado",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ahvrr3pw",
    "name": "actividades",
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
    "id": "eotlk4sb",
    "name": "biblio_obligatoria",
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
    "id": "joazdjkj",
    "name": "biblio_complementaria",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // remove
  collection.schema.removeField("vszm7kpo")

  // remove
  collection.schema.removeField("jfr4rogw")

  // remove
  collection.schema.removeField("pskogbng")

  // remove
  collection.schema.removeField("hdoiy5mk")

  // remove
  collection.schema.removeField("ln2uoego")

  // remove
  collection.schema.removeField("gsu9lon7")

  return dao.saveCollection(collection)
})
