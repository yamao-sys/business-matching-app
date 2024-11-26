import { BaseImageInput } from '@/components/atoms/ BaseImageInput';
import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { useGetImageUrl } from '@/hooks/useGetImgUrl';
import { DragEvent, FC, memo, useRef, useState } from 'react';

type Props = {
  labelId: string;
  name: string;
  labelText: string;
  needsMargin?: boolean;
  initialFileInput?: Blob | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, file: File) => void;
  onCancel: (key: string) => void;
  validationErrorMessages: string[];
};

export const ImageSelector: FC<Props> = memo<Props>(function ImageSelector({
  labelId,
  name,
  labelText,
  needsMargin = true,
  initialFileInput = undefined,
  onChange,
  onCancel,
  validationErrorMessages = [],
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<Blob | File | null>(initialFileInput ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget?.files && e.currentTarget.files[0]) {
      const targetFile = e.currentTarget.files[0];
      setImageFile(targetFile);
      onChange(e, targetFile);
    }
  };

  const handleClickCancelButton = () => {
    setImageFile(null);
    // <input />タグの値をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      onCancel(fileInputRef.current.name);
    }
  };

  // state (imageFile)が更新されたら、画像URLを作成する。
  const { imageUrl } = useGetImageUrl({ file: imageFile });

  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDropFile = (file: File) => {
    if (file.type.substring(0, 5) !== 'image') {
      alert('画像ファイルでないものはアップロードできません！');
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        // const imageSrc: string = fileReader.result as string;
      };
      fileReader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files !== null && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length === 1 && e.dataTransfer.files[0] != undefined) {
        onDropFile(e.dataTransfer.files[0]);
      } else {
        alert('ファイルは１個まで！');
      }
      e.dataTransfer.clearData();
    }
  };

  return (
    <BaseFormBox needsMargin={needsMargin}>
      <label
        htmlFor={labelId}
        style={{ width: 360 }}
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left'
      >
        <span className='font-bold'>{labelText}</span>
        {/* NOTE: ダミーインプット: 見えない */}
        <BaseImageInput ref={fileInputRef} id={labelId} name={name} onChange={handleFileChange} />
        <div
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
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`mt-2 ${isDragActive ? 'opacity-10' : ''}`}
        >
          {imageUrl && imageFile ? (
            <img
              src={imageUrl}
              alt={`アップロード画像_${labelText}`}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            '+ 画像を選択 or ドラッグアンドドロップ'
          )}
        </div>
      </label>

      <button onClick={handleClickCancelButton} name={name}>
        キャンセル
      </button>

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
