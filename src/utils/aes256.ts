import crypto from "react-native-quick-crypto";

const decrypt = (key: string, data: string) => {
  const hashKey = crypto.createHash("sha256").update(key).digest();
  const input = Buffer.from(data, "base64");

  const iv = input.subarray(0, 16);
  const ciphertext = input.subarray(16);

  const decipher = crypto.createDecipheriv("aes-256-ctr", hashKey, iv);

  return decipher.update(ciphertext, "base64", "utf8") + decipher.final("utf8");
};

const aes256 = { decrypt };

export default aes256;
