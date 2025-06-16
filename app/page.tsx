import { fetchCharacters } from '../lib/fetch-characters';

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<{ name?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const name = resolvedSearchParams?.name || '';
  const characters = await fetchCharacters(name);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Rick and Morty Characters</h1>
      <form className="mb-6">
        <input
          type="text"
          name="name"
          defaultValue={name}
          placeholder="Search by name..."
          className="w-full p-2 border rounded"
        />
      </form>
      {characters.length === 0 && <p>No characters found.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {characters.map((char: any) => (
          <div key={char.id} className="p-4 border rounded shadow text-center">
            <img src={char.image} alt={char.name} className="w-full h-auto rounded" />
            <p className="mt-2 font-semibold">{char.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
