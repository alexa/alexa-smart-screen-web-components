module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'header'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "header/header": [2, 
      "block", // style of comment
      [
        '',
        ' * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.',
        ' *',
        ' * Licensed under the Apache License, Version 2.0 (the "License").',
        ' * You may not use this file except in compliance with the License.',
        ' * A copy of the License is located at',
        ' *',
        ' *     http://aws.amazon.com/apache2.0/',
        ' *',
        ' * or in the "license" file accompanying this file. This file is distributed',
        ' * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either',
        ' * express or implied. See the License for the specific language governing',
        ' * permissions and limitations under the License.',
        ' '
      ],
      2 // number of newlines after the header
    ],
    "@typescript-eslint/type-annotation-spacing": [
      "error",
      {
        "before": true,
        "after": true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "key-spacing": [
      "error",
      {
        "beforeColon": true, 
      },
    ]
  }
};