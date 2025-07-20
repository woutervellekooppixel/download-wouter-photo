// app/beheer/page.tsx
import { getZipsWithHeroFromOneDrive } from "@/lib/microsoftGraph";

export const dynamic = "force-dynamic"; // nodig bij server-functies

export default async function BeheerPage() {
  const items = await getZipsWithHeroFromOneDrive();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📁 OneDrive beheer</h1>

      {items.length === 0 && (
        <p className="text-gray-500">Geen ZIP-bestanden gevonden in OneDrive-folder.</p>
      )}

      <ul className="space-y-8">
        {items.map((item) => {
          const jsonSnippet = {
            [item.slug]: {
              title: item.name.replace(".zip", "").replace(/[-_]/g, " "),
              downloadUrl: item.zipUrl,
              ...(item.heroUrl && { heroImage: item.heroUrl }),
            },
          };

          return (
            <li
              key={item.slug}
              className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-sm text-gray-500">Slug: <code>{item.slug}</code></p>
                </div>
                {item.heroUrl && (
                  <img
                    src={item.heroUrl}
                    alt="Hero"
                    className="w-32 h-20 object-cover rounded border"
                  />
                )}
              </div>

              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-blue-600 underline">
                  Toon JSON-entry
                </summary>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(jsonSnippet, null, 2)}
                </pre>
              </details>
            </li>
          );
        })}
      </ul>
    </main>
  );
}