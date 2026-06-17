/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("eszi5e8mvlq7laq")

  // remove
  collection.schema.removeField("x244fdom")

  // remove
  collection.schema.removeField("eeyuwiir")

  // remove
  collection.schema.removeField("yariuxv4")

  // remove
  collection.schema.removeField("p0a2yzne")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "najkpfo3",
    "name": "fecha_inicio",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fdchzr4u",
    "name": "fecha_fin",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "aqxsquba",
    "name": "anio_lectivo",
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
    "id": "nhlmkgha",
    "name": "activa",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("eszi5e8mvlq7laq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x244fdom",
    "name": "fecha_inicio",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eeyuwiir",
    "name": "fecha_fin",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yariuxv4",
    "name": "anio_lectivo",
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
    "id": "p0a2yzne",
    "name": "activa",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("najkpfo3")

  // remove
  collection.schema.removeField("fdchzr4u")

  // remove
  collection.schema.removeField("aqxsquba")

  // remove
  collection.schema.removeField("nhlmkgha")

  return dao.saveCollection(collection)
})
