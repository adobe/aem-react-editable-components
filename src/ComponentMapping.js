import { ComponentMapping } from '@cq/spa-component-mapping';
import EditableComponentComposer from "./edit/EditableComponentComposer";

/**
 * Wrapped function
 *
 * @type {function}
 */
let wrappedMapFct = ComponentMapping.map;

/**
 * Map a React component with the given resource types. If an {@code editClass} is provided the {@code clazz} is wrapped to provide edition capabilities on the AEM Page Editor
 *
 * @param {string[]} resourceTypes      List of resource types for which to use the given {@code clazz}
 * @param {class} clazz                 Class to be instantiated for the given resource types
 * @param {class} editClass             Configuration class for enabling the edition capabilities
 * @returns {class} the resulting Class
 */
ComponentMapping.map = function map (resourceTypes, clazz, editClass) {
        let innerClass = clazz;

        if (editClass) {
            innerClass = EditableComponentComposer.compose(clazz, editClass);
        }

        wrappedMapFct.call(ComponentMapping, resourceTypes, innerClass);

        return innerClass;
    };

function MapTo(resourceTypes) {
    return (clazz, editClass) => {
        return ComponentMapping.map(resourceTypes, clazz, editClass);
    };
}

export {ComponentMapping, MapTo};