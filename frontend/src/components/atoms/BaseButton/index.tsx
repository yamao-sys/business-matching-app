import { useMemo } from 'react';

type Props = {
  labelText: string;
  color: 'green' | 'gray' | 'red';
  additionalStyle?: string;
} & JSX.IntrinsicElements['button'];

export const BaseButton = ({ labelText, color, additionalStyle = '', onClick }: Props) => {
  const buttonColorStyle = useMemo(() => {
    switch (color) {
      case 'green':
        return 'border-green-500 bg-green-500';
      case 'gray':
        return 'border-gray-500 bg-gray-500';
      case 'red':
        return 'border-red-500 bg-red-500';
    }
  }, [color]);

  return (
    <>
      <button
        className={`py-2 px-8 ${buttonColorStyle} rounded-xl text-white ${additionalStyle}`}
        onClick={onClick}
      >
        {labelText}
      </button>
    </>
  );
};
