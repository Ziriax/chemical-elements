import React from 'react';
import './App.css';
import ballImage from "./ball.jpg";

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

function App() {

  const [table, setTable] = React.useState(tableByName);

  const storageKey = table === tableByName ? "wrong-names" : "wrong-symbols"

  const autoCapitalize = table === tableByName ? "false" : "true";

  const normalizeInput = React.useMemo(() => table === tableByName
    ? (a: string) => a.trim().toLowerCase()
    : (a: string) => a.trim(), [table]);

  const onGuessNames = React.useCallback(() => {
    setTable(tableByName);
    setCorrect(0);
    setWrong(0);
    setCurrentIndex(0);
  }, []);

  const onGuessSymbols = React.useCallback(() => {
    setTable(tableBySymbol);
    setCorrect(0);
    setWrong(0);
    setCurrentIndex(0);
  }, []);

  const [reset, setReset] = React.useState(0);

  const [randomEntries, previousWrongCount] = React.useMemo(() => {
    // Remove previous wrong guesses.
    const wrongKeys: Record<string, boolean> = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const entries = Object.entries(table).filter(([key]) => !wrongKeys[key]);

    for (let i = 0; i < entries.length; ++i) {
      const j = Math.floor(Math.random() * entries.length);
      const t = entries[i];
      entries[i] = entries[j];
      entries[j] = t;
    }

    const wrongList = Object.keys(wrongKeys);
    // Insert wrong symbols first
    wrongList.forEach(key => {
      entries.unshift([key, table[key]]);
    });

    return [entries, wrongList.length + 0 * reset];
  }, [reset, storageKey, table]);

  const [correct, setCorrect] = React.useState(0);
  const [wrong, setWrong] = React.useState(0);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [currentAnswer, currentQuestion] = randomEntries[currentIndex];

  const inputRef = React.useRef<HTMLInputElement>(null);
  const correctRef = React.useRef<HTMLDivElement>(null);
  const wrongRef = React.useRef<HTMLDivElement>(null);

  const lastWrongRef = React.useRef(-1);

  const onKey = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (correctRef.current && wrongRef.current && inputRef.current && e.key === "Enter") {
      const guess = e.currentTarget.value;
      if (normalizeInput(guess) !== normalizeInput(currentAnswer)) {
        if (lastWrongRef.current !== currentIndex) {
          lastWrongRef.current = currentIndex;
          setWrong(w => w + 1);
        }

        correctRef.current.className = "";
        wrongRef.current.className = "wrong";

        const wrongItems: Record<string, boolean> = JSON.parse(localStorage.getItem(storageKey) || "{}");
        wrongItems[currentAnswer] = true;
        localStorage.setItem(storageKey, JSON.stringify(wrongItems));
      } else {
        inputRef.current.value = "";

        if (lastWrongRef.current !== currentIndex) {
          const wrongItems: Record<string, boolean> = JSON.parse(localStorage.getItem(storageKey) || "{}");
          delete wrongItems[currentAnswer];
          localStorage.setItem(storageKey, JSON.stringify(wrongItems));

          setCorrect(c => c + 1);
        }

        correctRef.current.className = "correct";
        wrongRef.current.className = "";

        lastWrongRef.current = -1;

        setCurrentIndex(index => {
          const next = index + 1;
          if (next === randomEntries.length) {
            alert("Klaar!");
            setReset(r => r + 1);
            return 0;
          } else {
            return next;
          }
        })
      }
    }
  }, [normalizeInput, currentAnswer, currentIndex, storageKey, randomEntries.length]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);
  return (
    <div className="App">
      <div>
        <button onClick={onGuessNames}>Namen raden</button>
        &nbsp;
        <button onClick={onGuessSymbols}>Symbolen raden</button>
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
      <code className={currentIndex < previousWrongCount ? "retry" : ""}>{currentQuestion}</code>
      &nbsp;
      <input ref={inputRef} onKeyUp={onKey}  autoComplete="off" autoCorrect="off" autoCapitalize={autoCapitalize} spellCheck="false" />
      <br />
      <br />
      <img src={ballImage} alt="ball" />
    </div>
  );
}

export default App;
