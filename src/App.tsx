import React from 'react';
import './App.css';
import ballImage from "./ball.jpg";

const GameModes = {
  defs: "defs" as const,
};

type DefsMode = typeof GameModes.defs;
type GameMode = DefsMode;

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

const questions: Record<string, string> = {
  "Adel": "Een erfelijke groep of stand binnen een standenmaatschappij waarvan de leden privileges hebben.",
  "Ambachtsman":"Een persoon die een gespecialiseerde vorm van handwerk (een ambacht) uitoefent.",
  "Ambtenaar":"Een medewerker die vergoed wordt om de overheid bij te staan in het bestuur.",
  // "Bekeren":"Van geloof laten veranderen.",
  "Beroepsvereniging":"Een vereniging van mensen met hetzelfde beroep, in de middeleeuwen ook wel 'gilde' genoemd.",
  "Burgerij":"Een bevolkingsgroep, meestal in steden, die rijk is geworden door handel en de stad besturen. Ook wel patriciërs genoemd.",
  "Centraliseren":"Het samenbrengen van de macht in één machtscentrum.",
  // "Christendom":"Een monotheïstische godsdienst gebaseerd op de leer van Jezus Christus.",
  "Decentraliseren":"Verdeling van de macht over verschillende machtscentra.",
  "Derde stand":"Een erfelijke groep of stand in een standenmaatschappij waartoe alle mensen behoren die geen deel uitmaken van de adel of de geestelijkheid.",
  // "Dynastie":"Een familie die gedurende meerdere generaties aan de macht is.",
  // "Erfelijk koningschap":"Een bestuursvorm waarin het koningschap erfelijk is.",
  // "Feit":"Een gebeurtenis waarvan de werkelijkheid vaststaat",
  // "Feodaliteit":"Een maatschappelijk systeem waarin een leenman trouw zweert aan een leenheer in ruil voor een leen.",
  // "Geestelijke macht":"Godsdienstige macht, de tegenhanger van wereldlijke macht",
  "Geestelijkheid":"Een gepriviligeerde groep of stand in een standenmaatschappij waartoe alle mensen behoren die een godsdienstige rol vervullen.",
  "Gemeen":"Al wie in een middeleeuwse stad niet behoort tot de burgerij en dus minder rechten heeft.",
  // "Geschreven wetten":"Neergeschreven rechtsregels",
  "Gesloten economie":"syn. autarkie. Een zelfvoorzienende economie waarbij een bepaald gebied weinig of geen handel voert met andere gebieden.",
  // "Gewoonterecht":"Een recht dat gebaseerd is op gewoonten die van generatie op generatie zijn doorgegeven.",
  "Horige":"Boeren en hun gezin die horen bij de grond van de heer en daardoor verplichtingen hebben tegenover hem.",
  "Huwelijkspolitiek":"Een politieke strategie waarin huwelijken worden gebruikt om de macht van een familie te behouden of uit te breiden.",
  // "Imperialisme":"Een manier van denken of handelen waar men streeft naar een zo groot mogelijk rijk",
  // "Islam":"Een monotheïstische godsdienst gebaseerd op de leer van Mohammed.",
  // "Jihad":"Letterlijk een godsdienstige inspanning in de islam. Soms vernauwt men het begrip tot een gewapende strijd voor het geloof.",
  // "Keizerrijk":"Een bestuursvorm met een keizer aan het hoofd.",
  // "Koran":"Het heilige boek van de moslims",
  "Landbouwsamenleving":"Een samenleving waarin de meerderheid van de bevolking leeft van de landbouw.",
  "Lijfeigene":"Een middeleeuwse vorm van slavernij.",
  // "Mening":"De manier waarop iemand over een gebeurtenis denkt",
  // "Monarchie":"Een bestuursvorm waarin een vorst aan het hoofd staat.",
  // "Monotheïsme":"Het geloven in één god.",
  "Oligarchie":"Een bestuursvorm waarin een kleine groep de macht uitoefent.Die groep is van belangrijke afkomst en/of heeft grote rijkdom.",
  "Open economie":"Een economie waar aan handel wordt gedaan.",
  // "paus":"De religieuze leider van de katholieke christenen.",
  "Privilege":"Een voorrecht: een recht dat niet iedereen krijgt.",
  // "Profeet":"Een persoon die aanzien wordt als de boodschapper van een god.",
  // "Sharia":"Op de islam gebaseerde wetgeving",
  "Stand":"Een groep in de samenleving waarvan de leden bepaalde rechten hebben op basis van hun afkomst.",
  "standenmaatschappij":"Een samenleving waarin je rechten worden bepaald door je afkomst.",
  "Verstedelijking":"Het proces waarbij steeds meer mensen in steeds grotere steden wonen en niet langer op het platteland.",
  // "Volksverhuizing":"Volken die naar een ander woongebied trekken.",
  // "Vorstendom":"Een afgebakend gebied met een vorst aan het hoofd.",
  // "Wereldlijke macht":"Niet-godsdienstige macht, de tegenhanger van geestelijke macht"
};

