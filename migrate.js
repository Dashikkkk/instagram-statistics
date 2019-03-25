const root = require('app-root-path');
require('sql-migrations').run({
    migrationsDir: './migrations',
});