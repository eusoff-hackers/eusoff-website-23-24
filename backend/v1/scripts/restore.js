const {
  MongoTransferer,
  MongoDBDuplexConnector,
  LocalFileSystemDuplexConnector,
} = require(`mongodb-snapshot`);
const { env } = process;
const readline = require('readline');
const { backup } = require(`./backup`);

async function restore(source, dest) {
  // await backup(dest);
  console.log(`Restoring: ${dest}`);

  const mongo_connector = new MongoDBDuplexConnector({
    connection: {
      uri: env.MONGO_URI,
      dbname: dest,
    },
  });

  const localfile_connector = new LocalFileSystemDuplexConnector({
    connection: {
      path: source,
    },
  });

  const transferer = new MongoTransferer({
    source: localfile_connector,
    targets: [mongo_connector],
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
  rl.question(`Please enter the file source: `, (source) => {
    rl.question(`Please enter the db destination: `, (dest) => {
      restore(source, dest);
    });
  });
}