// const tableByName = Object.entries(questions).reduce<Record<string, string>>((table, [s, n]) => { table[n] = s; return table }, {});

const storagePrefix = "14_06_2022"

function gameModeSerializer() {
  const storageKey = `${storagePrefix}_GAME_MODE`;
  const stored = localStorage.getItem(storageKey)
  const initial: GameMode = stored as GameMode || GameModes.defs;

  const serialize = (mode: GameMode) => localStorage.setItem(storageKey, mode);
  return { initial, serialize };
}

function gameStatSerializer() {
  const storageKey = `${storagePrefix}_GAME_STAT`;
  const stored = localStorage.getItem(storageKey);

  const initial: GameStat = stored
    ? JSON.parse(stored) as GameStat
    : {
      [GameModes.defs]: {},
    };

  const serialize = (state: GameStat) => localStorage.setItem(storageKey, JSON.stringify(state));
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

  const table = questions; // mode === GameModes.defs ? questions : tableByName;

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
  [GameModes.defs]: getRandomEntries(GameModes.defs),
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
    () => (a: string) => a.trim().toLowerCase(),
    []
  );

  // const onGuessNames = React.useCallback(() => {
  //   setMode(GameModes.names)
  //   setCorrect(0);
  //   setWrong(0);
  //   setCurrentIndex(0);
  // }, []);

  // const onGuessSymbols = React.useCallback(() => {
  //   setMode(GameModes.defs)
  //   setCorrect(0);
  //   setWrong(0);
  //   setCurrentIndex(0);
  // }, []);


  const [correct, setCorrect] = React.useState(0);
  const [wrong, setWrong] = React.useState(0);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const currentEntry: Entry | null = randomEntries[currentIndex] || null;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const correctRef = React.useRef<HTMLElement>(null);
  const wrongRef = React.useRef<HTMLElement>(null);

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

  const autoCapitalize = mode === GameModes.defs ? "on" : "off";

  return (
    <div className="App">
      {/* <div>
        <button onClick={onGuessNames} className={mode === GameModes.names ? "active" : ""}>Namen raden</button>
        &nbsp;
        <button onClick={onGuessSymbols} className={mode === GameModes.defs ? "active" : ""}>Symbolen raden</button>
      </div>
      <br /> */}
      <div>
        <span ref={correctRef}>
          <code>Juist:</code>
          <code>{correct}/{correct + wrong}</code>
        </span>
        &nbsp;
        &nbsp;
        &nbsp;
        <span ref={wrongRef}>
          <code>Fout:</code>
          <code>{wrong}/{correct + wrong}</code>
        </span>
      </div>
      <br />
      <input ref={inputRef} onKeyUp={onKey} autoComplete="off" autoCorrect="off" autoCapitalize={autoCapitalize} spellCheck="false" />
      <br />
      <br />
      <em className={currentEntry?.wrong ? "retry" : ""}>{currentEntry?.question}</em>
      <br />
      <br />
      <img src={ballImage} alt="ball" />
    </div>
  );
}

export default App;
