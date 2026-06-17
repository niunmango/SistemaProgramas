/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lu1z5crqewqar4l")

  // remove
  collection.schema.removeField("oyz1ubzs")

  // remove
  collection.schema.removeField("kihcmqtm")

  // remove
  collection.schema.removeField("up0j4jwn")

  // remove
  collection.schema.removeField("lygytmkn")

  // remove
  collection.schema.removeField("pelxmq4w")

  // remove
  collection.schema.removeField("u4vhec19")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lu1z5crqewqar4l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oyz1ubzs",
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
    "id": "kihcmqtm",
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
    "id": "up0j4jwn",
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
    "id": "lygytmkn",
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
    "id": "pelxmq4w",
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
    "id": "u4vhec19",
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

  return dao.saveCollection(collection)
})
