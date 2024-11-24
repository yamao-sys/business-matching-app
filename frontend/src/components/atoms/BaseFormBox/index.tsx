import { FC, memo } from 'react';

type Props = {
  needsMargin?: boolean;
  children: React.ReactNode;
};

export const BaseFormBox: FC<Props> = memo<Props>(function BaseFormBox({
  needsMargin = true,
  children,
}: Props) {
  return <div className={needsMargin ? 'mt-8' : ''}>{children}</div>;
});
