import * as React from 'react';
import { Field } from '@progress/kendo-react-form';
import { userNameValidator, passwordValidator,fullNameValidator,checkPassword } from './validators';
import { FormInput } from './form-components';

export const PersonalDetails3 = <div> 
    <Field key={'userName'} id={'userName'} name={'userName'} label={'Tên đăng nhập'} component={FormInput} validator={userNameValidator} />
    <Field key={'fullName'} id={'fullName'} name={'fullName'} label={'Họ và tên đầy đủ'} component={FormInput} validator={fullNameValidator} /> 
    <Field key={'password'} id={'password'} name={'password'} label={'Nhập mật khẩu'} type={'password'} component={FormInput} validator={passwordValidator} />
    <Field key={'checkPassword'} id={'checkPassword'} name={'checkPassword'} label={'Nhập lại mật khẩu'} type={'password'} component={FormInput}  validator={checkPassword}/>
  </div>;