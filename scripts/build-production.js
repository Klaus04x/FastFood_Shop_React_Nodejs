import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting production build...\n');

// Function to execute command and log output
function runCommand(command, cwd = rootDir) {
  console.log(`\n📦 Running: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Success!\n');
  } catch (error) {
    console.error(`❌ Error running: ${command}`);
    process.exit(1);
  }
}

// Function to copy web.config to dist folders
function copyWebConfig(source, dest) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied web.config to ${dest}`);
    }
  } catch (error) {
    console.error(`❌ Error copying web.config: ${error.message}`);
  }
}

// 1. Install dependencies
console.log('📥 Installing dependencies...');
runCommand('npm install --workspaces');

// 2. Build frontend
console.log('\n🎨 Building Frontend...');
runCommand('npm run build', path.join(rootDir, 'frontend'));

// 3. Build admin
console.log('\n🔧 Building Admin...');
runCommand('npm run build', path.join(rootDir, 'admin'));

// 4. Copy web.config files to dist folders
console.log('\n📋 Copying web.config files...');
copyWebConfig(
  path.join(rootDir, 'frontend', 'web.config.template'),
  path.join(rootDir, 'frontend', 'dist', 'web.config')
);
copyWebConfig(
  path.join(rootDir, 'admin', 'web.config.template'),
  path.join(rootDir, 'admin', 'dist', 'web.config')
);

// 5. Create uploads directory if not exists
const uploadsDir = path.join(rootDir, 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

console.log('\n✨ Production build completed successfully!');
console.log('\n📝 Next steps:');
console.log('1. Copy backend/.env.production to backend/.env on VPS');
console.log('2. Copy frontend/.env.production to frontend/.env on VPS');
console.log('3. Copy admin/.env.production to admin/.env on VPS');
console.log('4. Upload the project to VPS');
console.log('5. Run: npm install --workspaces');
console.log('6. Run: pm2 start backend/server.js --name nnkb-backend');
console.log('7. Configure IIS with the built files');
console.log('\n📚 See DEPLOYMENT_GUIDE.md for detailed instructions');
