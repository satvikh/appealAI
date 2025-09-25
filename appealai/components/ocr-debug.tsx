"use client"

export function OCRDebug({ extractedText, fileName }: { extractedText: string, fileName: string }) {
  console.log('Text extracted from', fileName, ':', extractedText)
  console.log('Upload completed:', { fileName, textLength: extractedText.length })

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-sm">
      <h4 className="font-bold">OCR Debug</h4>
      <p>File: {fileName}</p>
      <p>Characters: {extractedText.length}</p>
      <p>Status: {extractedText.length > 0 ? "✅ Success" : "❌ Failed"}</p>
    </div>
  )
}