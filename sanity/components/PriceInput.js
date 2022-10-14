/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from 'react';
import { FormField } from '@sanity/base/components';
import { TextInput, Stack, Label } from '@sanity/ui';
import PatchEvent, { set, unset } from '@sanity/form-builder/PatchEvent';

import { useId } from '@reach/auto-id';

const PriceInput = React.forwardRef((props, ref) => {
        const {
                type, // Schema information
                value, // Current field value
                readOnly, // Boolean if field is not editable
                placeholder, // Placeholder text from the schema
                markers, // Markers including validation rules
                presence, // Presence information for collaborative avatars
                onFocus, // Method to handle focus state
                onBlur, // Method to handle blur state
                onChange,
        } = props;

        // Creates a unique ID for our input
        const inputId = useId();

        // Creates a change handler for patching data
        const handleChange = React.useCallback(
                (event) => {
                        // useCallback will help with preformance
                        const inputValue = Number(event.currentTarget.value);
                        onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()));
                        // console.log(typeof inputValue + inputValue);
                },
                [onChange]
        );

        const formatMoney = Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
        }).format;

        return (
                <FormField
                        description={type.description} // Creates description from schema
                        title={`${type.title}: ${value ? formatMoney(value / 100) : ''}`} // Creates label from schema title
                        __unstable_markers={markers} // Handles all markers including validation
                        __unstable_presence={presence} // Handles presence avatars
                        inputId={inputId}
                >
                        <TextInput
                                id={inputId} // A unique ID for this input
                                onChange={handleChange}
                                value={value || ''} // Current field value
                                readOnly={readOnly} // If "readOnly" is defined make this field read only
                                placeholder={placeholder} // If placeholder is defined, display placeholder text
                                onFocus={onFocus} // Handles focus events
                                onBlur={onBlur} // Handles blur events
                                ref={ref}
                                type={type.name}
                        />
                </FormField>
        );
});

export default PriceInput;
