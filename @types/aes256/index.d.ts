declare module "aes256" {
  function encrypt(key: string, data: string): string;
  function decrypt(key: string, data: string): string;
}
