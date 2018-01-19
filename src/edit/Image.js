/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
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
import AbstractEdit from './AbstractEdit';

/**
 * Default Edit configuration for the Image component that interact with the Core Image component and sub-types
 */
class Image extends AbstractEdit {

    /**
     * @inheritDoc
     */
    get emptyLabel() {
        return 'Image';
    }

    /**
     * @inheritDoc
     */
    isEmpty() {
        return !this.props || !this.props.cq_model || !this.props.cq_model.src || this.props.cq_model.src.trim().length < 1;
    }

    /**
     * @inheritDoc
     */
    get dragDropName() {
        return 'image';
    }
}

export default Image;
