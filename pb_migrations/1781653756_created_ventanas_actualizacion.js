/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "eszi5e8mvlq7laq",
    "created": "2026-06-16 23:49:16.333Z",
    "updated": "2026-06-16 23:49:16.333Z",
    "name": "ventanas_actualizacion",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "system": false,
        "id": "p0a2yzne",
        "name": "activa",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("eszi5e8mvlq7laq");

  return dao.deleteCollection(collection);
})
