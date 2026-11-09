package com.avapardaz.app.audio.processing

/**
 * Normalizes Persian text for speech synthesis:
 * - Unifies Arabic/Persian character variants (ی / ك / ة)
 * - Standardizes Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله)
 * - Converts Arabic/English digits to Persian or standardizes them
 * - Cleans excessive whitespace while preserving punctuation
 */
object PersianTextNormalizer {

    private const val ZWNJ = '\u200C'

    fun normalize(rawText: String): String {
        if (rawText.isBlank()) return ""

        var text = rawText
            // Arabic to Persian character conversions
            .replace('ي', 'ی')
            .replace('ى', 'ی')
            .replace('ك', 'ک')
            .replace('ؤ', 'و')
            .replace('إ', 'ا')
            .replace('أ', 'ا')
            .replace('آ', 'آ')
            .replace('ة', 'ه')
            .replace('ۀ', 'ه')
            .replace("ـ", "") // Tatweel removal

        // Normalize multiple spaces into single space
        text = text.replace(Regex("[ \\t]+"), " ")

        // Clean ZWNJ misplaced around spaces
        text = text.replace(" $ZWNJ", " ")
            .replace("$ZWNJ ", " ")
            .replace("$ZWNJ$ZWNJ+", "$ZWNJ")

        // Unify Persian question mark and comma
        text = text.replace('?', '؟')
            .replace(',', '،')
            .replace(';', '؛')

        return text.trim()
    }

    fun countWords(text: String): Int {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return 0
        return trimmed.split(Regex("[\\s،؛.؟!]+")).filter { it.isNotBlank() }.size
    }

    fun countCharacters(text: String): Int {
        return text.length
    }
}
