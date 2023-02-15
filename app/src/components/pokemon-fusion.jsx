import React from "react";
import {
  typeSwap,
  typeUni,
  statsException,
  statsFix,
  abilitiesException,
  abilitiesFix,
  nameException,
  nameFix,
  selfFusionTypeException,
  selfFusionTypeFix,
  customSprites,
} from "../data/infiniteFusionData";

const loadPokemonData = async (pokemonName) => {
  const data = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + pokemonName
  ).then((res) => res.json());
  return data;
};

const getTypes = (pokemonName, types) => {
  var result = [];
  var compt = 0;

  //Exception mon selected for swapped types
  for (var i = 0; i < typeSwap.length; i++) {
    if (typeSwap[i][2] == pokemonName) {
      result.push(typeSwap[i][0]);
      result.push(typeSwap[i][1]);
      var compt = 1;
    }
  }

  //Exception mon selected for one type
  for (var i = 0; i < typeUni.length; i++) {
    if (typeUni[i][1] == pokemonName) {
      result.push(typeUni[i][0]);
      var compt = 2;
    }
  }

  if (compt == 0) {
    result.push(types[0].type.name);
    if (types.length == 2 && compt != 2) {
      if (types[0].type.name == "normal" && types[1].type.name == "flying") {
        result[0] = "flying";
      } else {
        result.push(types[1].type.name);
      }
    }
  }
  return result;
};

const getStats = (pokemonName, stats) => {
  var stats1;
  if (statsException.includes(pokemonName)) {
    stats1 = statsFix[statsException.indexOf(pokemonName)];
  } else {
    stats1 = stats;
  }

  var monstats = [];
  for (var i = 0; i < stats1.length; i++) {
    monstats.push(stats1[i].base_stat);
  }
  return monstats;
};

const getAbilities = (pokemonName, abilities) => {
  var ab1;
  if (abilitiesException.includes(pokemonName)) {
    ab1 = abilitiesFix[abilitiesException.indexOf(pokemonName)];
  } else {
    ab1 = abilities;
  }
  var mon1abilities = [];
  for (var i = 0; i < ab1.length; i++) {
    mon1abilities.push([ab1[i].ability, ab1[i].is_hidden]);
  }
  return mon1abilities;
};

const getFusionImage = (fusionId) => {
  //github.com/Aegide/custom-fusion-sprites/blob/main/CustomBattlers/1.1.png?raw=true
  var fusionUrl = `https://raw.githubusercontent.com/Aegide/custom-fusion-sprites/main/CustomBattlers/${fusionId}.png?raw=true`;
  if (doesImageExists(fusionId)) {
    return [true, fusionUrl];
  } else {
    var headId = fusionId.split(".")[0];
    return [
      false,
      `https://github.com/Aegide/autogen-fusion-sprites/blob/master/Battlers/${headId}/${fusionId}.png?raw=true`,
    ];
  }
};

const doesImageExists = (fusionId) => {
  return customSprites.includes(fusionId);
};

const fusionAbilities = (headAbilities, bodyAbilities) => {
  var B0 = bodyAbilities[0][0].name;
  var H1;

  //If there is only ability, pick that one
  if (headAbilities.length == 1) {
    H1 = headAbilities[0][0].name;
  }

  //If the second ability is a hidden ability, pick the first ability
  else if (headAbilities[1][1] == true) {
    H1 = headAbilities[0][0].name;
  }
  //Otherwise, actually take the second ability
  else {
    H1 = headAbilities[1][0].name;
  }

  return [B0, H1];
};

const fusionHiddenAbilities = (
  headAbilities,
  bodyAbilities,
  fusionAbilities
) => {
  var headAbility, bodyAbility;
  var allAbilities = [];

  var maxAbilities = 3; //Pokémons can't have more than 3 abilities
  for (var a = 0; a < maxAbilities; a++) {
    if (a < headAbilities.length) {
      headAbility = headAbilities[a][0].name;
      allAbilities.push(headAbility);
    }
    if (a < bodyAbilities.length) {
      bodyAbility = bodyAbilities[a][0].name;
      allAbilities.push(bodyAbility);
    }
  }

  var hiddenAbilities = allAbilities.filter(
    (n) => !fusionAbilities.includes(n)
  );

  return hiddenAbilities;
};

const removeDuplicates = (list) => {
  return Array.from(new Set(list));
};

