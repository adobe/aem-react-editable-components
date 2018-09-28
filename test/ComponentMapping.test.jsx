import React, { Component } from 'react';
import { ComponentMapping, MapTo } from '../src/ComponentMapping';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';

describe('ComponentMapping', () => {

    const COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';

    const EditConfig = {

        /**
         * @inheritDoc
         */
        emptyLabel: 'Image',

        /**
         * @inheritDoc
         */
        isEmpty: function() {
            return !this.props || !this.props.src || this.props.src.trim().length < 1;
        }
    };

    class TestComponent extends Component {
        render () {
            return <div/>
        }
    }


    it('should store and retrieve component', () => {
        MapTo(COMPONENT_RESOURCE_TYPE)(TestComponent, EditConfig);
        let WrappedTestComponent = ComponentMapping.get(COMPONENT_RESOURCE_TYPE);

        expect(WrappedTestComponent).to.exist;
    });

});
