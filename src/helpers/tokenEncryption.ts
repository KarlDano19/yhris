// Function to generate a random encryption key
export async function generateKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // Whether the key is extractable (i.e., can be exported)
    ['encrypt', 'decrypt'] // Key usage
  );
}

// Function to encrypt the token
export async function encryptToken(
  token: string,
  key: CryptoKey
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  // Convert token to ArrayBuffer
  const data = new TextEncoder().encode(token);

  // Generate an IV (Initialization Vector)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the token using AES-GCM algorithm
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128,
    },
    key,
    data
  );

  // Return the encrypted token and IV as ArrayBuffer
  return { encryptedData, iv };
}

// Function to decrypt the token
export async function decryptToken(encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
  // Decrypt the encrypted data using AES-GCM algorithm
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  );

  // Convert the decrypted data from ArrayBuffer to string
  return new TextDecoder().decode(decryptedData);
}
