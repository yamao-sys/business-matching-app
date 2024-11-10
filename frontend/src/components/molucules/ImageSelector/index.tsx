import { BaseImageInput } from '@/components/atoms/ BaseImageInput';
import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { useGetImageUrl } from '@/hooks/useGetImgUrl';
import { FC, useRef, useState } from 'react';

type Props = {
  labelId: string;
  needsMargin?: boolean;
};

export const ImageSelector: FC<Props> = ({ labelId, needsMargin = true }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget?.files && e.currentTarget.files[0]) {
      const targetFile = e.currentTarget.files[0];
      setImageFile(targetFile);
    }
  };

  const handleClickCancelButton = () => {
    setImageFile(null);
    // <input />タグの値をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // state (imageFile)が更新されたら、画像URLを作成する。
  const { imageUrl } = useGetImageUrl({ file: imageFile });

  return (
    <BaseFormBox needsMargin={needsMargin}>
      <label
        htmlFor={labelId}
        style={{
          border: 'black 3px dotted',
          width: 360,
          height: 270,
          display: 'flex',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {imageUrl && imageFile ? (
          <img
            src={imageUrl}
            alt='アップロード画像'
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          '+ 画像をアップロード'
        )}
        {/* ダミーインプット: 見えない */}
        <BaseImageInput ref={fileInputRef} id={labelId} onChange={handleFileChange} />
      </label>

      <div style={{ height: 20 }} />
      {/* キャンセルボタン */}
      <button onClick={handleClickCancelButton}>キャンセル</button>
    </BaseFormBox>
  );
};
