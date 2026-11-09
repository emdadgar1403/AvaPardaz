package com.avapardaz.app.audio.export

import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * Encodes raw 16-bit PCM byte array into a standard RIFF/WAVE file container.
 */
object WavExporter {

    fun exportToWav(
        pcmData: ByteArray,
        outputFile: File,
        sampleRate: Int = 22050,
        channels: Int = 1,
        bitDepth: Int = 16
    ): Result<File> {
        return try {
            val byteRate = sampleRate * channels * (bitDepth / 8)
            val blockAlign = channels * (bitDepth / 8)
            val subChunk2Size = pcmData.size
            val chunkSize = 36 + subChunk2Size

            FileOutputStream(outputFile).use { fos ->
                val header = ByteBuffer.allocate(44).apply {
                    order(ByteOrder.LITTLE_ENDIAN)
                    put("RIFF".toByteArray())
                    putInt(chunkSize)
                    put("WAVE".toByteArray())
                    put("fmt ".toByteArray())
                    putInt(16) // Subchunk1Size for PCM
                    putShort(1) // AudioFormat 1 = PCM
                    putShort(channels.toShort())
                    putInt(sampleRate)
                    putInt(byteRate)
                    putShort(blockAlign.toShort())
                    putShort(bitDepth.toShort())
                    put("data".toByteArray())
                    putInt(subChunk2Size)
                }
                fos.write(header.array())
                fos.write(pcmData)
                fos.flush()
            }
            Result.success(outputFile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
