import React, { InputHTMLAttributes, forwardRef } from 'react';

export type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: InputHTMLAttributes<HTMLInputElement>['id'];
};

export const BaseImageInput = forwardRef<HTMLInputElement, Props>(function BaseImageInput(
  { onChange, id },
  ref,
) {
  return <input ref={ref} id={id} type='file' accept='image/*' onChange={onChange} hidden />;
});
