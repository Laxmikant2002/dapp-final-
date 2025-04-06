const base64Key = "JgBEzMQ0SfP1semEJ2/ncmFKckLnN7nY8BXXVJwRV86PJGgqAMzKyQ"; // Replace with your Base64 key
const buffer = Buffer.from(base64Key, "base64");
const hexKey = buffer.toString("hex");

if (hexKey.length === 64) {
  console.log("Hexadecimal Private Key:", hexKey);
} else {
  console.error("Error: Decoded private key is not 64 characters long. Check the Base64 input.");
}