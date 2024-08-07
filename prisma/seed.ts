import * as path from 'path';
import * as fs from 'fs';

const file = process.env.npm_config_file;

async function runSingleFile() {
  const seed = await import(`./seeds/${file}`);
  console.log(`[seeder] started run seed from ${file}`);
  try {
    await seed.run();
    console.log(`[seeder] successfully run seed from ${file}`);
  } catch (error) {
    console.log(`[seeder] error when running seed from ${file}`);
    throw error;
  }
}

async function runAll() {
  const directoryPath = path.join(__dirname, 'seeds');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(async function (file) {
      // Do whatever you want to do with the file
      const seed = await import(`./seeds/${file}`);
      console.log(`[seeder] started run seed from ${file}`);
      try {
        await seed.run();
        console.log(`[seeder] successfully run seed from ${file}`);
      } catch (error) {
        console.log(`[seeder] error when running seed from ${file}`);
        throw error;
      }
    });
  });
}

if (file) {
  runSingleFile();
} else {
  runAll();
}
