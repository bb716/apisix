const fs = require('fs');
const path = require('path');

const schemaPath = path.join('/Users/damon/Desktop/apisix/apisix-dashboard/api/conf/schema.json');
const allSchemasPath = path.join('/Users/damon/Desktop/apisix/all_schemas.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const allSchemas = JSON.parse(fs.readFileSync(allSchemasPath, 'utf8'));

if (!schema.plugins) {
  schema.plugins = {};
}

// Update schema
for (const [name, s] of Object.entries(allSchemas)) {
  schema.plugins[name] = s;
}

fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
console.log('Successfully updated schema.json with all plugins under "plugins" key');
