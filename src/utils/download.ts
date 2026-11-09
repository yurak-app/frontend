/** Saves a Blob as a file via a throwaway object URL — the standard trick for
 * triggering a "Save As" for something that was fetched with a header a plain
 * `<a href>` (which can't send one) couldn't have reached on its own. */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
