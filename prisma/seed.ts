import * as dotenv from 'dotenv';
dotenv.config();
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
  try {
    const files = await fs.promises.readdir(directoryPath);
    // Sort files to ensure they are processed in order
    const sortedFiles = files.sort((a, b) => a.localeCompare(b));
    for (const file of sortedFiles) {
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
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
  }
}

if (file) {
  runSingleFile();
} else {
  runAll();
}
