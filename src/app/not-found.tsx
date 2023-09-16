export default async function NotFound() {
  return <div className="p-4 rounded-lg mx-auto ">
    <div className="max-w-lg m-auto flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-5xl py-2">
        Route Not Found
      </h1>
      <p>
        root not found page
      </p>
      <p>
        src/app/not-found.tsx
      </p>
      <p>
        If you see this then that means routes does not exists at build time.
        Either expand your generatedStaticParams() or enable dynamicParams to allow ISR (computation at request time)
      </p>
    </div>
  </div>
}
