import { pokemonIdByName, pokemons } from "../data/infiniteFusionData";

export default function PokemonSelect({ onChange }) {
  return (
    <>
      <input
        list="pokelist"
        onChange={(e) =>
          onChange(
            pokemonIdByName[e.target.value]
              ? {
                  id: pokemonIdByName[e.target.value],
                  name: e.target.value,
                }
              : undefined
          )
        }
      />
      <datalist id="pokelist">
        {pokemons.map(([name, id]) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </datalist>
    </>
  );
}
