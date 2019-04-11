console.log(
    "Commands:\n",
    "create new         migrate create [name]\n",
    "+all migrations    migrate migrate\n",
    "-1 migration       migrate rollback\n",
    "sqlite3 is not supported by this package, do migrations directly");

const root = require('app-root-path');
require('sql-migrations').run({
    migrationsDir: './migrations',
    host: 'localhost',
    port: 3306,
    db: 'smm-statistics',
    user: 'dashik',
    password: 'dashik',
    adapter: 'mysql',
});