/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-components
* @name: AbPreviewCode (G16, 0.6.0)
* @file: ab-preview-code/index.tsx
* @type: Server component (AbContentTabs + the copy button are the only client islands)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage (MDX):
*   1+|> <AbPreviewCode label="Button" code={`<AbButton label="Save" />`}>
*    -|>   <AbButton label="Save" />
*    -|> </AbPreviewCode>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React
import type { ReactElement, ReactNode } from 'react';
// 🧵 classes
import clsx from 'clsx';
// 🗂️ WAI-ARIA tabs (client island)
import AbContentTabs, { AbContentTab } from '../ab-content-tabs';
// 🧪 the preview scope
import AbDemoBox, { type AbDemoBoxScheme } from '../ab-demo-box';
// 💻 the source half
import AbDemoCode from '../ab-demo-code';
// 🎨 styles
import styles from './styles.module.css';

/** 🌍 translatable strings */
export interface AbPreviewCodeLabels {
  preview?: string; // 🧪 the Preview tab (default "Preview")
  code?: string; // 💻 the Code tab (default "Code")
  copy?: string; // 📋 the copy button (default "Copy code")
  copied?: string; // ✅ announced after a copy (default "Copied")
}

/** ⚙️ props */
export interface AbPreviewCodeProps {
  children: ReactNode; // 🧪 the live preview: real JSX with package components (D-c: no eval, no live editor)
  code: string; // 📋 the matching source: shown plain when there is no `html` / `highlighted`, always what Copy copies
  html?: string; // 🧾 Shiki `codeToHtml(code)` output (trusted, YOU render it)
  highlighted?: ReactNode; // 🖍️ OR an already highlighted <pre> (e.g. an MDX fenced block)
  language?: string; // 🔤 default 'tsx'
  filename?: string; // 📄 shown in the code header
  label?: string; // ♿ names the tablist, e.g. "Button example" (default "Example")
  labels?: AbPreviewCodeLabels; // 🌍
  defaultTab?: 'preview' | 'code'; // 🎯 default 'preview'
  scheme?: AbDemoBoxScheme; // 🌗 force the preview's scheme (default: follow the page)
  align?: 'center' | 'start' | 'stretch'; // 📐 the preview's alignment (default 'center')
  className?: string; // 🏷️
}

/**
 * 🧪💻 AbPreviewCode — the docs Preview / Code pair (G16): AbContentTabs over an AbDemoBox preview scope and an
 * AbDemoCode source block. Both panels are in the server HTML (the inactive one `hidden`), so the preview's
 * markup and the code are crawlable and work before hydration. The preview is the children you pass, rendered
 * as-is: nothing is parsed or evaluated from `code`, so keep the two in sync (a test can compare them).
 */
const AbPreviewCode = ({ children, code, html, highlighted, language = 'tsx', filename, label = 'Example', labels = {}, defaultTab = 'preview', scheme, align, className }: AbPreviewCodeProps): ReactElement => {
  const L = { preview: 'Preview', code: 'Code', copy: 'Copy code', copied: 'Copied', ...labels }; // 🌍
  return (
    <div className={clsx('AbPreviewCode', styles.abPreviewCode, className)} data-ab-part="preview-code">
      <AbContentTabs label={label} defaultValue={defaultTab}>
        <AbContentTab label={L.preview} value="preview">
          {/* 🧪 the tabpanel already names it (aria-labelledby the tab), so the box needs no region role */}
          <AbDemoBox scheme={scheme} align={align} className={styles.abPreviewCodeBox}>{children}</AbDemoBox>
        </AbContentTab>
        <AbContentTab label={L.code} value="code">
          <AbDemoCode code={code} html={html} language={language} filename={filename} copyLabel={L.copy} copiedLabel={L.copied}>{highlighted}</AbDemoCode>
        </AbContentTab>
      </AbContentTabs>
    </div>
  );
};

// 📦 exports
export default AbPreviewCode;
export { AbPreviewCode };
