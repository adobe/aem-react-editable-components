/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2020 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

import { Model } from '@adobe/cq-spa-page-model-manager';

export interface ResponsiveGridModel extends Model {
    gridClassNames: string;
    columnCount: number;
}

export interface PageModel extends Model {
    designPath?: string;
    title?: string;
    lastModifiedDate?: number;
    templateName?: string;
    cssClassNames?: string;
    language?: string;
}
