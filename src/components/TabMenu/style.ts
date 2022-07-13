import styled from 'styled-components';

import { typography } from '#src/components/Typography';
import { OverflowMenu } from '#src/components/OverflowMenu';

import type { Dimension } from '#src/components/TabMenu/constants';
import {
  BADGE_MARGIN,
  ICON_MARGIN,
  ICON_SIZE_L,
  ICON_SIZE_M,
  LINE_HEIGHT,
  TAB_HEIGHT_L,
  TAB_HEIGHT_M,
  TAB_PADDING_L,
  TAB_PADDING_M,
} from '#src/components/TabMenu/constants';

export const Wrapper = styled.div<{ underline?: boolean; mobile?: boolean; dimension?: Dimension }>`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: ${({ mobile }) => (mobile ? 'nowrap' : 'wrap')};
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  box-shadow: inset 0 -${LINE_HEIGHT} 0 0 ${({ theme, underline }) => (underline ? theme.color['Neutral/Neutral 20'] : 'transparent')};
  overflow: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  height: ${({ dimension }) => (dimension === 'l' ? TAB_HEIGHT_L : TAB_HEIGHT_M)}px;
  max-height: ${({ dimension }) => (dimension === 'l' ? TAB_HEIGHT_L : TAB_HEIGHT_M)}px;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scrollbar-height: none;
`;

export const Underline = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  background-color: ${({ theme }) => theme.color['Primary/Primary 60 Main']};
  height: ${LINE_HEIGHT};
  transition: all 0.2s ease-out;
`;

export const TabContent = styled.div`
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

export const TabContentWrapper = styled.span<{ dimension: Dimension }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: ${({ dimension }) => (dimension === 'l' ? TAB_PADDING_L : TAB_PADDING_M)};
`;

export const Tab = styled.button<{ dimension: Dimension; selected: boolean }>`
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  height: ${({ dimension }) => (dimension === 'm' ? TAB_HEIGHT_M : TAB_HEIGHT_L)}px;
  padding: 0;
  background: transparent;
  appearance: none;
  border: none;
  color: ${(p) => (p.selected ? p.theme.color['Neutral/Neutral 90'] : p.theme.color['Neutral/Neutral 50'])};
  ${({ dimension }) => (dimension === 'm' ? typography['Body/Body 2 Long'] : typography['Body/Body 1 Long'])}
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus:not(:active) {
    &:before {
      position: absolute;
      content: '';
      border: ${LINE_HEIGHT} solid ${({ theme }) => theme.color['Primary/Primary 60 Main']};
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  &:focus,
  & > ${TabContentWrapper} {
    outline: none;
  }

  & svg {
    display: inline-block;
    flex: 1 0 auto;
    & *[fill^='#'] {
      fill: ${({ theme }) => theme.color['Neutral/Neutral 50']};
    }
    width: ${({ dimension }) => (dimension === 'm' ? ICON_SIZE_M : ICON_SIZE_L)}px;
    height: ${({ dimension }) => (dimension === 'm' ? ICON_SIZE_M : ICON_SIZE_L)}px;
    margin-right: ${ICON_MARGIN};
  }
  & [data-badge] {
    margin-left: ${BADGE_MARGIN};
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color['Opacity/Hover']};
    }
  }
  &:active:not(:disabled) {
    color: ${({ theme }) => theme.color['Primary/Primary 60 Main']};
    & *[fill^='#'] {
      fill: ${({ theme }) => theme.color['Primary/Primary 60 Main']};
    }
    [data-badge] {
      background: ${({ theme }) => theme.color['Primary/Primary 60 Main']};
      color: ${({ theme }) => theme.color['Special/Static White']};
    }
  }
  &:disabled {
    color: ${({ theme }) => theme.color['Neutral/Neutral 30']};
    cursor: default;
    & *[fill^='#'] {
      fill: ${({ theme }) => theme.color['Neutral/Neutral 30']};
    }
  }
`;

export const TabWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const FOCUS_BORDER_OFFSET_M = '-4px';
const FOCUS_BORDER_OFFSET_L = '-6px';

export const StyledOverflowMenu = styled(OverflowMenu)<{
  isActive: boolean;
  isHidden?: boolean;
  dimension?: Dimension;
}>`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
  &:focus-visible {
    &:before {
      content: '';
      position: absolute;
      ${({ dimension }) => `
        top: ${dimension === 'l' ? FOCUS_BORDER_OFFSET_L : FOCUS_BORDER_OFFSET_M};
        left: ${dimension === 'l' ? FOCUS_BORDER_OFFSET_L : FOCUS_BORDER_OFFSET_M};
        right: ${dimension === 'l' ? FOCUS_BORDER_OFFSET_L : FOCUS_BORDER_OFFSET_M};
        bottom: ${dimension === 'l' ? FOCUS_BORDER_OFFSET_L : FOCUS_BORDER_OFFSET_M};
      `}
      border-radius: 0;
      border: 2px solid ${({ theme }) => theme.color['Primary/Primary 60 Main']};
    }
  }

  & svg {
    & *[fill^='#'] {
      fill: ${({ theme, isActive: isActive }) =>
        isActive ? theme.color['Primary/Primary 60 Main'] : theme.color['Neutral/Neutral 50']};
    }
  }
`;
