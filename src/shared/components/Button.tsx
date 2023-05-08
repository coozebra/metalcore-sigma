import styled, { css } from 'styled-components';
import {
  ButtonHTMLAttributes,
  forwardRef,
  ForwardRefExoticComponent,
  MouseEvent,
  ReactNode,
  Ref,
  RefAttributes,
} from 'react';

interface IButtonStatic {
  Button;
  Diagonal;
}

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  ghost?: boolean;
  primary?: boolean;
  secondary?: boolean;
  value?: string;
  slanted?: boolean;
}

type ButtonComponent = ForwardRefExoticComponent<IButtonProps & RefAttributes<HTMLButtonElement>> &
  IButtonStatic;

export const Button = forwardRef(
  (
    { children, onClick, value, type, slanted, ...rest }: IButtonProps,
    ref?: Ref<HTMLButtonElement>,
  ) => {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(event);
      }
    };

    if (slanted) {
      return (
        <Button.Diagonal {...rest}>
          <Button.Button
            onClick={handleClick}
            ref={ref}
            type={type || 'button'}
            value={value}
            $slanted={slanted}
            {...rest}
          >
            {children}
          </Button.Button>
        </Button.Diagonal>
      );
    }

    return (
      <Button.Button
        onClick={handleClick}
        ref={ref}
        type={type || 'button'}
        value={value}
        {...rest}
      >
        {children}
      </Button.Button>
    );
  },
) as ButtonComponent;

Button.displayName = 'Button';

Button.Button = styled.button<{
  disabled?: boolean;
  ghost?: boolean;
  primary?: boolean;
  secondary?: boolean;
  $slanted?: boolean;
}>`
  cursor: pointer;
  height: 46px;
  padding: 13px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  text-transform: uppercase;
  user-select: none;
  outline: none;
  font-family: 'syncopate';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: none;

  ${({ disabled, theme }) =>
    disabled &&
    css`
      background: ${theme.colors.darkGray};
      color: ${theme.colors.gray};
      cursor: not-allowed !important;
    `}

  ${({ primary, theme }) =>
    primary &&
    css`
      background: ${theme.colors.green};
      color: ${theme.colors.black};
    `}

  ${({ secondary, theme }) =>
    secondary &&
    css`
      background: ${theme.colors.darkGray};
      color: ${theme.colors.white};
    `}

  ${({ ghost, $slanted, theme }) =>
    ghost &&
    !$slanted &&
    css`
      border: 1px solid ${theme.colors.green};
      background: transparent;
      color: ${theme.colors.green};
    `}

  ${({ $slanted }) =>
    $slanted &&
    css`
      transform: skewX(-30deg);
      background: transparent;
    `}
`;

Button.Diagonal = styled.div<{
  disabled?: boolean;
  ghost?: boolean;
  primary?: boolean;
  secondary?: boolean;
}>`
  transform: skewX(30deg);

  ${({ primary, theme }) =>
    primary &&
    css`
      background: ${theme.colors.green};
      color: ${theme.colors.black};
    `}

  ${({ ghost, theme }) =>
    ghost &&
    css`
      border: 3px solid ${theme.colors.green};
      background: transparent;
      color: ${theme.colors.green};
    `}

  ${({ disabled, theme }) =>
    disabled &&
    css`
      background: ${theme.colors.darkGray};
      color: ${theme.colors.gray};
    `}
`;
