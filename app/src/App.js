import React from "react";
import "./App.css";
import { PokemonFusion } from "./components/pokemon-fusion";
import PokemonSelect from "./components/pokemon-select";
import {
  fullyEvolvedPokemonIds,
  pokemonNameById,
} from "./data/infiniteFusionData";

function App() {
  const [pokemon, setPokemon] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(null);
  const [filter, setFilter] = React.useState({
    min: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spe: 0, bs: 500 },
    needsCustomSprite: true,
  });

  const onFilterInputChange = ({ target }) => {
    setFilter((f) => ({
      ...f,
      min: { ...f.min, [target.name]: target.value },
    }));
  };

  return (
    <div className="App">
      <PokemonSelect onChange={setPokemon}></PokemonSelect>
      <div className="filter">
        <label for="hp">hp: </label>
        <input
          id="hp"
          name="hp"
          placeholder="hp"
          type="number"
          defaultValue={filter.min.hp}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="atk">atk: </label>
        <input
          id="atk"
          name="atk"
          placeholder="atk"
          type="number"
          defaultValue={filter.min.atk}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="def">def: </label>
        <input
          id="def"
          name="def"
          placeholder="def"
          type="number"
          defaultValue={filter.min.def}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="spatk">spatk: </label>
        <input
          id="spatk"
          name="spatk"
          placeholder="spatk"
          type="number"
          defaultValue={filter.min.spatk}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="def">spdef: </label>
        <input
          id="spdef"
          name="spdef"
          placeholder="spdef"
          type="number"
          defaultValue={filter.min.spdef}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="spe">spe: </label>
        <input
          id="spe"
          name="spe"
          placeholder="spe"
          type="number"
          defaultValue={filter.min.spe}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="bs">bs: </label>
        <input
          id="bs"
          name="bs"
          placeholder="bs"
          type="number"
          defaultValue={filter.min.bs}
          onChange={onFilterInputChange}
          min={0}
          max={500}
        />
        <label for="needsCustomSprite">Custom Sprites</label>
        <input
          type="checkbox"
          id="needsCustomSprite"
          name="needsCustomSprite"
          checked={filter.needsCustomSprite}
          onChange={(e) =>
            setFilter((f) => ({ ...f, needsCustomSprite: e.target.checked }))
          }
        />
      </div>
      {!!pokemon && (
        <div className="fusion-list">
          {fullyEvolvedPokemonIds
            .map((id) => ({ id, name: pokemonNameById[id] }))
            .map((poke) => (
              <a
                className="pokemon-couple"
                ey={poke.id}
                onClick={() =>
                  setShowDetails((id) => (id === poke.id ? null : poke.id))
                }
              >
                <PokemonFusion
                  pokemon1={pokemon}
                  pokemon2={poke}
                  showDetails={showDetails === poke.id}
                  filter={filter}
                />
                <PokemonFusion
                  pokemon1={poke}
                  pokemon2={pokemon}
                  showDetails={showDetails === poke.id}
                  filter={filter}
                />
              </a>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
