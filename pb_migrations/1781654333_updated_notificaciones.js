/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3yjxdjr2t1n7zuu")

  // remove
  collection.schema.removeField("5m1iv4ej")

  // remove
  collection.schema.removeField("tyxy8q0d")

  // remove
  collection.schema.removeField("r1ddjz73")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wwfyeckt",
    "name": "docente",
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
    "id": "sqv2mlbp",
    "name": "asignatura",
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
    "id": "1qahyycv",
    "name": "tipo",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "lineal",
        "no_lineal"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3yjxdjr2t1n7zuu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5m1iv4ej",
    "name": "docente",
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
    "id": "tyxy8q0d",
    "name": "asignatura",
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
    "id": "r1ddjz73",
    "name": "tipo",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "lineal",
        "no_lineal"
      ]
    }
  }))

  // remove
  collection.schema.removeField("wwfyeckt")

  // remove
  collection.schema.removeField("sqv2mlbp")

  // remove
  collection.schema.removeField("1qahyycv")

  return dao.saveCollection(collection)
})
