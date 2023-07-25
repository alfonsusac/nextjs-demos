export default async function NotFound() {
  return <div className="p-4 border border-zinc-800 rounded-lg">
    <h1 className="text-xl py-2">
      Route Not Found
    </h1>
    <p>
      root not-found.tsx
    </p>
    <p>
      If you see this then that means routes does not exists at build time.
      Either expand your generatedStaticParams() or enable dynamicParams to allow ISR (computation at request time)
    </p>
  </div>
}
