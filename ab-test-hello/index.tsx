/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbTestHello - Client (port of lyd-test-hello)
* @file: ab-test-hello/index.tsx
*/

'use client';

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbTestHelloProps {
  name: string;
  src?: string;
  className?: string;
}

const AbTestHello = ({ name, src, className }: AbTestHelloProps): ReactElement => {
  return (
    <div id="abTestHello" className={clsx('AbTestHello', styles.abTestHello, className)}>
      <h2 className={styles.abTestHelloTitle}>
        Hello from <span className={styles.abTestHelloName}>{name}</span>
      </h2>
      {src ? <span className={styles.abTestHelloSrc}>{src}</span> : null}
    </div>
  );
};

export default AbTestHello;
export { AbTestHello };
