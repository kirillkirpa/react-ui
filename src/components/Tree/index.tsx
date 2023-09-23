import type { HTMLAttributes } from 'react';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { Dimension, TreeItemProps } from './TreeNode';
import styled from 'styled-components';
import { refSetter } from '../common/utils/refSetter';
import observeRect from '../common/observeRect';

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Размер компонента */
  dimension?: Dimension;
  /** Активная секция Tree */
  active?: string;
  /** выбранная секция Tree */
  selected?: string;
  /** выбранная по умолчаниию секция Tree */
  defaultSelected?: string;
  /** Обработчик выбора элемента дерева */
  onActivateItem?: (id?: string) => void;
  /** Обработчик выбора элемента дерева */
  onSelectItem?: (id: string) => void;
  /** Обработчик изменения данных дерева */
  onChange?: (model: Array<TreeItemProps>) => void;
  /** Модель данных, с рендер-пропсами*/
  model: Array<TreeItemProps>;
  /** Признак того, что дерево содержит checkbox-ы */
  withCheckbox?: boolean;
  /** Ширина строк дерева */
  width?: number;
  /** Включение виртуального скролла для тела. */
  virtualScroll?: {
    /** Фиксированная высота строки, для правильного функционирования виртуального скролла
     * все строки должны быть одной фиксированной высоты
     */
    fixedRowHeight: number;
    /** Количество отрендеренных элементов за пределами видимой части */
    renderAhread: number;
  };
}

const Spacer = styled.div`
  display: flex;
  flex: 0 0 auto;
`;

const VirtualWrapper = styled.div`
  overflow: overlay;
`;

const Wrapper = styled.div<{ $width?: number }>`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => `${$width}px` || '768px'};
`;

type NodesMapItem = {
  dependencies?: Array<string>;
  level: number;
  node: TreeItemProps;
};

type NodesMap = { [key: string]: NodesMapItem };

const treeToMap = (tree: Array<TreeItemProps>, level = 0, dependencies?: Array<Array<string>>): NodesMap => {
  return tree.reduce((acc: NodesMap, item) => {
    const key = item.id.toString();
    acc[key] = { level, node: item };

    if (dependencies && !item.children) {
      dependencies.forEach((dependency) => dependency.push(key));
    }
    if (item.children) {
      const allDependencies = dependencies ? [...dependencies] : [];
      const itemDependencies: Array<string> = [];
      acc[key].dependencies = itemDependencies;
      allDependencies.push(itemDependencies);
      const map = treeToMap(item.children, level + 1, allDependencies);
      return { ...acc, ...map };
    }

    return acc;
  }, {}) as NodesMap;
};

