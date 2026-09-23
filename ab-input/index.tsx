/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: AbInput - Client (port of lyd-input)
* @file: ab-input/index.tsx
*/

'use client';

import type {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';
import { useAbToggle } from 'ab-nextjs-hooks/helpers/useAbToggle';
import AbIconButton from '../ab-icon-button';
import AbBalloon from '../ab-balloon';
import styles from './styles.module.css';


export interface AbInputProps {
  id: string;
  type?: string;
  inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | 'none';
  wrapperClassName?: string;
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  label: string;
  isLabelRaised?: boolean;
  required?: boolean;
  capitalized?: boolean;
  autoresize?: boolean;
  autoresizeMultiplier?: number;
  name: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  placeholder?: string;
  hasError?: boolean;
  message?: string;
  value?: string;
  spellCheck?: boolean;
  autoComplete?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  hasIcon?: boolean;
  icon?: string;
  hasActionButton?: boolean;
  actionIcon?: string;
  actionLink?: string;
  isLoading?: boolean;
  indicatorHidden?: boolean;
  togglePasswordEnabled?: boolean;
  isClearable?: boolean;
  onChange?: (value?: string, event?: ChangeEvent<HTMLInputElement>) => void;
  onEnter?: (value?: string, event?: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (value?: string, event?: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (value?: string, event?: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  onPasswordToggle?: (isPasswordVisible: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  clearLabel?: string;
}

function computeType(type: string | undefined, isPasswordVisible: boolean): string {
  if (type === 'password') return isPasswordVisible ? 'text' : 'password';
  return type ?? 'text';
}

function computeAutoresizeWidth(value: string | undefined, multiplier: number): string {
  const len = Math.max((value ?? '').length, 1);
  return `${len * multiplier}px`;
}

const AbInput = forwardRef<HTMLInputElement, AbInputProps>(function AbInput(props, ref) {
  const [isPasswordVisible, toggleIsPasswordVisible] = useAbToggle(false);
  const [hasValue, toggleHasValue] = useAbToggle(false);

  const showPasswordLabel = props.showPasswordLabel ?? 'Show password';
  const hidePasswordLabel = props.hidePasswordLabel ?? 'Hide password';
  const clearLabel = props.clearLabel ?? 'Clear';

  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    toggleHasValue(Boolean(props.value && props.value.length > 0));
  }, [props.value, toggleHasValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    toggleHasValue(next.length > 0);
    props.onChange?.(next, event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const current = (event.target as HTMLInputElement).value;
    props.onKeyDown?.(current, event);
    if (event.key === 'Enter') props.onEnter?.(current, event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    props.onKeyUp?.((event.target as HTMLInputElement).value, event);
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    if (inputRef.current) {
      inputRef.current.value = '';
      toggleHasValue(false);
      props.onChange?.('', undefined);
    }
    props.onClear?.(event);
  };

  const handlePasswordToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !isPasswordVisible;
    toggleIsPasswordVisible(next);
    props.onPasswordToggle?.(Boolean(next), event);
  };

  return (
    <div
      className={clsx('AbInput', 'input-wrapper', styles.abInput, props.wrapperClassName)}
      hidden={props.hidden}
      data-has-error={props.hasError ? 'true' : 'false'}
      data-has-msg={Boolean(props.message).toString()}
      style={props.style ?? {}}
    >
      <label
        className={clsx('Label', styles.abInputLabel)}
        htmlFor={props.id}
        data-raised={(props.isLabelRaised || hasValue) ? 'true' : 'false'}
      >
        {props.label}
      </label>

      <div className={styles.row}>
        {props.hasIcon && props.icon ? (
          <AbIconButton
            icon={props.icon}
            className={clsx('Icon', styles.abInputIcon)}
            disabled={true}
            expands={false}
            shrinks={false}
          />
        ) : null}

        <input
          ref={inputRef}
          data-has-value={hasValue ? 'true' : 'false'}
          id={props.id}
          className={clsx(
            'Input',
            styles.abInputField,
            props.className,
            props.capitalized && styles.capitalize,
            props.indicatorHidden && styles.noMargin,
          )}
          style={{
            width: props.autoresize
              ? computeAutoresizeWidth(props.value, props.autoresizeMultiplier ?? 8)
              : undefined,
          }}
          type={computeType(props.type, Boolean(isPasswordVisible))}
          inputMode={props.inputMode}
          name={props.name}
          minLength={props.minLength}
          maxLength={props.maxLength}
          min={props.min}
          max={props.max}
          pattern={props.pattern?.source}
          placeholder={props.placeholder}
          value={props.value}
          spellCheck={props.spellCheck}
          autoComplete={props.autoComplete ?? 'off'}
          required={props.required}
          readOnly={props.isLoading || props.isReadOnly}
          disabled={props.isDisabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        />

        {props.isClearable && hasValue ? (
          <AbBalloon title={clearLabel}>
            <AbIconButton
              icon="cancel"
              className={clsx('ClearButton', styles.abInputClear)}
              disabled={false}
              expands={false}
              shrinks={false}
              naked={true}
              tabIndex={-1}
              hidden={props.isLoading}
              onClick={handleClear}
              title={clearLabel}
            />
          </AbBalloon>
        ) : null}

        {props.hasActionButton && props.actionIcon ? (
          <AbIconButton
            icon={props.actionIcon}
            className={clsx('ActionButton', styles.abInputAction)}
            disabled={false}
            expands={true}
            shrinks={true}
            naked={true}
            href={props.actionLink}
            onClick={props.onAction}
          />
        ) : null}

        {props.type === 'password' && props.togglePasswordEnabled ? (
          <AbBalloon title={isPasswordVisible ? hidePasswordLabel : showPasswordLabel}>
            <AbIconButton
              className={clsx('TogglePassword', 'icon-button', styles.abInputTogglePassword)}
              icon={isPasswordVisible ? 'visibility_off' : 'visibility'}
              active={Boolean(isPasswordVisible)}
              disabled={false}
              expands={true}
              shrinks={false}
              tabIndex={-1}
              onClick={handlePasswordToggle}
              title={isPasswordVisible ? hidePasswordLabel : showPasswordLabel}
            />
          </AbBalloon>
        ) : null}

        {props.isLoading ? (
          <span className={clsx('Spinner', 'spinner', 'dots-12', styles.abInputSpinner)} />
        ) : null}

        <span
          className={clsx(
            'Indicator',
            'input-indicator',
            props.hasError && 'error',
            styles.abInputIndicator,
            props.indicatorHidden && styles.hidden,
          )}
          data-no-effect={props.hasError?.toString()}
        >
          <span data-bar="" />
          <span data-val="" />
        </span>
      </div>

      {props.message ? (
        <p className={clsx(styles.abInputMessage, props.hasError && styles.abInputMessageError)}>
          {props.message}
        </p>
      ) : null}
    </div>
  );
});

export default AbInput;
export { AbInput };
