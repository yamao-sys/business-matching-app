import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { FC, memo } from 'react';

type Props = {
  labelText: string;
  labelId: string;
  validationErrorMessages: string[];
  needsMargin: boolean;
} & JSX.IntrinsicElements['input'];

export const BoxDatePicker: FC<Props> = memo(function BoxDatePicker({
  labelText,
  labelId,
  validationErrorMessages = [],
  needsMargin = true,
  name,
  value,
  onChange,
}: Props) {
  return (
    <BaseFormBox needsMargin={needsMargin}>
      <label
        htmlFor={labelId}
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left'
      >
        <span className='font-bold'>{labelText}</span>
      </label>
      <input
        id={labelId}
        name={name}
        type='date'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={value}
        onChange={onChange}
        min='1900-01-01'
      />
      <div className='w-full pt-5 text-left'>
        {validationErrorMessages.map((message, i) => (
          <p key={i} className='text-red-400'>
            {message}
          </p>
        ))}
      </div>
    </BaseFormBox>
  );
});
