import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';
import { Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

interface Props {
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({setEditMode}: Props) {

    const { profileStore: { profile, editProfile } } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
    });

    return (
        <Formik
            initialValues={{displayName: !profile?.displayName ? "" : profile?.displayName, 
                bio: !profile?.bio ? "" : profile?.bio}}
            onSubmit={(values) => { editProfile(values).then(() => { setEditMode(false) }) }}
            validationSchema={validationSchema}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className='ui form'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextArea rows={3} name='bio' placeholder='Add your bio' />
                    <Button 
                        disabled={!dirty || !isValid}
                        loading={isSubmitting}
                        floated='right'
                        positive
                        type='submit'
                        content='Update Profile'
                    />
                </Form>
            )}
        </Formik> 
    );
});