const sanitizeAbilityList = (abilityList) => {
  if (abilityList.length == 0) {
    return abilityList;
  }

  abilityList = removeDuplicates(abilityList);

  var listAb1 = "";
  for (var i = 0; i < abilityList.length; i++) {
    listAb1 =
      listAb1 +
      abilityList[i].charAt(0).toUpperCase() +
      abilityList[i].slice(1) +
      " / ";
  }
  listAb1 = listAb1.slice(0, listAb1.length - 1);
  listAb1 = listAb1.split("-").join(" ");
  listAb1 = listAb1.split(" ");
  for (var i = 0, x = listAb1.length; i < x; i++) {
    listAb1[i] = listAb1[i][0].toUpperCase() + listAb1[i].substr(1);
  }
  listAb1 = listAb1.join(" ").slice(0, -2);

  return listAb1;
};

const fusType = (mon1, mon2) => {
  var fmon = [];

  //cas H0/null + B0/null [H0#B0] -> H0/B0
  if (mon1.length == 1 && mon2.length == 1) {
    if (mon1[0] != mon2[0]) {
      fmon.push(mon1[0]);
      fmon.push(mon2[0]);

      //cas H0/null + B0/null [H0=B0] -> H0/null
    } else {
      fmon.push(mon1[0]);
    }
  } else if (mon1.length == 2 && mon2.length == 1) {
    //cas H0/H1 + B0/null [H0#B0] -> H0/B0
    if (mon1[0] != mon2[0]) {
      fmon.push(mon1[0]);
      fmon.push(mon2[0]);

      // Exception:
      // The body will provide its primary type
      // instead of the secondary
      // if the head is already providing that element.

      //cas H0/H1 + B0/null [H0=B0] -> H0
    } else {
      fmon.push(mon1[0]);
    }
  } else if (mon1.length == 1 && mon2.length == 2) {
    //cas H0/null + B0/B1 [H0#B1] -> H0/B1
    if (mon1[0] != mon2[1]) {
      fmon.push(mon1[0]);
      fmon.push(mon2[1]);

      //cas H0/null + B0/B1 [H0=B1] -> H0/B0
    } else {
      fmon.push(mon1[0]);
      fmon.push(mon2[0]);
    }

    //cas H0/H1 + B0/B1 [H0=B1] -> H0/B0
  } else if (mon1.length == 2 && mon2.length == 2) {
    if (mon1[0] == mon2[1]) {
      fmon.push(mon1[0]);
      fmon.push(mon2[0]);

      //cas H0/H1 + B0/B1 [H0#B1] -> H0/B1
    } else {
      fmon.push(mon1[0]);
      fmon.push(mon2[1]);
    }
  }
  return fmon;
};
const fuseType = (poke1, poke2) => {
  if (poke1 == poke2 && selfFusionTypeException.includes(poke1)) {
    return selfFusionTypeFix[selfFusionTypeException.indexOf(poke1)];
  } else {
    return fusType(poke1.types, poke2.types);
  }
};

const fuseStats = (mon1stats, mon2stats) => {
  var hp = Math.floor(mon2stats[0] / 3 + 2 * (mon1stats[0] / 3));
  var atk = Math.floor(2 * (mon2stats[1] / 3) + mon1stats[1] / 3);
  var def = Math.floor(2 * (mon2stats[2] / 3) + mon1stats[2] / 3);
  var spatk = Math.floor(mon2stats[3] / 3 + 2 * (mon1stats[3] / 3));
  var spdef = Math.floor(mon2stats[4] / 3 + 2 * (mon1stats[4] / 3));
  var spe = Math.floor(2 * (mon2stats[5] / 3) + mon1stats[5] / 3);
  var bs = hp + atk + def + spatk + spdef + spe;
  return { hp, atk, def, spatk, spdef, spe, bs };
};

