/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Model, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { fetchModel } from '../../src/api/fetchModel';
import { waitFor } from '@testing-library/react';

describe('fetchModel ->', () => {
  const MODEL = { data: 'testModel' } as Model;
  const MODEL_OK_RESPONSE = { data: 'testModel', ok: true, json: () => ' ' } as Model;
  const CQ_PATH = 'testPage/jcr:content/componentPath';

  let getDataSpy: jest.SpyInstance;

  beforeEach(() => {
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue(MODEL);
  });

  afterEach(() => {
    getDataSpy.mockReset();
  });
  it('should fetch model using modelmanager for the given cqPath', async () => {
    const response = await fetchModel({ cqPath: CQ_PATH });
    expect(getDataSpy).toHaveBeenCalledWith(expect.objectContaining({ path: CQ_PATH }));
    expect(response).toEqual(MODEL);
  });

  it('should fetch model using modelmanager for the given page and item paths', async () => {
    const response = await fetchModel({ pagePath: 'testPage', itemPath: 'componentPath' });
    expect(getDataSpy).toHaveBeenCalledWith(expect.objectContaining({ path: CQ_PATH }));
    expect(response).toEqual(MODEL);
  });

  it('should fetch model using fetch api if remote host if provided', async () => {
    global.fetch = jest.fn().mockImplementation(() => MODEL_OK_RESPONSE as Response);
    fetchModel({ cqPath: CQ_PATH, host: 'test.com/', options: {} });
    expect(fetch).toHaveBeenCalledWith(`test.com/${CQ_PATH}.model.json`, {});
    delete global.fetch;
  });

  it('should log error when there is no remote host and no data', async () => {
    const error = new Error('404 - Not found');
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockRejectedValue(error);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await fetchModel({ cqPath: CQ_PATH });
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(error));
    consoleSpy.mockRestore();
  });
});
