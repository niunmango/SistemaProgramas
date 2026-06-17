/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("td04qwctdtmr7vt")

  // remove
  collection.schema.removeField("wscnwvty")

  // remove
  collection.schema.removeField("mpfsttst")

  // remove
  collection.schema.removeField("xw8goy0i")

  // remove
  collection.schema.removeField("tt1dtz5b")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "niefnqjf",
    "name": "codigo",
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
    "id": "i4fifz6m",
    "name": "nombre",
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
    "id": "30e5crir",
    "name": "carrera",
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
    "id": "lexnvdoy",
    "name": "horas_interaccion_pedagogica",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("td04qwctdtmr7vt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wscnwvty",
    "name": "codigo",
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
    "id": "mpfsttst",
    "name": "nombre",
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
    "id": "xw8goy0i",
    "name": "carrera",
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
    "id": "tt1dtz5b",
    "name": "horas_interaccion_pedagogica",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("niefnqjf")

  // remove
  collection.schema.removeField("i4fifz6m")

  // remove
  collection.schema.removeField("30e5crir")

  // remove
  collection.schema.removeField("lexnvdoy")

  return dao.saveCollection(collection)
})
