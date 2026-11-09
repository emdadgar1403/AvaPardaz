package com.avapardaz.app.domain.model

enum class ModelStatus(val labelFa: String) {
    INSTALLED("نصب‌شده در حافظه"),
    CONTRACT_PENDING("اتصال در مرحله بعد (تعریف قرارداد فنی)"),
    NOT_DOWNLOADED("نیاز به معرفی فایل"),
    ERROR("خطا در بارگذاری")
}

data class ModelInfo(
    val id: String,
    val nameFa: String,
    val engineType: TtsEngineType,
    val sampleRate: Int,
    val sizeBytes: Long,
    val status: ModelStatus,
    val isDefault: Boolean = false,
    val filePath: String? = null,
    val supportedLanguages: List<String> = listOf("fa-IR"),
    val description: String = ""
)
