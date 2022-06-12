import React from 'react';
import './App.css';
import ballImage from "./ball.jpg";

const GameModes = {
  symbols: "Symbols" as const,
  names: "Names" as const
};

type SymbolsMode = typeof GameModes.symbols;
type NamesMode = typeof GameModes.names;
type GameMode = SymbolsMode | NamesMode;

type GameStat = Record<GameMode, {
  [question: string]: {
    numer: number, // number of correct guesses
    denom: number; // total number of guesses
    wrong: boolean; // wrongly guessed in last run?
  }
}>;

interface Entry {
  question: string;
  answer: string;
  wrong: boolean;
  bucket: number;
}

const tableBySymbol: Record<string, string> = {
  H: "waterstof",
  He: "helium",
  Li: "lithium",
  Be: "beryllium",
  B: "boor",
  C: "koolstof",
  N: "stikstof",
  O: "zuurstof",
  F: "fluor",
  Ne: "neon",
  Na: "natrium",
  Mg: "magnesium",
  Al: "aluminium",
  Si: "silicium",
  P: "fosfor",
  S: "zwavel",
  Cl: "chloor",
  Ar: "argon",
  K: "kalium",
  Ca: "calcium",
  Ti: "titaan",
  V: "vanadium",
  Cr: "chroom",
  Mn: "mangaan",
  Fe: "ijzer",
  Co: "kobalt",
  Ni: "nikkel",
  Cu: "koper",
  Zn: "zink",
  Ge: "germanium",
  As: "arseen",
  Br: "broom",
  Kr: "krypton",
  Rb: "rubidium",
  Sr: "strontium",
  Mo: "molybdeen",
  Ag: "zilver",
  Cd: "cadmium",
  In: "indium",
  Sn: "tin",
  I: "jood",
  Xe: "xenon",
  Cs: "cesium",
  Ba: "barium",
  W: "wolfraam",
  Pt: "platina",
  Au: "goud",
  Hg: "kwik",
  Pb: "lood",
  Ra: "radium",
  U: "uranium",
  Pu: "plutonium",

  // Ac: "actinium",
  // Th: "thorium",
  // Pa: "protactinium",
  // Np: "neptunium",
  // Am: "americium",
  // Cm: "curium",
  // Bk: "berkelium",
  // Cf: "californium",
  // Es: "einsteinium",
  // Fm: "fermium",
  // Md: "mendelevium",
  // No: "nobelium",
  // Lr: "lawrencium",
  // Rf: "rutherfordium",
  // Db: "dubnium",
  // Sg: "seaborgium",
  // Bh: "bohrium",
  // Hs: "hassium",
  // Mt: "meitnerium",
  // Ds: "darmstadtium",
  // Rg: "r",
  // Cn: "copernicium",
  // Nh: "nihonium",
  // Fl: "flerovium",
  // Mc: "moscovium",
  // Lv: "livermorium",
  // Ts: "tennessine",
  // Og: "oganesson",
  // Uue: "ununennium",
  // Ga: "gallium",
  // Se: "seleen",
  // Y: "yttrium",
  // Zr: "zirkonium",
  // Nb: "niobium",
  // Tc: "technetium",
  // Ru: "ruthenium",
  // Rh: "rodium",
  // Pd: "palladium",
  // Sb: "antimoon",
  // Te: "telluur",
  // La: "lanthaan",
  // Ce: "cerium",
  // Pr: "praseodymium",
  // Nd: "neodymium",
  // Pm: "promethium",
  // Sm: "samarium",
  // Eu: "europium",
  // Gd: "gadolinium",
  // Tb: "terbium",
  // Dy: "dysprosium",
  // Ho: "holmium",
  // Er: "erbium",
  // Tm: "thulium",
  // Yb: "ytterbium",
  // Lu: "lutetium",
  // Hf: "hafnium",
  // Ta: "tantaal",
  // Re: "renium",
  // Os: "osmium",
  // Ir: "iridium",
  // Tl: "thallium",
  // Bi: "bismut",
  // Po: "polonium",
  // At: "astaat",
  // Rn: "radon",
  // Fr: "francium",
};

const tableByName = Object.entries(tableBySymbol).reduce<Record<string, string>>((table, [s, n]) => { table[n] = s; return table }, {});

function gameModeSerializer() {
  const stored = localStorage.getItem("GAME_MODE")
  const initial: GameMode = stored as GameMode || GameModes.symbols;

  const serialize = (mode: GameMode) => localStorage.setItem("GAME_MODE", mode);
  return { initial, serialize };
}

function gameStatSerializer() {
  const stored = localStorage.getItem("GAME_STAT");

  const initial: GameStat = stored
    ? JSON.parse(stored) as GameStat
    : {
      [GameModes.symbols]: {},
      [GameModes.names]: {}
    };

  const serialize = (state: GameStat) => localStorage.setItem("GAME_STAT", JSON.stringify(state));
  return { initial, serialize };

}

const gameModeState = gameModeSerializer();
const gameStatState = gameStatSerializer();

function updateGameStats(gs: GameStat, mode: GameMode, question: string, correct: boolean, wrong: boolean): GameStat {
  const cgs = gs[mode];
  let { numer, denom } = cgs[question] || { numer: 0, denom: 0 };

  numer += correct ? 1 : 0;
  denom += 1;

  gs = {
    ...gs,
    [mode]: {
      ...cgs,
      [question]: {
        numer,
        denom,
        wrong
      }
    }
  };

  console.log(JSON.stringify(gs, null, "\t"));

  return gs;
}

