import { TableCell } from "@/components/atoms/TableCell";
import { Character } from "@/type/character";
import Image from "next/image";

interface TableRowProps {
  character: Character;
}

export function TableRow({ character }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={character.image}
            alt={character.name}
            width={16}
            height={16}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-medium">{character.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${character.status === 'Alive' ? 'bg-green-100 text-green-800' :
          character.status === 'Dead' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
          {character.status}
        </span>
      </TableCell>
      <TableCell>{character.species}</TableCell>
      <TableCell>{character.gender}</TableCell>
      <TableCell>{character.origin.name}</TableCell>
      <TableCell>{character.location.name}</TableCell>
    </tr>
  );
}
