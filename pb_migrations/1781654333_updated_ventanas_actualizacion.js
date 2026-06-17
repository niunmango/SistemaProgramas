/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("eszi5e8mvlq7laq")

  // remove
  collection.schema.removeField("najkpfo3")

  // remove
  collection.schema.removeField("fdchzr4u")

  // remove
  collection.schema.removeField("aqxsquba")

  // remove
  collection.schema.removeField("nhlmkgha")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ttudtpdp",
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
    "id": "ovlzfapi",
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
    "id": "tcgwpagc",
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
    "id": "6yarihsr",
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

  // remove
  collection.schema.removeField("ttudtpdp")

  // remove
  collection.schema.removeField("ovlzfapi")

  // remove
  collection.schema.removeField("tcgwpagc")

  // remove
  collection.schema.removeField("6yarihsr")

  return dao.saveCollection(collection)
})
