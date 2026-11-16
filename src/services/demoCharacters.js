import demoPortrait from '../resources/img/demo-portrait.svg';

export const DEMO_CHARACTERS = [
  {
    id: 9001,
    name: 'Solar Sentinel',
    description: 'A fictional rescue pilot who shapes stored sunlight into short-lived beacons.',
  },
  {
    id: 9002,
    name: 'Tideglass',
    description: 'A fictional coastal engineer who can sense and redirect small water currents.',
  },
  {
    id: 9003,
    name: 'Mosslight',
    description: 'A fictional field researcher who creates glowing markers from plant pigments.',
  },
  {
    id: 9004,
    name: 'Echo Circuit',
    description: 'A fictional sound artist whose instruments map vibrations into visible patterns.',
  },
  {
    id: 9005,
    name: 'Cinderline',
    description: 'A fictional emergency technician who designs heat-safe tools for rescue teams.',
  },
  {
    id: 9006,
    name: 'Cloudstep',
    description: 'A fictional mountain guide who uses compact gliders and careful weather reading.',
  },
  {
    id: 9007,
    name: 'Stonewave',
    description: 'A fictional structural designer who tests portable shelters in rough terrain.',
  },
  {
    id: 9008,
    name: 'Night Relay',
    description: 'A fictional city courier who coordinates neighborhood help with a signal network.',
  },
].map((character) => ({
  ...character,
  thumbnail: demoPortrait,
  homepage: '',
  wiki: '',
  comics: [],
  biography: {
    fullName: 'Not available in demo mode',
    publisher: 'Demo',
    firstAppearance: 'Not available in demo mode',
    alignment: 'Not available in demo mode',
    placeOfBirth: 'Not available in demo mode',
    aliases: 'Not available in demo mode',
  },
  appearance: {
    gender: 'Not available in demo mode',
    race: 'Not available in demo mode',
    height: 'Not available in demo mode',
    weight: 'Not available in demo mode',
  },
  powerstats: {
    intelligence: 'Not available in demo mode',
    strength: 'Not available in demo mode',
    speed: 'Not available in demo mode',
    durability: 'Not available in demo mode',
    power: 'Not available in demo mode',
    combat: 'Not available in demo mode',
  },
  work: {
    occupation: 'Not available in demo mode',
    base: 'Not available in demo mode',
  },
}));
