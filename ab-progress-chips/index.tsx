/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbProgressChips - Client (port of lyd-progress-chips)
* @file: ab-progress-chips/index.tsx
*/

'use client';

import type { CSSProperties, ReactElement } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface AbProgressChip {
  id: number;
  code: string;
  name: string;
  duration: number;
}

export interface AbProgressChipsProps {
  className?: string;
  hidden?: boolean;
  chips?: AbProgressChip[];
  selectedChipId?: number;
  selectedChipCode?: string;
  selectedChipName?: string;
  onChipClick?: (chipId: number, chipCode?: string, chipName?: string, chipDuration?: number) => void;
  isChipNameHidden?: boolean;
  /** When set, fills the selected chip bar to this ratio (0–1). No internal timer. */
  progressRatio?: number;
}

const DEFAULT_CHIPS: AbProgressChip[] = [
  { id: 1, code: 'A', name: 'Prep', duration: 20 },
  { id: 2, code: 'B', name: 'Cook', duration: 40 },
  { id: 3, code: 'C', name: 'Plate', duration: 15 },
];

const AbProgressChips = ({
  className,
  hidden = false,
  chips = DEFAULT_CHIPS,
  selectedChipId,
  selectedChipCode,
  selectedChipName,
  onChipClick,
  isChipNameHidden = false,
  progressRatio = 0,
}: AbProgressChipsProps): ReactElement => {
  const [uncontrolledId, setUncontrolledId] = useState<number | undefined>(selectedChipId);

  const fromCodeOrName = chips.find(
    (c) =>
      (selectedChipCode != null && c.code === selectedChipCode) ||
      (selectedChipName != null && c.name === selectedChipName),
  );

  const selectedId =
    selectedChipId ?? fromCodeOrName?.id ?? uncontrolledId ?? chips[0]?.id;

  const total = chips.reduce((sum, c) => sum + (c.duration || 0), 0) || 1;
  const ratio = Math.max(0, Math.min(1, progressRatio));

  return (
    <div hidden={hidden} className={clsx('AbProgressChips', styles.abProgressChips, className)} role="list">
      {chips.map((chip) => {
        const selected = chip.id === selectedId;
        const fallback = Math.min(1, chip.duration / total);
        const style = {
          '--chip-progress': `${(selected ? ratio || fallback : 0) * 100}%`,
        } as CSSProperties;
        return (
          <button
            key={chip.id}
            type="button"
            role="listitem"
            className={styles.abProgressChip}
            data-selected={selected ? 'true' : 'false'}
            style={style}
            onClick={() => {
              if (selectedChipId == null && selectedChipCode == null && selectedChipName == null) {
                setUncontrolledId(chip.id);
              }
              onChipClick?.(chip.id, chip.code, chip.name, chip.duration);
            }}
          >
            <span className={styles.abProgressChipBar} aria-hidden />
            <span className={styles.abProgressChipCode}>{chip.code}</span>
            {!isChipNameHidden ? <span className={styles.abProgressChipName}>{chip.name}</span> : null}
          </button>
        );
      })}
    </div>
  );
};

export default AbProgressChips;
export { AbProgressChips };
