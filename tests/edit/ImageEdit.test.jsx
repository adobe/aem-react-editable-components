import { edit } from '../../index';

describe('ImageEdit', () => {

    describe('isEmpty ->', () => {

        it('should have the right label', () => {
            assert.isTrue('Image' === edit.ImageEdit.emptyLabel);
        });

        it('should have the right d&d name', () => {
            assert.isTrue('image' === edit.ImageEdit.dragDropName);
        });

        it('should be empty when there is no source', () => {
            let context = {
                props: {
                    cq_model: {}
                }
            };

            assert.isTrue(edit.ImageEdit.isEmpty.bind(context)());
        });

        it('should be empty when source is empty', () => {
            let context = {
                props: {
                    cq_model: {
                        src: ''
                    }
                }
            };

            assert.isTrue(edit.ImageEdit.isEmpty.bind(context)());
        });

        it('should be empty when source is empty after trim', () => {
            let context = {
                props: {
                    cq_model: {
                        src: '  '
                    }
                }
            };

            assert.isTrue(edit.ImageEdit.isEmpty.bind(context)());
        });

        it('should not be empty when source filled', () => {
            let context = {
                props: {
                    cq_model: {
                        src: 'test'
                    }
                }
            };

            assert.isFalse(edit.ImageEdit.isEmpty.bind(context)());
        });

    });

});