export const Tree = forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      dimension = 'm',
      width,
      model,
      withCheckbox = true,
      selected,
      defaultSelected,
      active,
      onActivateItem,
      onSelectItem,
      onChange,
      virtualScroll,
      ...props
    },
    ref,
  ) => {
    const [internalModel, setInternalModel] = useState<Array<TreeItemProps>>([...model]);
    const [selectedState, setSelectedState] = useState<string | undefined>(defaultSelected);
    const [activeState, setActiveState] = useState<string | undefined>(undefined);
    const [height, setHeight] = React.useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const scrollContainer = scrollContainerRef.current as Element;
      if (virtualScroll && scrollContainer) {
        const observer = new ResizeObserver((entities) => {
          for (const entity of entities) {
            setHeight((state) => state || entity.contentRect.height);
          }
        });
        observer.observe(scrollContainer);
        return () => {
          observer.disconnect();
        };
      }
    }, [virtualScroll]);

    const selectedId = selected === undefined ? selectedState : selected;
    const activeId = active === undefined ? activeState : active;

    const activateItem = (id?: string) => {
      if (activeId !== id) setActiveState(id);
      onActivateItem?.(id);
    };

    const selectItem = (id: string) => {
      if (withCheckbox) {
        if (id) toggleCheck(id);
      }
      if (selectedId !== id) setSelectedState(id);

      onSelectItem?.(id);
    };

    useEffect(() => {
      setInternalModel([...model]);
    }, [model]);

    const map = useMemo(() => {
      return treeToMap(model);
    }, [model]);

    const toggleExpand = (id: string) => {
      map[id].node.expanded = !map[id].node.expanded;

      if (onChange) {
        onChange([...internalModel]);
      } else {
        setInternalModel([...internalModel]);
      }
      if (selectedId !== id) setSelectedState(id);
    };

    const setChecked = (id: number | string, value: boolean) => {
      if (map[id].node.disabled) return;
      map[id].node.checked = value;

      if (map[id].dependencies?.length) {
        map[id].dependencies?.forEach((depId: number | string) => setChecked(depId, value));
      }
    };

    const toggleCheck = (id: string | number) => {
      const hasChildren = !!map[id].node.children;

      const indeterminate =
        map[id].dependencies?.some((depId: number | string) => map[depId].node.checked) &&
        map[id].dependencies?.some((depId: number | string) => !map[depId].node.checked);

      const checked = hasChildren
        ? indeterminate
          ? true
          : map[id].dependencies?.every((depId: number | string) => map[depId].node.checked)
        : map[id].node.checked;

      setChecked(id, !checked);

      if (onChange) {
        onChange([...internalModel]);
      } else {
        setInternalModel([...internalModel]);
      }
    };

    const renderChildren = (items: Array<TreeItemProps>): React.ReactNode[] => {
      return items.flatMap((item) => {
        const node = map[item.id];
        const hasChildren = !!item.children;
        const indeterminate =
          node.dependencies?.some((depId: number | string) => map[depId].node.checked) &&
          node.dependencies?.some((depId: number | string) => !map[depId].node.checked);
        const checked = hasChildren
          ? node.dependencies?.every((depId: number | string) => map[depId].node.checked)
          : !!item.checked;
        const children = item.children && item.expanded ? renderChildren(item.children) : [];

        return [
          <React.Fragment key={item.id}>
            {item.render({
              checked,
              indeterminate,
              hasChildren,
              level: node.level,
              disabled: item.disabled,
              dimension: dimension,
              expanded: item.expanded,
              checkboxVisible: withCheckbox,
              hovered: activeId === item.id,
              selected: selectedId === item.id,
              onHover: () => {
                activateItem(item.disabled ? undefined : item.id);
              },
              onClickItem: () => selectItem(item.id),
              onToggleExpand: () => toggleExpand(item.id),
            })}
          </React.Fragment>,
          ...children,
        ];
      });
    };

    const handleMouseLeave = () => {
      setActiveState(undefined);
    };

    const children = React.useMemo(() => renderChildren(model) as React.ReactNode[], [model]);

    return (
      <Wrapper ref={refSetter(ref, scrollContainerRef)} $width={width} onMouseLeave={handleMouseLeave} {...props}>
        {virtualScroll ? (
          <VirtualBody
            children={children}
            height={height}
            renderAhread={virtualScroll.renderAhread}
            fixedRowHeight={virtualScroll.fixedRowHeight}
          />
        ) : (
          children
        )}
      </Wrapper>
    );
  },
);

interface VirtualBodyProps {
  children: React.ReactNode[];
  height: number;
  renderAhread: number;
  fixedRowHeight: number;
}

function VirtualBody(props: VirtualBodyProps) {
  const { children, height, renderAhread, fixedRowHeight } = props;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll = (e: any) => {
    requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });
  };
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current as Element;
    if (scrollContainer) {
      setScrollTop(scrollContainer?.scrollTop || 0);
      scrollContainer?.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer?.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const itemCount = children.length;
  let startNode = Math.floor(scrollTop / fixedRowHeight) - renderAhread;
  startNode = Math.max(0, startNode);
  let visibleNodeCount = Math.ceil(height / fixedRowHeight) + 2 * renderAhread;
  visibleNodeCount = Math.min(itemCount - startNode, visibleNodeCount);
  const visibleChildren = useMemo(() => {
    return [...children].slice(startNode, startNode + visibleNodeCount);
  }, [children, startNode, visibleNodeCount]);

  const topPadding = `${startNode * fixedRowHeight}px`;
  const bottomPadding = `${(itemCount - startNode - visibleNodeCount) * fixedRowHeight}px`;
  return (
    <VirtualWrapper style={{ height }} ref={scrollContainerRef}>
      <Spacer style={{ minHeight: topPadding }} />
      {visibleChildren}
      <Spacer style={{ minHeight: bottomPadding }} />
    </VirtualWrapper>
  );
}

export { TreeNode } from './TreeNode';
