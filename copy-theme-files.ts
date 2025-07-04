import { resolve, dirname } from 'path';
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs';
import glob from 'glob';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copyThemeFiles = (): void => {
  const targetThemeDir: string = resolve(__dirname, 'theme');
  const customFiles: string[] = glob.sync('custom/theme/**/*', { nodir: true });

  customFiles.forEach((file: string) => {
    const relativePath: string = file.replace('custom/theme/', '');
    const targetPath: string = resolve(targetThemeDir, relativePath);
    const sourcePath: string = resolve(__dirname, file);

    // Ensure target directory exists
    const targetDir: string = targetPath.substring(
      0,
      targetPath.lastIndexOf('/'),
    );
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    if (existsSync(targetPath)) {
      // Compare file contents
      const sourceContent: string = readFileSync(sourcePath, 'utf8');
      const targetContent: string = readFileSync(targetPath, 'utf8');
      if (sourceContent !== targetContent) {
        console.warn(
          chalk.bgYellowBright.black(
            `CONFLICT: ${file} differs from existing file at ${targetPath}. Please review and merge manually.`,
          ),
        );
      }
      return;
    }

    // Copy file (only if it doesn't exist)
    try {
      copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${file} -> ${targetPath}`);
    } catch (error) {
      console.error(`Error copying ${file}:`, error);
    }
  });
};

copyThemeFiles();
