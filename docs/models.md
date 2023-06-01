# Models

## User

```typescript
type UUID = string;
type Email = string;

interface User {
    id: UUID;
    name: string;
    email: Email;
    gamesPlayed: UUID[];
    wordsUsed: string[];
}
```

```javascript
{
    id: "38BBE0BB-0B2F-4139-8E42-8801BCB9F63A",
    name: "Jannatin Naim",
    email: "soup@jannatinnaim.com",
    gamesPlayed: [
        "9EBC630C-CD20-4F5A-A335-057E95189834",
        "DEABF427-BB8C-4B8C-9095-66AA283D4399",
        "C6AD1FE6-F314-4DDF-94F1-71B5AB278AD7"
    ],
    wordsUsed: [
        "soup",
        "good"
    ]
}
```

## Game

```typescript
type UUID = string;

interface Game {
    id: UUID;
    players: UUID[];
    words: string[];
}
```

```javascript
{
    id: "9EBC630C-CD20-4F5A-A335-057E95189834",
    players: [
        "38BBE0BB-0B2F-4139-8E42-8801BCB9F63A",
        "C6AD1FE6-F314-4DDF-94F1-71B5AB278AD7"
    ],
    words: [
        "soup",
        "plus",
        "something",
        "good"
    ]
}
```

## Word

```typescript
type UUID = string;
type PartsOfSpeech =
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "pronoun"
    | "preposition"
    | "conjunction"
    | "interjection";

interface Word {
    value: string;
    definition: Record<PartsOfSpeech, string>;
    usedByPlayers: UUID[];
    usedInGames: UUID[];
}
```

```javascript
{
    value: "soup",
    definition: {
        noun: "a liquid food made by boiling or simmering meat, fish, or vegetables with various added ingredients.",
        verb: "increase the power and efficiency of an engine or other machine."
    },
    usedByPlayers: [
        "38BBE0BB-0B2F-4139-8E42-8801BCB9F63A",
    ],
    usedInGames: [
        "9EBC630C-CD20-4F5A-A335-057E95189834",
        "C6AD1FE6-F314-4DDF-94F1-71B5AB278AD7"
    ]
}
```
