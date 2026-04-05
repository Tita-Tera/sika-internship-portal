// Example component showing how to use the branding system
import { colors, customColors, fonts, customFonts, getColorClass, getCustomColor, getFontClass, getCustomFontClass } from '../lib/branding';

export default function BrandingExample() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Branding System Examples</h1>

      {/* Tailwind Classes */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Tailwind Classes</h2>
        <div className={`p-4 bg-${colors.primary[600]} text-white rounded-lg`}>
          Primary color using Tailwind class
        </div>
        <div className={`p-4 bg-${getColorClass('success', 500)} text-white rounded-lg mt-2`}>
          Success color using utility function
        </div>
      </section>

      {/* Custom Hex Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Custom Hex Colors</h2>
        <div
          className="p-4 text-white rounded-lg"
          style={{ backgroundColor: customColors.primary[600] }}
        >
          Primary color using hex code
        </div>
        <div
          className="p-4 text-white rounded-lg mt-2"
          style={{ backgroundColor: getCustomColor('accent', 400) }}
        >
          Accent color using utility function
        </div>
        <div
          className="p-4 text-white rounded-lg mt-2"
          style={{ backgroundColor: customColors.brand.gold }}
        >
          Custom brand color (Gold)
        </div>
      </section>

      {/* Fonts */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Fonts</h2>
        <p style={getFontClass('heading')} className="text-lg">
          This uses the default heading font (Syne)
        </p>
        <p style={getCustomFontClass('heading')} className="text-lg mt-2">
          This uses the custom heading font (Inter - loaded from Google Fonts)
        </p>
        <p style={getCustomFontClass('body')} className="mt-2">
          This uses the custom body font (Roboto - loaded from Google Fonts)
        </p>
      </section>

      {/* Mixed Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Mixed Usage</h2>
        <div
          className="p-6 rounded-lg shadow-lg"
          style={{
            backgroundColor: customColors.neutral[50],
            border: `2px solid ${customColors.primary[200]}`,
            ...getCustomFontClass('display')
          }}
        >
          <h3
            style={{
              color: customColors.primary[700],
              ...getCustomFontClass('heading')
            }}
          >
            Advanced Branding Example
          </h3>
          <p
            style={{
              color: customColors.neutral[600],
              ...getCustomFontClass('body')
            }}
            className="mt-2"
          >
            This demonstrates mixing custom colors and fonts for complete design control.
          </p>
        </div>
      </section>
    </div>
  );
}