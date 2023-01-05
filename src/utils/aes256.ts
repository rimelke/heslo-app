import crypto from "react-native-quick-crypto";

const decrypt = (encrypted: string, key: string) => {
  if (typeof key !== "string" || !key) {
    throw new TypeError('Provided "key" must be a non-empty string');
  }

  var isString = typeof encrypted === "string";
  var isBuffer = Buffer.isBuffer(encrypted);
  if (
    !(isString || isBuffer) ||
    (isString && !encrypted) ||
    (isBuffer && !Buffer.byteLength(encrypted))
  ) {
    throw new TypeError(
      'Provided "encrypted" must be a non-empty string or buffer'
    );
  }

  var sha256 = crypto.createHash("sha256");
  sha256.update(key);

  var input = encrypted;
  if (isString) {
    input = Buffer.from(encrypted, "base64");

    if (input.length < 17) {
      throw new TypeError(
        'Provided "encrypted" must decrypt to a non-empty string or buffer'
      );
    }
  } else {
    if (Buffer.byteLength(encrypted) < 17) {
      throw new TypeError(
        'Provided "encrypted" must decrypt to a non-empty string or buffer'
      );
    }
  }

  // Initialization Vector
  var iv = input.slice(0, 16);
  var decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);

  var ciphertext = input.slice(16);

  var output;
  if (isString) {
    output = decipher.update(ciphertext) + decipher.final();
  } else {
    output = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }

  return output;
};
