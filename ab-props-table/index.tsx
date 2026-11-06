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
* @name: AbPropsTable (unreleased docs props table)
* @file: ab-props-table/index.tsx
* @type: Server component (no hooks or browser APIs)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> <AbPropsTable caption="AbButton props" rows={buildTimeRows} />
*   2+|> <AbPropsTable rows={[{ name: 'tone', type: "'soft' | 'solid'", default: { kind: 'value', value: "'soft'" } }]} />
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚛️ React: plain elements only, so this entry stays safe in a React Server Component.
import { Fragment, type ReactElement } from 'react';
// 🧵 classes: let a docs page add layout without replacing the component's own classes.
import clsx from 'clsx';
// 🎨 styles: the table owns its width, wrapping, focus ring and scheme fallbacks.
import styles from './styles.module.css';

/** ⛔ No default was declared: visually a dash, with useful text for screen readers. */
export interface AbPropsTableDefaultNone {
  kind: 'none';
}

/** ❓ Extraction could not establish a default: never confuse this with no default. */
export interface AbPropsTableDefaultUnknown {
  kind: 'unknown';
}

/** ✅ A known default, already serialized as text by the build-time extraction step. */
export interface AbPropsTableDefaultValue {
  kind: 'value';
  value: string;
}

/** 🔀 All three extraction outcomes, with no runtime TypeScript inspection involved. */
export type AbPropsTableDefault = AbPropsTableDefaultNone | AbPropsTableDefaultUnknown | AbPropsTableDefaultValue;

/** 🔤 The four stable column ids; `columns` can reorder or omit any of them. */
export type AbPropsTableColumn = 'name' | 'type' | 'default' | 'description';

/** 🌍 Visible column headings and accessible status text can be localized at the call site. */
export interface AbPropsTableLabels {
  name: string;
  type: string;
  default: string;
  description: string;
  required: string;
  deprecated: string;
  noDefault: string;
  unknownDefault: string;
}

/** 🧾 One build-time-extracted prop. JSX/HTML-looking strings always remain ordinary text. */
export interface AbPropsTableRow {
  name: string;
  type: string;
  default?: AbPropsTableDefault; // ⛔ omitted means "no default"; use kind: 'unknown' when that is not known.
  description?: string;
  required?: boolean;
  deprecated?: boolean | string; // 🪦 true gives a generic notice; a string carries migration guidance.
}

/** ⚙️ Public component props. There is deliberately no raw HTML or runtime compiler input. */
export interface AbPropsTableProps {
  rows: readonly AbPropsTableRow[]; // 🏗️ structured data generated during documentation builds.
  caption?: string; // 🏷️ a visible table caption.
  label?: string; // ♿ names both the scroll region and the caption when `caption` is absent.
  labels?: Partial<AbPropsTableLabels>; // 🌍 partial overrides; English defaults fill the rest.
  className?: string;
  columns?: readonly AbPropsTableColumn[]; // 🧩 optional order/visibility; an empty array gets the default columns.
}

/** 🏷️ Stable English defaults, shared by every render (including SSR). */
export const AB_PROPS_TABLE_DEFAULT_LABELS: Readonly<AbPropsTableLabels> = {
  name: 'Name',
  type: 'Type',
  default: 'Default',
  description: 'Description',
  required: 'Required',
  deprecated: 'Deprecated',
  noDefault: 'No default',
  unknownDefault: 'unknown',
};

const AB_PROPS_TABLE_COLUMNS: readonly AbPropsTableColumn[] = ['name', 'type', 'default', 'description'];

/** 🪦 The required/deprecated details live with the prop name, not in an extra inaccessible column. */
function AbPropsTableNameCell({ row, labels }: { row: AbPropsTableRow; labels: AbPropsTableLabels }): ReactElement {
  return (
    <th scope="row" className={styles.abPropsTableName}>
      <code translate="no">{row.name}</code>
      {row.required && <span className={styles.abPropsTableRequired}>{labels.required}</span>}
      {row.deprecated != null && row.deprecated !== false && (
        <span className={styles.abPropsTableDeprecated} data-deprecated="true">
          {labels.deprecated}{typeof row.deprecated === 'string' ? `: ${row.deprecated}` : ''}
        </span>
      )}
    </th>
  );
}

/** 🧱 Keep React, not a string template, responsible for escaping every value. */
const AbPropsTable = ({ rows, caption, label, labels: overrides, className, columns }: AbPropsTableProps): ReactElement => {
  const labels = { ...AB_PROPS_TABLE_DEFAULT_LABELS, ...overrides }; // 🌍 only replace supplied labels.
  const visibleColumns = columns?.length ? columns : AB_PROPS_TABLE_COLUMNS; // 🛟 an empty list cannot make a headerless table.
  const accessibleLabel = label ?? caption ?? 'Component props'; // ♿ a useful region name even with no visible caption.
  const visibleCaption = caption != null; // 👀 a custom caption is visible; fallback names remain visually hidden.

  /** 📄 A cell renderer keeps column ordering in one place without eval or dynamic HTML. */
  const renderCell = (column: AbPropsTableColumn, row: AbPropsTableRow): ReactElement | null => {
    switch (column) {
      case 'name':
        return <AbPropsTableNameCell row={row} labels={labels} />;
      case 'type':
        return <td className={styles.abPropsTableCode}><code translate="no">{row.type}</code></td>;
      case 'default': {
        const value = row.default ?? { kind: 'none' as const }; // ⛔ absence is an explicit rendering decision.
        if (value.kind === 'unknown') return <td className={styles.abPropsTableUnknown}>{labels.unknownDefault}</td>;
        if (value.kind === 'value') return <td className={styles.abPropsTableCode}><code translate="no">{value.value}</code></td>;
        return <td className={styles.abPropsTableNone}><span aria-hidden="true">—</span><span className={styles.srOnly}>{labels.noDefault}</span></td>;
      }
      case 'description':
        return <td className={styles.abPropsTableDescription}>{row.description}</td>;
      default:
        return null; // 🛟 forward-compatible runtime guard; TypeScript limits calls to the four ids above.
    }
  };

  return (
    <div
      className={clsx('AbPropsTable', 'ab-prose-none', styles.abPropsTable, className)}
      data-ab-part="props-table"
      role="region"
      aria-label={accessibleLabel}
      tabIndex={0} // ⌨️ the only tab stop: focused overflow regions respond to native arrow-key scrolling.
    >
      <table className={styles.abPropsTableGrid}>
        <caption className={visibleCaption ? styles.abPropsTableCaption : styles.srOnly}>{caption ?? accessibleLabel}</caption>
        <thead>
          <tr>{visibleColumns.map((column) => <th key={column} scope="col" data-column={column}>{labels[column]}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.name}-${index}`} data-required={row.required || undefined} data-deprecated={row.deprecated ? true : undefined}>
              {visibleColumns.map((column) => <Fragment key={column}>{renderCell(column, row)}</Fragment>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 📦 Both import styles match the other package components.
export default AbPropsTable;
export { AbPropsTable };
