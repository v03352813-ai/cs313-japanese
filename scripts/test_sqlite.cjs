try {
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);');
  db.exec("INSERT INTO test (name) VALUES ('Korean Platform');");
  const query = db.prepare('SELECT * FROM test');
  console.log('Native SQLite Success:', query.all());
} catch (e) {
  console.log('node:sqlite error:', e.message);
}
