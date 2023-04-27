import tinycolor from 'tinycolor2'
import { MarkdownString } from 'vscode'
import type { ColorEntry } from './types'

export function getColorMarkdown(_color: ColorEntry) {
  const [code, name] = _color
  const color = tinycolor(code)
  const cssName = color.toName()
  const colorsMarkdown = `
${cssName ? `- **Name**: \`${cssName}\`` : ''}
- **HEX**: \`${color.toHexString()}\`
- **HEX8**: \`${color.toHex8String()}\`
- **RGB**: \`${color.toRgbString()}\`
- **HSL**: \`${color.toHslString()}\`
- **HSV**: \`${color.toHsvString()}\`
- **Brightness**: \`${color.getBrightness()}\`
- **Dark or Light**: \`${color.isDark() ? 'Dark' : 'Light'}\`
- **Luminance**: \`${color.getLuminance()}\`
- **Alpha**: \`${color.getAlpha()}\`
  `
  return new MarkdownString(`### ${name}\n${colorsMarkdown}`)
}
