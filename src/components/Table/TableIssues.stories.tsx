import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import styled from 'styled-components';

import type { Column } from '#src/components/Table';
import { Table } from '#src/components/Table';

const Desc = styled.div`
  font-family: 'VTB Group UI';
  font-size: 16px;
  line-height: 24px;
`;

const Description = () => <Desc>Демонстрация ошибок и вариант их исправления</Desc>;

export default {
  title: 'Issues/Table',
  decorators: [],
  component: Table,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
    componentSubtitle: <Description />,
  },
  argTypes: {
    dimension: {
      options: ['xl', 'l', 'm', 's'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Table>;

const ROWS = [];

for (let i = 0; i < 15; i++) {
  const groupId = `G${i}`;
  const name = `Group ${i}`;
  const children = [];

  if (i % 2 === 0) {
    for (let i = 0; i < 15; i++) {
      const rowId = `${groupId}R${i}`;
      const name = `Row ${i}`;
      children.push({
        id: rowId,
        name,
        data: i * 13,
      });
    }
  }

  ROWS.push(...children, {
    id: groupId,
    name,
    data: children.reduce((sum, it) => sum + it.data, 0),
    groupRows: children.map((it) => it.id),
    groupTitle: name,
  });
}

const COLUMNS: Column[] = [
  {
    name: 'id',
    title: 'Ключ',
    width: 150,
  },
  {
    name: 'name',
    title: 'Название',
  },
  {
    name: 'data',
    title: 'Сумма',
    cellAlign: 'right',
    width: 150,
  },
];

const Template: ComponentStory<typeof Table> = (args) => {
  const { onRowExpansionChange, onRowSelectionChange } = args;
  const [rows, setRows] = React.useState(args.rowList);

  const handleExpansionChange = React.useCallback((ids: Record<string | number, boolean>): void => {
    setRows((rows) => rows.map((row) => ({ ...row, expanded: ids[row.id] })));
    onRowExpansionChange?.(ids);
  }, []);
  const handleSelectionChange = React.useCallback((ids: Record<string | number, boolean>): void => {
    setRows((rows) => rows.map((row) => ({ ...row, selected: ids[row.id] })));
    onRowSelectionChange?.(ids);
  }, []);
  return (
    <Table
      {...args}
      displayRowSelectionColumn
      displayRowExpansionColumn
      virtualScroll={{ fixedRowHeight: 40 }}
      style={{ height: '500px', border: '1px solid' }}
      onRowExpansionChange={handleExpansionChange}
      onRowSelectionChange={handleSelectionChange}
      rowList={rows}
    />
  );
};
export const VirtualGroups = Template.bind({});
VirtualGroups.args = {
  rowList: ROWS,
  columnList: COLUMNS,
};
VirtualGroups.storyName = 'Table. Виртуальные группы';
VirtualGroups.parameters = {
  docs: {
    description: {
      story: `Продемонстрировано решение двух проблем. 1. Ошибка воспроизводится при скрытии групп и наличии виртуальной высоты таблицы`,
    },
  },
};
