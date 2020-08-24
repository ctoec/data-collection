import React, { useState } from 'react';
import {
    Form, 
    FormSubmitButton,
    FormField,
    RadioButtonGroupProps,
    RadioButtonGroup,
    RadioButton } from '@ctoec/component-library';

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
export const CareForKidsForm: React.FC = (props) => {

    const [currentState, setcurrentState] = useState(props.initState);

    // Updates only the changed information by using the object spread
    // to only edit the form field value
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        var newState = {...currentState};
        newState['recievesC4K'] = e.target.value === 'Yes' ? true : false;
        setcurrentState(newState);
        return newState['recievesC4K'];
    }

    // Uses the inherited method from the parent on EditRecord to 
    // change the *state* inherited from EditRecord. This form
    // keeps a local copy of the state so that only changes the user
    // wishes to commit are pushed back up to the parent.
    function saveButton() {
        console.log(currentState);
        props.passData(currentState);
        alert('Data saved successfully!');
    }

    return(
        <div className='grid-container margin-top-2'>
            <h2 className='grid-row'>Receiving Care For Kids?</h2>
            <div>
                <Form<object>
                    className='CareForKidsForm'
                    data={currentState}
                    onSubmit={saveButton}
                    noValidate
                    autoComplete="off"
                >
                    <FormField<object, RadioButtonGroupProps, boolean>
                        getValue={(data) => data.at('recievesC4K')}
                        preprocessForDisplay={(data) => data == true ? 'yes' : 'no'}
                        parseOnChangeEvent={(e) => handleChange(e)}
                        inputComponent={RadioButtonGroup}
                        id='c4k-radio-group'
                        name='careforkids'
                        legend=''
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