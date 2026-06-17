/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3yjxdjr2t1n7zuu")

  // remove
  collection.schema.removeField("j18puxst")

  // remove
  collection.schema.removeField("mkaqqzpj")

  // remove
  collection.schema.removeField("jbjwmksy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fkvojwcl",
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
    "id": "rge2ducu",
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
    "id": "uw4jiilu",
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
    "id": "j18puxst",
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
    "id": "mkaqqzpj",
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
    "id": "jbjwmksy",
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
  collection.schema.removeField("fkvojwcl")

  // remove
  collection.schema.removeField("rge2ducu")

  // remove
  collection.schema.removeField("uw4jiilu")

  return dao.saveCollection(collection)
})
