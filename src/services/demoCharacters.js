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
}));
