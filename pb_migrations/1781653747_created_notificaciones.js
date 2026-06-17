/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3yjxdjr2t1n7zuu",
    "created": "2026-06-16 23:49:07.286Z",
    "updated": "2026-06-16 23:49:07.286Z",
    "name": "notificaciones",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
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
  const collection = dao.findCollectionByNameOrId("3yjxdjr2t1n7zuu");

  return dao.deleteCollection(collection);
})
