import * as React from 'react';
import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { smallGroupBorderRadius } from '#src/components/themes/borderRadius';

const IconSizeL = 24;
const IconSizeM = 20;
const IconSizeS = 16;
const HighlighterOffsetBig = 6;
const HighlighterOffsetSmall = 4;

export type IconPlacementDimension = 'lBig' | 'lSmall' | 'mBig' | 'mSmall' | 's';

function getIconSize(dimension?: IconPlacementDimension) {
  switch (dimension) {
    case 'lSmall':
    case 'lBig':
      return IconSizeL;
    case 'mSmall':
    case 'mBig':
      return IconSizeM;
    case 's':
      return IconSizeS;
    default:
      return IconSizeL;
  }
}

function getHighlighterOffset(dimension?: IconPlacementDimension) {
  switch (dimension) {
    case 'lBig':
    case 'mBig':
      return HighlighterOffsetBig;
    case 'lSmall':
    case 'mSmall':
    case 's':
      return HighlighterOffsetSmall;
    default:
      return HighlighterOffsetBig;
  }
}

function getHighlighterSize(dimension?: IconPlacementDimension) {
  return getIconSize(dimension) + getHighlighterOffset(dimension) * 2;
}

export interface IconPlacementProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Размер кнопки */
  dimension?: IconPlacementDimension;
  /** Отключение кнопки */
  disabled?: boolean;
}

const StyledButton = styled.button<{ dimension?: IconPlacementDimension }>`
  position: relative;
  padding: 0;
  margin: ${(p) => getHighlighterOffset(p.dimension)}px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  appearance: none;
  height: ${(p) => getIconSize(p.dimension)}px;
  width: ${(p) => getIconSize(p.dimension)}px;
  border-radius: ${(p) => smallGroupBorderRadius(p.theme.shape)};
  overflow: visible;

  cursor: pointer;

  &:disabled {
    cursor: default;
    pointer-events: none;
    & *[fill^='#'] {
      fill: ${({ theme }) => theme.color['Neutral/Neutral 30']};
    }
  }

  &:focus-visible {
    outline-offset: 2px;
    outline: ${(p) => p.theme.color['Primary/Primary 60 Main']} solid 2px;
  }
`;

const IconPlacementContent = styled.div<{ dimension?: IconPlacementDimension }>`
  height: 100%;

  & *[fill^='#'] {
    fill: ${(p) => p.theme.color['Neutral/Neutral 50']};
  }

  & > svg {
    height: ${(p) => getIconSize(p.dimension)}px;
    width: ${(p) => getIconSize(p.dimension)}px;
  }
`;

const ActivityHighlighter = styled.div<{ dimension?: IconPlacementDimension }>`
  width: ${(p) => getHighlighterSize(p.dimension)}px;
  height: ${(p) => getHighlighterSize(p.dimension)}px;
  border-radius: 50%;
  background-color: transparent;
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ButtonStyledWithPseudoClasses = styled(StyledButton)`
  &:focus {
    > ${ActivityHighlighter} {
      background-color: ${({ theme }) => theme.color['Opacity/Focus']};
    }
  }
  &:hover {
    > ${ActivityHighlighter} {
      background-color: ${({ theme }) => theme.color['Opacity/Hover']};
    }
  }
  &:active {
    > ${ActivityHighlighter} {
      background-color: ${({ theme }) => theme.color['Opacity/Press']};
    }
  }
  &:focus-visible {
    > ${ActivityHighlighter} {
      //display: none;
      //background-color: transparent;
    }
  }
`;

export const IconPlacement = React.forwardRef<HTMLButtonElement, IconPlacementProps>(
  ({ type = 'button', dimension = 'lBig', disabled = false, children, ...props }, ref) => {
    return (
      <ButtonStyledWithPseudoClasses ref={ref} type={type} dimension={dimension} disabled={disabled} {...props}>
        <ActivityHighlighter dimension={dimension} />
        <IconPlacementContent dimension={dimension}>{children}</IconPlacementContent>
      </ButtonStyledWithPseudoClasses>
    );
  },
);
