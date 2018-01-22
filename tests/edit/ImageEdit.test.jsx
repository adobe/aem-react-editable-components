import { edit } from '../../index';

describe('ImageEdit', () => {

    describe('isEmpty ->', () => {

        it('should have the right label', done => {
            let imageEdit = new edit.ImageEdit();

            if ('Image' === imageEdit.emptyLabel) {
                done();
            }
        });

        it('should have the right d&d name', done => {
            let imageEdit = new edit.ImageEdit();

            if ('image' === imageEdit.dragDropName) {
                done();
            }
        });

        it('should be empty when there is no source', done => {
            let imageEdit = new edit.ImageEdit();

            imageEdit.props = {
                cq_model: {}
            };

            if (imageEdit.isEmpty()) {
                done();
            }
        });

        it('should be empty when source is empty', done => {
            let imageEdit = new edit.ImageEdit();

            imageEdit.props = {
                cq_model: {
                    src: ''
                }
            };

            if (imageEdit.isEmpty()) {
                done();
            }
        });

        it('should be empty when source is empty after trim', done => {
            let imageEdit = new edit.ImageEdit();

            imageEdit.props = {
                cq_model: {
                    src: '  '
                }
            };

            if (imageEdit.isEmpty()) {
                done();
            }
        });

        it('should not be empty when source filled', done => {
            let imageEdit = new edit.ImageEdit();

            imageEdit.props = {
                cq_model: {
                    src: 'test'
                }
            };

            if (!imageEdit.isEmpty()) {
                done();
            }
        });

    });

});
