# Dokumentation: Formularvalidering med React & Zod

Denne opgave demonstrerer implementeringen af en moderne registreringsformular med fokus på typesikkerhed, live-validering og kompleks logik.

## Overordnet Teori

### 1. React State Management
Projektet benytter Reacts `useState` hook til at håndtere formulardata som et samlet objekt. Dette gør det nemt at tracke ændringer in-realtime:
* **Single Source of Truth:** Alle inputfelter læser fra og skriver til den samme state.
* **Live Feedback:** Ved at validere i `onChange`-handleren får brugeren øjeblikkelig feedback, hvilket forbedrer UX (User Experience).

### 2. Schema-baseret Validering med Zod
I stedet for at skrive manuelle `if/else` erklæringer for hvert felt, bruger vi **Zod**. Zod er et "TypeScript-first" schema-deklarationsbibliotek. Men bruger det med JavaScript i dette tilfælde, men betyder bare at du kan bruge det på mange måder.

**Fordele ved Zod i dette projekt:**
* **Deklarativ kode:** Vi definerer *reglerne* (schemaet) ét sted, uafhængigt af selve UI-komponenten.
* **Avanceret logik:** Zod håndterer komplekse mønstre som Regex (til passwords) og betinget validering.
* **Parsing:** Vi bruger `.safeParse()`, som returnerer et struktureret objekt med enten data eller formaterede fejlbeskeder.

### 3. Valideringslogik
Formularen implementerer flere niveauer af kontrol:

* **Primitiv validering:** Tjek af streng-længde og e-mail format via indbyggede Zod-metoder.
* **Regex (Regular Expressions):** Anvendes til password-styrke (store bogstaver, tal, specialtegn) samt dansk telefonnummer-format (8 cifre).
* **Refinements (.refine):** Bruges til logik, der afhænger af flere felter eller eksterne beregninger:
    * *Password match:* Sammenligning af `password` og `gentagPassword`.
    * *Alderscheck:* En beregning baseret på den nuværende dato (`new Date()`) mod den indtastede fødselsdato for at sikre, at brugeren er +18 år.

### 4. UI/UX Strategi
For at holde koden SOC (Seperation of concern) er formularen opdelt:
* **Hjælpekomponenter:** En `Field`-komponent genbruges til alle inputfelter for at sikre ensartet styling og fejlhåndtering.
* **Betinget Rendering:** Når valideringen er succesfuld, skifter interfacet til en "Success"-side, der viser de opsamlede data (eksklusiv følsomme oplysninger som passwords).

---

## Teknologier
- **React (Vite):** Frontend framework.
- **Zod:** Schema validering.
- **JavaScript (JSX):** Programmeringssprog.

---

## Teknisk Fordybelse

### Valideringsstrategi: safeParse
Vi har valgt at benytte `.safeParse` frem for den almindelige `.parse`. Dette er gjort for at opnå en "non-throwing" validerings-flow. Da React-komponenter gen-rendrer ofte, sikrer `safeParse`, at vi kan håndtere valideringsfejl som almindelig data-state frem for runtime-exceptions.

### Kompleks Logik med Refinement
For at overholde kravet om aldersvalidering og password-matching, benyttes `.refine()`. Dette tillader os at injicere custom JavaScript-logik i valideringskæden, hvilket gør det muligt at validere på tværs af flere felter (cross-field validation) – en opgave der typisk er svær i standard HTML5 validering.