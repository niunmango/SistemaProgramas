/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("td04qwctdtmr7vt")

  // remove
  collection.schema.removeField("15hwwiqz")

  // remove
  collection.schema.removeField("ycmbj7it")

  // remove
  collection.schema.removeField("jgddp31n")

  // remove
  collection.schema.removeField("lvyc7vvv")

  // remove
  collection.schema.removeField("ow3ccn2j")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3de6galg",
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
    "id": "v3okufve",
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
    "id": "3khba3bv",
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
    "id": "j43rl2il",
    "name": "escuela",
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
    "id": "cqs9edzn",
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
    "id": "15hwwiqz",
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
    "id": "ycmbj7it",
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
    "id": "jgddp31n",
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
    "id": "lvyc7vvv",
    "name": "escuela",
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
    "id": "ow3ccn2j",
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
  collection.schema.removeField("3de6galg")

  // remove
  collection.schema.removeField("v3okufve")

  // remove
  collection.schema.removeField("3khba3bv")

  // remove
  collection.schema.removeField("j43rl2il")

  // remove
  collection.schema.removeField("cqs9edzn")

  return dao.saveCollection(collection)
})
