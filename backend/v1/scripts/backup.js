const {
  MongoTransferer,
  MongoDBDuplexConnector,
  LocalFileSystemDuplexConnector,
} = require(`mongodb-snapshot`);
const { env } = process;
const readline = require('readline');

async function move(source, dest) {
  const mongo_connector_1 = new MongoDBDuplexConnector({
    connection: {
      uri: env.MONGO_URI,
      dbname: source,
    },
  });

  const mongo_connector_2 = new MongoDBDuplexConnector({
    connection: {
      uri: env.MONGO_URI,
      dbname: dest,
    },
  });

  const transferer = new MongoTransferer({
    source: mongo_connector_1,
    targets: [mongo_connector_2],
  });

  for await (const { total, write } of transferer) {
    console.log(`remaining bytes to write: ${total - write}`);
  }
}

async function backup(source) {
  console.log(`Backup up: ${source}`);

  const CURRENT_TIME = new Date().toISOString().split(`.`)[0] + `Z`;

  const mongo_connector = new MongoDBDuplexConnector({
    connection: {
      uri: env.MONGO_URI,
      dbname: source,
    },
  });

  const localfile_connector = new LocalFileSystemDuplexConnector({
    connection: {
      path: `./backups/SNAPSHOT_${source}_${CURRENT_TIME}`,
    },
  });

  const transferer = new MongoTransferer({
    source: mongo_connector,
    targets: [localfile_connector],
  });

  for await (const { total, write } of transferer) {
    console.log(`remaining bytes to write: ${total - write}`);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (require.main === module) {
  rl.question(`Please enter the db source: `, (source) => {
    backup(source);
  });
}
module.exports = { backup };
