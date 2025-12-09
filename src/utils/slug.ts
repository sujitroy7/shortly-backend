const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateSlug(num: number): string {
  let encoded = "";

  // Convert number → base62 string
  while (num > 0) {
    encoded = alphabet[num % 62] + encoded;
    num = Math.floor(num / 62);
  }

  // Ensure ALWAYS 7 characters
  return encoded.padStart(7, "a");
}
