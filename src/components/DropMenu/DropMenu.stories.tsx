import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { withDesign } from 'storybook-addon-designs';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DropMenu } from '#src/components/DropMenu';
import { MenuItem, RenderOptionProps } from '#src/components/MenuItem';
import { Theme } from '#src/components/themes';
import { Button } from '#src/components/Button';
import { typography } from '#src/components/Typography';
import { ReactComponent as CardSolid } from '@admiral-ds/icons/build/finance/CardSolid.svg';

const Desc = styled.div`
  font-family: 'VTB Group UI';
  font-size: 16px;
  line-height: 24px;
`;

const Description = () => (
  <Desc>
    Компонент Dropdown Menu имеет три размера и может быть с иконкой или без. Высота строки : l - 48px, m - 40px, s -
    32px
  </Desc>
);

export default {
  title: 'Admiral-2.1/DropMenu',
  decorators: [withDesign],
  component: DropMenu,
  parameters: {
    componentSubtitle: <Description />,
    design: [
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A68931',
      },
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A68967',
      },
    ],
  },
  docs: {
    source: {
      type: 'code',
    },
  },
  argTypes: {
    dimension: {
      options: ['l', 'm', 's'],
      control: { type: 'radio' },
      defaultValue: 'l',
    },
    themeBorderKind: {
      control: {
        type: 'radio',
        options: ['Border radius 0', 'Border radius 2', 'Border radius 4', 'Border radius 8'],
      },
    },
  },
} as ComponentMeta<typeof DropMenu>;

const items = [
  {
    id: '1',
    label: 'Option one',
    value: 1,
  },
  {
    id: '2',
    label: 'Option two',
    value: 2,
  },
  {
    id: '3',
    label: 'Option three',
    value: 3,
  },
  {
    id: '4',
    label: 'Option four',
    value: 4,
  },
  {
    id: '5',
    label: 'Option five',
    value: 5,
  },
  { id: '6', label: 'Option six', value: 7 },
  {
    id: '7',
    label: 'Option seven',
    value: 6,
  },
];

const onOpenMenu = () => console.log('menu opened');
const onCloseMenu = () => console.log('menu closed');

const SimpleTemplate: ComponentStory<typeof DropMenu> = (args) => {
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const model = React.useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      render: (options: RenderOptionProps) => (
        <MenuItem dimension={args.dimension || 's'} {...options} key={item.id}>
          {item.label}
        </MenuItem>
      ),
    }));
  }, [args.dimension]);
  function swapBorder(theme: Theme): Theme {
    theme.shape.borderRadiusKind = (args as any).themeBorderKind || theme.shape.borderRadiusKind;
    return theme;
  }

  return (
    <ThemeProvider theme={swapBorder}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DropMenu
          {...args}
          items={model}
          onChange={(id) => {
            console.log(`selected: ${id}`);
            setSelected(id);
          }}
          onOpen={onOpenMenu}
          onClose={onCloseMenu}
          dimension={args.dimension}
          disabled={args.disabled}
          selected={selected}
          renderContentProp={({ buttonRef, handleKeyDown, handleClick }) => {
            return (
              <Button ref={buttonRef as React.Ref<HTMLButtonElement>} onKeyDown={handleKeyDown} onClick={handleClick}>
                Нажми
              </Button>
            );
          }}
        />
      </div>
    </ThemeProvider>
  );
};

const StyledAdditionalText = styled.div`
  ${typography['Body/Body 2 Long']}
  color: ${({ theme }) => theme.color['Neutral/Neutral 50']};
  pointer-events: none;
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 6px 8px;
  margin: 0 8px 0 24px;
  border-bottom: ${({ theme }) => `1px solid ${theme.color['Neutral/Neutral 20']}`};
  flex-direction: column;
  align-items: flex-start;
`;

const TemplateWithCards: ComponentStory<typeof DropMenu> = (args) => {
  const category = [
    {
      name: 'Категория 1',
      id: '1',
      content: [
        {
          id: '2',
          label: 'Номер Карты /****45',
          value: 1,
        },
        {
          id: '3',
          label: 'Номер Карты /****75',
          value: 2,
        },
        { id: '4', label: 'Номер Карты /****22', value: 3 },
        {
          id: '5',
          label: 'Номер Карты /****33',
          value: 4,
        },
      ],
    },
    {
      name: 'Категория 2',
      id: '9',
      content: [
        {
          id: '10',
          label: 'Номер Карты /****21',
          value: 5,
        },
        {
          id: '11',
          label: 'Номер Карты /****35',
          value: 6,
        },
        { id: '12', label: 'Номер Карты /****39', value: 7 },
        {
          id: '13',
          label: 'Номер Карты /****41',
          value: 8,
        },
      ],
    },
  ];

  const model = React.useMemo(() => {
    return category.reduce((acc: any, item: any) => {
      acc.push({
        id: item.id,
        render: (options: RenderOptionProps) => (
          <MenuItem dimension={args.dimension} key={item.id} {...options}>
            {item.name}
          </MenuItem>
        ),
        disabled: true,
      });
      return acc.concat(
        item.content.map((subitem: any) => {
          return {
            id: subitem.id,
            render: (options: RenderOptionProps) => (
              <StyledMenuItem dimension={args.dimension} key={subitem.id} {...options}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {subitem.label} <CardSolid width={24} height={24} />
                </div>
                <StyledAdditionalText>Дополнительный текст</StyledAdditionalText>
              </StyledMenuItem>
            ),
          };
        }),
      );
    }, []);
  }, []);

  const [selected, setSelected] = React.useState<string | undefined>('');
  const [active, setActive] = React.useState<string | undefined>('');

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DropMenu
          {...args}
          items={model}
          onChange={(id) => {
            console.log(`selected: ${id}`);
            setSelected(id);
          }}
          onOpen={onOpenMenu}
          onClose={onCloseMenu}
          dimension={args.dimension}
          disabled={args.disabled}
          selected={selected}
          onSelectItem={setSelected}
          active={active}
          onActivateItem={setActive}
          renderContentProp={({ buttonRef, handleKeyDown, handleClick }) => {
            return (
              <Button ref={buttonRef as React.Ref<HTMLButtonElement>} onKeyDown={handleKeyDown} onClick={handleClick}>
                Нажми
              </Button>
            );
          }}
        />
      </div>
    </>
  );
};

export const Simple = SimpleTemplate.bind({});
export const Category = TemplateWithCards.bind({});

Simple.storyName = 'Базовый пример';
Category.storyName = 'Пример с группами';
