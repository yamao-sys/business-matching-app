import React, { InputHTMLAttributes, forwardRef } from 'react';

export type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: InputHTMLAttributes<HTMLInputElement>['id'];
  name: InputHTMLAttributes<HTMLInputElement>['name'];
};

export const BaseImageInput = forwardRef<HTMLInputElement, Props>(function BaseImageInput(
  { onChange, id, name },
  ref,
) {
  return (
    <input
      ref={ref}
      id={id}
      name={name}
      data-testid={id}
      type='file'
      accept='image/*'
      onChange={onChange}
      hidden
    />
  );
});
