"use client"

export default function ArticlePageError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return <div>
    Error Rendering Page!
    <span className="underline italic cursor-pointer"
      onClick={ reset }
    >
      retry
    </span>
    <div>Error Message: </div>
    <div>{ error.message ?? error.toString() }</div>
  </div>
}