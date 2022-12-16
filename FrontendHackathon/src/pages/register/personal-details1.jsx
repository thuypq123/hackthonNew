import * as React from 'react';
import { Field } from '@progress/kendo-react-form';
import { FormInput } from './form-components';
import { CCCDValidator,phoneValidator, emailValidator } from './validators';

export const PersonalDetails1 = <div>
    
    <Field key={'phone'} id={'phone'} name={'phone'} label={'Số điện thoại'} type={'number'}component={FormInput} validator={phoneValidator} /> 
    <Field key={'identityNumber'} id={'identityNumber'} name={'identityNumber'} label={'Số CMNN hoặc CCCD'} type={'numbe'} component={FormInput} validator={CCCDValidator} />
    <Field key={'email'} id={'email'} name={'email'} label={'Email'} type={'email'} component={FormInput} validator={emailValidator} />

  </div>;