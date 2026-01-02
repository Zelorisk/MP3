import { parseBlob } from "music-metadata-browser";
import { readFile } from "@tauri-apps/plugin-fs";
import { convertFileSrc } from "@tauri-apps/api/core";
import type { Song } from "../types";
import { saveArtwork, getArtwork } from "../utils/artworkCache";

console.log("🎵 Metadata module loaded - Album artwork extraction enabled");

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const extractMetadata = async (
  filePath: string,
): Promise<Partial<Song> | null> => {
  try {
    const convertedPath = convertFileSrc(filePath);
    const cachedArtwork = await getArtwork(convertedPath);

    const fileData = await readFile(filePath);
    const blob = new Blob([fileData]);
    const metadata = await parseBlob(blob);

    let artwork: string | undefined = cachedArtwork || undefined;

    if (
      !cachedArtwork &&
      metadata.common.picture &&
      metadata.common.picture.length > 0
    ) {
      const picture = metadata.common.picture[0];
      console.log(
        "Picture found - Format:",
        picture.format,
        "Data size:",
        picture.data.length,
        "bytes",
      );

      try {
        console.log("Attempting base64 conversion...");
        const base64 = uint8ArrayToBase64(picture.data);
        console.log("Base64 conversion successful, length:", base64.length);
        artwork = `data:${picture.format};base64,${base64}`;
        await saveArtwork(convertedPath, artwork);
        console.log("✅ Artwork cached for:", extractFileName(filePath));
      } catch (artworkError) {
        console.error("❌ Base64 conversion failed:", artworkError);
      }
    } else if (cachedArtwork) {
      console.log(
        "✅ Loaded artwork from cache for:",
        extractFileName(filePath),
      );
    } else {
      console.log("⚠️ No artwork found in:", extractFileName(filePath));
    }

    return {
      title: metadata.common.title || extractFileName(filePath),
      artist: metadata.common.artist || "Unknown Artist",
      album: metadata.common.album || "Unknown Album",
      duration: metadata.format.duration || 0,
      year: metadata.common.year,
      genre: metadata.common.genre?.[0],
      artwork,
      filePath: convertedPath,
      dateAdded: Date.now(),
    };
  } catch (error) {
    console.error("Metadata extraction failed for", filePath, ":", error);
    return null;
  }
};

const extractFileName = (filePath: string): string => {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  return fileName.replace(/\.[^/.]+$/, "");
};

export const useMetadata = () => {
  const extractFromFiles = async (filePaths: string[]): Promise<Song[]> => {
    console.log("📂 Extracting metadata from", filePaths.length, "files");

    const metadataPromises = filePaths.map(async (filePath) => {
      const metadata = await extractMetadata(filePath);
      if (metadata) {
        return {
          id: generateId(),
          ...metadata,
        } as Song;
      }
      return null;
    });

    const results = await Promise.all(metadataPromises);
    const songs = results.filter((song): song is Song => song !== null);
    console.log(
      "✅ Extracted",
      songs.length,
      "songs,",
      songs.filter((s) => s.artwork).length,
      "with artwork",
    );
    return songs;
  };

  return { extractFromFiles, extractMetadata };
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
