export default async function NotFound() {
  return <div className="p-4 border border-slate-800 rounded-lg">
    <h1 className="text-xl py-2">
      Not Found
    </h1>
    <p>
      If you see this then that means routes does not exists at build time.
      Either expand your generatedStaticParams() or enable dynamicParams to allow ISR (computation at request time)
    </p>
  </div>
}
