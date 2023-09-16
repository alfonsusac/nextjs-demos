export default function NotFoundPage() {
  return (
    <div className="text-center pt-24">
      <article>
        <div className="text-3xl pb-4">
          404
        </div>
        <h1>
          Article Not Found!
        </h1>
        <p className="pb-2">
          {`Either alfon hasn't published it or it really isn't there`}
        </p>
      </article>
    </div>
  )
}