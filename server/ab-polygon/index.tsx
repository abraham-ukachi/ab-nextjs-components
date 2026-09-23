/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbPolygon - Server (port of lyd-polygon)
* @file: server/ab-polygon/index.tsx
*/

import type { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbPolygonProps {
  className?: string;
  hidden?: boolean;
  fill?: string;
  opacity?: number;
}

const AbPolygon = ({
  className,
  hidden = false,
  fill = '#778D79',
  opacity = 0.36,
}: AbPolygonProps): ReactElement => {
  return (
    <div hidden={hidden} className={clsx('AbPolygon', styles.abPolygon, className)} aria-hidden>
      <svg width="761" height="603" viewBox="0 0 761 603" fill="none" role="presentation">
        <path
          opacity={opacity}
          d="M647.5 -242.933C708.264 -265.049 770.182 -213.093 758.954 -149.412L638.552 533.421C627.323 597.102 551.369 624.747 501.834 583.183L-29.316 137.495C-78.8509 95.9301 -64.8151 16.3291 -4.05151 -5.78704L647.5 -242.933Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default AbPolygon;
export { AbPolygon };

