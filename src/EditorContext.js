/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
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

import React from "react";
import Utils from "./Utils";

export const EditorContext = React.createContext(Utils.isInEditor());

export const withEditorContext = (Component) => {
  return (props) => (
    <EditorContext.Consumer>
       {isInEditor =>  <Component {...props} isInEditor={isInEditor} />}
    </EditorContext.Consumer>)
};