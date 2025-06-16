import { Spinner } from "@/components/atoms/Spinner";
import { TableCell } from "@/components/atoms/TableCell";
import { TableRow } from "@/components/molecules/TableRow";
import { Character } from "@/type/character";


interface CharacterTableProps {
  characters: Character[];
  loading?: boolean;
}

export function CharacterTable({ characters, loading = false }: CharacterTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <TableCell header>Character</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Species</TableCell>
            <TableCell header>Gender</TableCell>
            <TableCell header>Origin</TableCell>
            <TableCell header>Location</TableCell>
          </tr>
        </thead>
        <tbody>
          {characters.map((character) => (
            <TableRow key={character.id} character={character} />
          ))}
          {loading && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center">
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {characters.length === 0 && !loading && (
        <div className="px-6 py-8 text-center text-gray-500">
          No characters found
        </div>
      )}
    </div>
  );
}
