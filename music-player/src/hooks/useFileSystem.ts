import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";

export const useFileSystem = () => {
  const openFiles = async (): Promise<string[]> => {
    try {
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: "Audio",
            extensions: ["mp3", "flac", "wav", "ogg", "m4a", "aac"],
          },
        ],
      });

      if (selected) {
        const files = Array.isArray(selected) ? selected : [selected];
        return files;
      }
      return [];
    } catch (error) {
      console.error("Error opening files:", error);
      return [];
    }
  };

  const openFolder = async (): Promise<string[]> => {
    try {
      const selected = await open({
        directory: true,
      });

      if (selected && typeof selected === "string") {
        const audioFiles: string[] = [];

        const scanDirectory = async (dirPath: string) => {
          try {
            const entries = await readDir(dirPath);

            for (const entry of entries) {
              const fullPath = `${dirPath}/${entry.name}`;

              if (entry.isDirectory) {
                await scanDirectory(fullPath);
              } else if (entry.isFile) {
                if (/\.(mp3|flac|wav|ogg|m4a|aac)$/i.test(entry.name)) {
                  audioFiles.push(fullPath);
                }
              }
            }
          } catch (error) {
            console.error(`Error scanning directory ${dirPath}:`, error);
          }
        };

        await scanDirectory(selected);
        return audioFiles;
      }
      return [];
    } catch (error) {
      console.error("Error opening folder:", error);
      return [];
    }
  };

  return { openFiles, openFolder };
};
