// Ce fichier n'est plus utilisé, voir /articles/loading.jsx

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecedf6]">
      <div className="w-full max-w-4xl">
        <div className="h-8 w-1/3 bg-neutral-200 rounded mb-8 animate-pulse mx-auto" />
        <div className="flex gap-10 flex-row w-full justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-2xl h-96 shadow-md flex-1 min-w-0"
              style={{ maxWidth: "420px" }}
            >
              <div className="h-48 bg-gray-300 rounded-t-2xl" />
              <div className="p-6 space-y-4">
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-6 w-40 bg-gray-300 rounded" />
                <div className="h-4 w-32 bg-gray-300 rounded" />
                <div className="h-10 w-28 bg-gray-300 rounded mt-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
