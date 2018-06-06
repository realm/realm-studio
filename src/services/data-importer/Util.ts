////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

export default class Util {
  public static isBoolean(value: string): boolean {
    if (value) {
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
    }
    return false;
  }

  public static isInt(value: string): boolean {
    const nbr: any = Util.filterFloat(value);
    if (Number.isNaN(nbr)) {
      return false;
    } else {
      return Number.isInteger(nbr);
    }
  }

  public static isDouble(value: string): boolean {
    return !Number.isNaN(Util.filterFloat(value) as any);
  }

  private static filterFloat(value: string): number {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }
}
