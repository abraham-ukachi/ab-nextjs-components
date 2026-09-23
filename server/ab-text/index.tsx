/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbText - Server (port of lyd-text; i18n stripped)
* @file: server/ab-text/index.tsx
*/

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbTextProps {
  className?: string;
  id?: string;
  value?: string;
  origin?: string;
}

const AbText = ({ className, id, value }: AbTextProps): ReactElement => {
  return (
    <span id={id} className={clsx('AbText', styles.abText, className)}>
      {value ?? id ?? ''}
    </span>
  );
};

export default AbText;
export { AbText };
