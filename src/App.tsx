import React from 'react';
import logo from './logo.svg';
import './App.css';

const tableBySymbol = {
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
} as const;

const tableByName = Object.entries(tableBySymbol).reduce<Record<string, string>>((table, [s,n]) => {table[n] = s;return table}, {});

function App() {

  const randomEntries = React.useMemo(() => {
    // TODO: Sort by mistakes first.
    const entries = Object.entries(tableBySymbol);
    for (let i=0; i<entries.length; ++i) {
      const j = Math.floor(Math.random() * entries.length);
      const t = entries[i];
      entries[i] = entries[j];
      entries[j] = t;
    }
    return entries;
  }, []);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [currentSymbol, currentName] = randomEntries[currentIndex];

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onKey = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current && e.key === "Enter") {
      const guess = e.currentTarget.value;
      inputRef.current.value = "";
      if (guess !== currentSymbol) {
        alert("Fout!");
      } else {
        setCurrentIndex(index => {
          const next = index + 1;
          if (next ===randomEntries.length) {
            alert("Klaar!");
            return index;
          } else {
            return next;
          }
        })
      }
    }
  }, [currentSymbol, randomEntries.length]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);
  return (
    <div className="App">
      <code>{currentName}</code>
      &nbsp;
      <input ref={inputRef} onKeyUp={onKey} />
    </div>
  );
}

export default App;
