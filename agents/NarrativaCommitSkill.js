import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colores ANSI para la consola
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  bgGreen: '\x1b[42m',
  bgBlack: '\x1b[40m',
};

/**
 * Skill: NarrativaCommit
 * 
 * Recibe un git diff completo, guarda el diff junto con un prompt estructurado
 * en .agent/temp/PROMPT_COMMIT.md para que el agente lo procese interactivamente.
 * 
 * @param {string} payload - El contenido completo del git diff
 */
export const run = async (payload) => {
  const diff = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);

  // 1. Crear la carpeta temporal si no existe
  const tempDir = path.join(__dirname, '../.agent/temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log(`${COLORS.cyan}📁 Carpeta .agent/temp/ creada.${COLORS.reset}`);
  }

  // 2. Construir el contenido del archivo PROMPT_COMMIT.md
  const promptContent = `# Instrucciones para el Agente

  Agente, lee el diff a continuación y genera un mensaje de commit usando Conventional Commits. Pregúntame si quiero aplicarlo. Si te digo que sí, ejecuta en la terminal el comando de git commit con ese mensaje, y luego ejecuta el orquestador para llamar a RegistradorCommitSkill y actualizar la BITACORA.md. Diff:

---

## Git Diff

\`\`\`diff
${diff}
\`\`\`
`;

  // 3. Guardar el archivo
  const outputPath = path.join(tempDir, 'PROMPT_COMMIT.md');
  fs.writeFileSync(outputPath, promptContent, 'utf8');

  // 4. Mensaje llamativo en consola
  const border = `${COLORS.bright}${COLORS.green}${'═'.repeat(60)}${COLORS.reset}`;
  console.log('\n' + border);
  console.log(`${COLORS.bright}${COLORS.bgGreen}${COLORS.bgBlack}  ✅ NarrativaCommit — Archivo preparado con éxito  ${COLORS.reset}`);
  console.log(border);
  console.log(`\n  ${COLORS.yellow}📄 Archivo generado:${COLORS.reset} ${COLORS.cyan}.agent/temp/PROMPT_COMMIT.md${COLORS.reset}`);
  console.log(`\n  ${COLORS.magenta}➡️  Abre el chat del agente y escribe:${COLORS.reset}`);
  console.log(`  ${COLORS.bright}"Ejecuta las instrucciones de .agent/temp/PROMPT_COMMIT.md"${COLORS.reset}`);
  console.log('\n' + border + '\n');

  return {
    success: true,
    outputPath,
    message: 'PROMPT_COMMIT.md generado correctamente.'
  };
};
