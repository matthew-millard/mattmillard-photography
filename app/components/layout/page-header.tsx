import React, { ComponentPropsWithoutRef } from 'react';
import { cn } from '~/lib/utils';
import { H1, P } from '~/components/typography';

interface PageHeaderProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  description: string;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, className, ...props }, ref) => {
    return (
      <div className={cn('py-2', className)} ref={ref} {...props}>
        <H1>{title}</H1>
        <P className="text-muted-foreground">{description}</P>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export default PageHeader;
