import React from 'react';
import {
    Form, 
    FormSubmitButton,
    FormField,
    RadioButtonGroupProps,
    RadioButtonGroup,
    RadioButton } from '@ctoec/component-library';
import { Child } from 'shared/models';

type CareForKidsProps = {
    initState: Child,
    passData: (_: Child) => void;
}

/*
* Basic functional component designed to allow user to edit
* the Care For Kids field of a data record.
* Data is not processed using a FlattenedEnrollment.
* Rather, information is inherited via props from the parent
* object (the EditRecord page), which will bundle all 
* edits together and make a single unified record update
* when the user is done editing. This allows users to make
* changes to the state of individual fields without needing
* to make repeated calls to the databse via API methods.
*/
export const CareForKidsForm: React.FC<CareForKidsProps> = 
    ({initState, passData}) => {

    // Uses the inherited method from the parent on EditRecord to 
    // change the *state* inherited from EditRecord. This form
    // keeps a local copy of the state so that only changes the user
    // wishes to commit are pushed back up to the parent.
    function saveButton(newState: Child) {
        passData(newState);
        alert('Data saved successfully!');
    }

    return(
        <div className='grid-container margin-top-2'>
            <h1 className='grid-row'>Receiving Care For Kids?</h1>
            <div>
                <Form<Child>
                    className='CareForKidsForm'
                    data={initState}
                    onSubmit={saveButton}
                    noValidate
                    autoComplete="off"
                >
                    <FormField<Child, RadioButtonGroupProps, boolean>
                        getValue={(data) => data.at('recievesC4K')}
                        preprocessForDisplay={(data) => data === true ? 'yes' : 'no'}
                        parseOnChangeEvent={(e) => {return e.target.value === 'Yes'}}
                        inputComponent={RadioButtonGroup}
                        id='c4k-radio-group'
                        name='careforkids'
                        legend='receives care for kids'
                        options={[
                            {
                                render: (props) => <div><RadioButton text='Yes' {...props} /></div>,
                                value: 'Yes'
                            },
                            {
                                render: (props) => <div><RadioButton text='No' {...props} /></div>,
                                value: 'No'
                            }
                        ]}
                    / >
                    <div className='grid-row margin-top-2'>
                        <FormSubmitButton text="Save edits" />
                    </div>
                </ Form>
            </div>
        </div>
    );
};