function getRandomEntries(mode: GameMode) {
  const stats = gameStatState.initial[mode];

  const table = mode === GameModes.symbols ? tableBySymbol : tableByName;

  const buckets: Record<number, Entry[]> = [];

  Object.entries(table).forEach(([answer, question]) => {
    const guess = stats[question] || { numer: 0, denom: 0, wrong: false };
    // If guessed correctly 1/1 -> 1000
    // If guessed incorrectly 0/1 -> 0, 1/2 -> 500, 2/3 -> 666, 3/4 -> 750
    // If not guessed yet -> 700
    // Last guess was wrong -> 0
    const bucket = guess.wrong
      ? 0
      : guess.denom
        ? Math.round(guess.numer * 1000 / guess.denom)
        : 700;
    const entries = buckets[bucket] = (buckets[bucket] || []);
    const random = Math.floor(Math.random() * entries.length);
    entries.splice(random, 0, { answer, question, wrong: guess.wrong, bucket });
  });

  const entries: readonly Entry[] = Object.values(buckets).concat().flat();
  console.log("entries", JSON.stringify(entries, null, "\t"));
  return entries;
}

const initialRandomEntries = {
  [GameModes.names]: getRandomEntries(GameModes.names),
  [GameModes.symbols]: getRandomEntries(GameModes.symbols),
}

function App() {

  const [randomEntries, setRandomEntries] = React.useState<ReadonlyArray<Entry | null>>([]);

  const [mode, setMode] = React.useState(gameModeState.initial);
  React.useEffect(() => gameModeState.serialize(mode), [mode]);

  React.useEffect(() => {
    setRandomEntries(initialRandomEntries[mode]);
  }, [mode]);

  const [stat, setStat] = React.useState(gameStatState.initial)
  React.useEffect(() => gameStatState.serialize(stat), [stat]);

  const normalizeInput = React.useMemo(
    () => mode === GameModes.names
      ? (a: string) => a.trim().toLowerCase()
      : (a: string) => a.trim(),
    [mode]
  );

  const onGuessNames = React.useCallback(() => {
    setMode(GameModes.names)
    setCorrect(0);
    setWrong(0);
    setCurrentIndex(0);
  }, []);

  const onGuessSymbols = React.useCallback(() => {
    setMode(GameModes.symbols)
    setCorrect(0);
    setWrong(0);
    setCurrentIndex(0);
  }, []);


  const [correct, setCorrect] = React.useState(0);
  const [wrong, setWrong] = React.useState(0);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const currentEntry: Entry | null = randomEntries[currentIndex] || null;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const correctRef = React.useRef<HTMLDivElement>(null);
  const wrongRef = React.useRef<HTMLDivElement>(null);

  const lastWrongRef = React.useRef(-1);

  const onKey = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (currentEntry && correctRef.current && wrongRef.current && inputRef.current && e.key === "Enter") {
      const guess = e.currentTarget.value;
      if (normalizeInput(guess) !== normalizeInput(currentEntry.answer)) {
        if (lastWrongRef.current !== currentIndex) {
          lastWrongRef.current = currentIndex;
          setWrong(w => w + 1);
        }

        correctRef.current.className = "";
        wrongRef.current.className = "wrong";

        setStat(gs => updateGameStats(gs, mode, currentEntry.question, false, true));
      } else {
        inputRef.current.value = "";

        const wasWrong = lastWrongRef.current === currentIndex;
        setStat(gs => updateGameStats(gs, mode, currentEntry.question, true, wasWrong));
        if (wasWrong) {
          // Make sure we ask again after 5 questions
          setRandomEntries(rs => {
            const mrs = rs.slice();
            mrs.splice(currentIndex + 5, 0, currentEntry);
            return mrs;
          });
        } else {
          setCorrect(c => c + 1);
        }

        correctRef.current.className = "correct";
        wrongRef.current.className = "";

        lastWrongRef.current = -1;

        setCurrentIndex(index => {
          const next = index + 1;
          if (next === randomEntries.length) {
            alert("Klaar!");
            return 0;
          } else {
            return next;
          }
        })
      }
    }
  }, [currentEntry, currentIndex, mode, normalizeInput, randomEntries]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const autoCapitalize = mode === GameModes.symbols ? "on" : "off";

  return (
    <div className="App">
      <div>
        <button onClick={onGuessNames} className={mode === GameModes.names ? "active" : ""}>Namen raden</button>
        &nbsp;
        <button onClick={onGuessSymbols} className={mode === GameModes.symbols ? "active" : ""}>Symbolen raden</button>
      </div>
      <br />
      <div>
        <div ref={correctRef}>
          <code>Juist:</code>
          <code>{correct}/{correct + wrong}</code>
        </div>
        <br />
        <div ref={wrongRef}>
          <code>Fout:</code>
          <code>{wrong}/{correct + wrong}</code>
        </div>
      </div>
      <br />
      <code className={currentEntry?.wrong ? "retry" : ""}>{currentEntry?.question}</code>
      &nbsp;
      <input ref={inputRef} onKeyUp={onKey} autoComplete="off" autoCorrect="off" autoCapitalize={autoCapitalize} spellCheck="false" />
      <br />
      <br />
      <img src={ballImage} alt="ball" />
    </div>
  );
}

export default App;
