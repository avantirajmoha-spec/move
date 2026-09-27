/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#11253D',
    tint: '#F45B4C',
    background: '#FFF9F3',
    foreground: '#11253D',
    card: '#FFFFFF',
    cardForeground: '#11253D',
    primary: '#F45B4C',
    primaryForeground: '#FFFFFF',
    secondary: '#EAF7F0',
    secondaryForeground: '#1B5B4A',
    muted: '#F4EDE5',
    mutedForeground: '#6B7280',
    accent: '#FFC857',
    accentForeground: '#11253D',
    destructive: '#D94A4A',
    destructiveForeground: '#FFFFFF',
    border: '#E8DDD1',
    input: '#E8DDD1',
    navy: '#11253D',
    mint: '#CBEEDB',
    mintDeep: '#2E8B70',
    lavender: '#E9E6FF',
    sky: '#DDF0FF',
    inkSoft: '#405069',
  },
  dark: {
    text: '#FFF9F3',
    tint: '#FF7668',
    background: '#101C2C',
    foreground: '#FFF9F3',
    card: '#17263A',
    cardForeground: '#FFF9F3',
    primary: '#FF7668',
    primaryForeground: '#101C2C',
    secondary: '#1E3B37',
    secondaryForeground: '#CBEEDB',
    muted: '#22344A',
    mutedForeground: '#A7B3C3',
    accent: '#FFC857',
    accentForeground: '#101C2C',
    destructive: '#FF7668',
    destructiveForeground: '#101C2C',
    border: '#2C4058',
    input: '#2C4058',
    navy: '#101C2C',
    mint: '#1D5649',
    mintDeep: '#8BD9BA',
    lavender: '#363452',
    sky: '#204967',
    inkSoft: '#C7D1DE',
  },
  radius: 18,
};

export default colors;
