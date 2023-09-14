import Jimp from "jimp"

export async function convertBMPtoPNG(buffer: Buffer) {
  const img = await Jimp.read(buffer)
  const png = await img.getBufferAsync(Jimp.MIME_PNG)
  return png
}