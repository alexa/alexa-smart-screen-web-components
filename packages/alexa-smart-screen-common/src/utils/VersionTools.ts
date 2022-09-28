/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

export class VersionTools {
    /**
     * Compare two versions as strings.
     *
     * @param v1 First version to compare.
     * @param v2 Second version to compare.
     * @return n, where n<0 if v1<v2, n=0 if v1=v2 and n>0 if v1>v2
     */
    public static compareVersions(v1 : string, v2 : string) : number {
        if (!v1) {
            return -1;
        }

        if (!v2) {
            return 1;
        }

        const v1Arr : string[] = v1.split('.');
        const v2Arr : string[] = v2.split('.');

        for (let i = 0; i < Math.min(v1Arr.length, v2Arr.length); i++) {
            if (Number(v1Arr[i]) < Number(v2Arr[i])) {
            return -1;
            } else if (Number(v1Arr[i]) > Number(v2Arr[i])) {
            return 1;
            }
        }

        // The longest one is bigger
        return v1Arr.length - v2Arr.length;
    }
}