import React from 'react';
import type { FC } from 'react';
import { Tooltip } from '#src/components-ver2/Tooltip';
import type { ITooltipProps } from '#src/components-ver2/Tooltip';

import { Content, ContentWrapper } from '#src/components-ver2/Stepper/style';
import StepperContext from '#src/components-ver2/Stepper/StepperContext';

export const StepContent: FC<{ children: string; tooltipProps?: Partial<ITooltipProps> }> = ({
  children,
  tooltipProps,
}) => {
  const { orientation, lineClamp, stepWidth } = React.useContext(StepperContext);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = React.useState(false);

  const detectOverflow = (e: any) => e.clientHeight < e.scrollHeight;

  React.useLayoutEffect(() => {
    if (contentRef.current && detectOverflow(contentRef.current) !== overflow) {
      setOverflow(detectOverflow(contentRef.current));
    }
  }, [children, orientation, stepWidth, lineClamp]);

  return overflow ? (
    <Tooltip renderContent={() => children} {...tooltipProps}>
      <ContentWrapper>
        <Content ref={contentRef} lineClamp={lineClamp}>
          {children}
        </Content>
      </ContentWrapper>
    </Tooltip>
  ) : (
    <ContentWrapper>
      <Content ref={contentRef} lineClamp={lineClamp}>
        {children}
      </Content>
    </ContentWrapper>
  );
};