const fuse = (poke1, poke2) => {
  var result = {};
  if (!nameFix.includes(poke1) && !nameFix.includes(poke2)) {
    result.fpoke1 = poke1.name;
    result.fpoke2 = poke2.name;
  } else if (nameFix.includes(poke1) && !nameFix.includes(poke2)) {
    result.fpoke1 =
      nameException[nameFix.indexOf(poke1)].charAt(0).toUpperCase() +
      nameException[nameFix.indexOf(poke1)].slice(1);
    result.fpoke2 = poke2.name;
  } else if (!nameFix.includes(poke1) && nameFix.includes(poke2)) {
    result.fpoke1 = poke1.name;
    result.fpoke2 =
      nameException[nameFix.indexOf(poke2)].charAt(0).toUpperCase() +
      nameException[nameFix.indexOf(poke2)].slice(1);
  } else if (nameFix.includes(poke1) && nameFix.includes(poke2)) {
    result.fpoke1 =
      nameException[nameFix.indexOf(poke1)].charAt(0).toUpperCase() +
      nameException[nameFix.indexOf(poke1)].slice(1);
    result.fpoke2 =
      nameException[nameFix.indexOf(poke2)].charAt(0).toUpperCase() +
      nameException[nameFix.indexOf(poke2)].slice(1);
  }

  result.dexnum = Math.floor(poke1.id + 420 * poke2.id);
  result.fusionId = `${poke1.id}.${poke2.id}`;
  result.poke1 = poke1;
  result.poke2 = poke2;
  var [hasCustomSprite, imageUrl] = getFusionImage(result.fusionId);
  result.hasCustomSprite = hasCustomSprite;
  result.imageUrl = imageUrl;
  result.abilities = sanitizeAbilityList(
    fusionAbilities(poke1.abilities, poke2.abilities)
  );
  result.hiddenAbilities = sanitizeAbilityList(
    fusionHiddenAbilities(
      poke1.abilities,
      poke2.abilities,
      fusionAbilities(poke1.abilities, poke2.abilities)
    )
  );
  result.stats = fuseStats(poke1.stats, poke2.stats);
  result.types = fuseType(poke1, poke2);

  console.log(result);
  return result;
};

export function PokemonFusion({
  pokemon1,
  pokemon2,
  filter = {
    min: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spe: 0, bs: 500 },
    needsCustomSprite: true,
  },
  showDetails = false,
}) {
  const [fusion, setFusion] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      const [d1, d2] = await Promise.all([
        loadPokemonData(pokemon1.name),
        loadPokemonData(pokemon2.name),
      ]);
      const poke1 = {
        id: pokemon1.id,
        name: pokemon1.name,
        types: getTypes(pokemon1.name, d1.types),
        stats: getStats(pokemon1.name, d1.stats),
        abilities: getAbilities(pokemon1.name, d1.abilities),
      };
      const poke2 = {
        id: pokemon2.id,
        name: pokemon2.name,
        types: getTypes(pokemon2.name, d2.types),
        stats: getStats(pokemon2.name, d2.stats),
        abilities: getAbilities(pokemon2.name, d2.abilities),
      };
      const fusion = fuse(poke1, poke2);
      setFusion(fusion);
    };
    load();
  }, [pokemon1, pokemon2, setFusion]);

  const fitsFilter = () => {
    return (
      (!filter.needsCustomSprite || fusion.hasCustomSprite) &&
      Object.keys(fusion.stats).every(
        (key) => fusion.stats[key] >= filter.min[key]
      )
    );
  };

  if (!fusion || !fitsFilter()) return;

  return (
    <div className="fusion">
      <div>
        <span id="dexnumber1">{fusion.dexnum}</span>
        <span
          id="fusionid1"
          className={fusion.hasCustomSprite ? "green-text" : "red-text"}
        >
          ({fusion.fusionId})
        </span>
      </div>
      <img
        className="picpok"
        id="pic1"
        alt={"hasCustomSprite:" + fusion.hasCustomSprite}
        src={fusion.imageUrl}
      />
      <div id="FP1">
        {fusion.poke1.name}/{fusion.poke2.name}
      </div>
      <div id="typecont">
        {fusion.types.map((type) => (
          <img
            className="pictype"
            id="p1"
            src={`https://berlimon.github.io/types/${type}.png`}
          />
        ))}
      </div>
      {showDetails && (
        <div className="details">
          <div className="stats-list">
            <div className="monstats" id="hp1">
              HP: {fusion.stats.hp}
            </div>
            <div className="monstats" id="atk1">
              ATK: {fusion.stats.atk}
            </div>
            <div className="monstats" id="def1">
              DEF: {fusion.stats.def}
            </div>
            <div className="monstats" id="spatk1">
              SPE.ATK: {fusion.stats.spatk}
            </div>
            <div className="monstats" id="spdef1">
              SPE.DEF: {fusion.stats.spdef}
            </div>
            <div className="monstats" id="spe1">
              SPEED: {fusion.stats.spe}
            </div>
          </div>
          <div className="montotal" id="bs1">
            TOTAL: {fusion.stats.bs}
          </div>
          <div className="monab" id="ab1">
            {fusion.abilities}
          </div>
          <div className="monhab" id="hab1">
            {fusion.hiddenAbilities}
          </div>
        </div>
      )}
    </div>
  );
}
