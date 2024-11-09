#!/bin/bash

ENDPOINT=""

function _usage() {
	echo "Usage: $(basename $0) -endpoint [ENDPOINT]"
	echo "  -e  				 		   EndPoint To Merge And Generate Types"
	echo "  -h                 print this help"
	exit 1
}

while getopts e:h OPT;
do
	case $OPT in
		'e') ENDPOINT=$OPTARG;;
		'h') _usage;;
		*) _usage;;
	esac
done

if [ -z "$ENDPOINT" ]; then
  echo "[ERROR] Please check options"
  _usage
fi

input_schema_path="./swagger/$ENDPOINT/actions.yaml"
merged_schema_path="./swagger/$ENDPOINT/swagger.yaml"
generated_type_path="./src/generated/$ENDPOINT"

# 指定のエンドポイントのスキーマファイルを統合
npx swagger-merger -i $input_schema_path -o $merged_schema_path

# 元の型ファイルを削除し、新たに作り直す
rm -rf $generated_type_path
npx openapi2aspida -i $merged_schema_path -o $generated_type_path

# 自動生成したファイルがあるためprettierを実行
npm run format:fix
