# Database Entities
## TypeORM
We use [typeorm](https://typeorm.io/) to manage database migration creation and execution. ORM configuration is handled by [`ormconfig.js`](https://github.com/ctoec/data-collection/blob/base/ormconfig.js)

### Enums
SQL Server does not support enum types natively, and the existing alternative, ['simple-enums'](https://github.com/typeorm/typeorm/pull/3700) has two weaknesses.
1. It is pretty buggy, and leads to many columns being dropped and recreated unnecessarily in every migration
1. By enforcing the enum check as a CHECK constraint on the database column, it requires a database migration every time any change is made to an enum.

As an alternative, we are defining all enum columns as 'varchar' type columns, preferably with a reasonably defined max length, and with a [custom value transformer](https://typeorm.delightful.studio/interfaces/_decorator_options_valuetransformer_.valuetransformer.html).
The [enumTransformer](https://github.com/ctoec/data-collection/blob/base/src/entity/transformers/enumTransformer.ts) converts the enum value string from the entity into the enum key string, and enforces that entity enum value string is value enum value.
An example of how enums property columns should be defined is:
```
@Column({
    type: 'varchar',
    length: 20,
    transformer: enumTransformer(AnEnum)
})
thisEnumProperty: AnEnum;
```

The result of all this is:
- Enum value strings can be changed without requiring any database migrations.
- Enum values can be added without requiring any database migrations.
- Removing enum values will always require a migration, as any data referencing that enum value would need to be cleaned up.
- Renaming enum key will require a migration, to update data referencing the old key to have the new key value, but this is not expected to happen frequently.

### Creating migrations
Migrations are automatically applied by app on startup, 
To generate a migration from schema changes:
```
docker-compose exec server yarn typeorm migration:generate -n [MIGRATION_NAME]
```

To create an empty migration (for writing custom migrations, for example DML):
```
docker-compose exec server yarn typeorm migration:create -n [MIGRATION_NAME]
```
