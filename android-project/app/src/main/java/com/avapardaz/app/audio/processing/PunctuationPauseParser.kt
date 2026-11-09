package com.avapardaz.app.audio.processing

import com.avapardaz.app.domain.model.PauseConfig

data class TextSegmentWithPause(
    val segmentText: String,
    val pauseAfterMs: Int,
    val punctuationMark: String?
)

/**
 * Splits Persian text into phonetically meaningful units based on punctuation,
 * applying the user-configured smart pause durations.
 */
class PunctuationPauseParser(private val pauseConfig: PauseConfig) {

    fun parse(text: String): List<TextSegmentWithPause> {
        val normalized = PersianTextNormalizer.normalize(text)
        if (normalized.isBlank()) return emptyList()

        if (!pauseConfig.smartPauseEnabled) {
            return listOf(TextSegmentWithPause(segmentText = normalized, pauseAfterMs = 0, punctuationMark = null))
        }

        val pattern = Regex("([^،؛.؟!\\n]+)([،؛.؟!\\n]|$)")
        val matches = pattern.findAll(normalized)
        val segments = mutableListOf<TextSegmentWithPause>()

        for (match in matches) {
            val content = match.groupValues[1].trim()
            val punct = match.groupValues.getOrNull(2)

            if (content.isNotBlank()) {
                val pauseMs = when (punct) {
                    "،" -> pauseConfig.commaPauseMs
                    "؛" -> (pauseConfig.commaPauseMs * 1.3f).toInt()
                    "." -> pauseConfig.periodPauseMs
                    "؟" -> pauseConfig.questionPauseMs
                    "!" -> pauseConfig.periodPauseMs
                    "\n" -> pauseConfig.paragraphPauseMs
                    else -> 0
                }
                segments.add(
                    TextSegmentWithPause(
                        segmentText = content,
                        pauseAfterMs = pauseMs,
                        punctuationMark = punct
                    )
                )
            }
        }

        return if (segments.isEmpty()) {
            listOf(TextSegmentWithPause(segmentText = normalized, pauseAfterMs = 0, punctuationMark = null))
        } else {
            segments
        }
    }
}
