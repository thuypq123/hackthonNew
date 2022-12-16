import * as React from 'react';
import './register.css'
import { Form, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Stepper } from '@progress/kendo-react-layout';
import { PersonalDetails1 } from './personal-details1';
import { PersonalDetails3 } from './personal-details3';
import registerPanner from "../../Images/registerPanner.jpg"
import { useCallback } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { JSEncrypt } from "jsencrypt";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useEffect } from 'react';
import { Getkey } from '../../getkey.js';
import Navbar from '../../components/navbar/Navbar';

const stepPages = [PersonalDetails1, PersonalDetails3];

function MainRegister() {

  const milliseconds = new Date();
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState({});
  const [getKey, setGetKey] = useState("")
  const [email, setEmail] = useState()
  const navigate = useNavigate();
  const url = "http://localhost:3000/register";

  let config = {
    "headers": {
      "accept": "application/json",
      "Content-Type": "application/json",
    }
  }

  // Get key
  
  useEffect(() => {
    Getkey().then(data => setGetKey(data))
  }, []);

  // get data
  function setDataSubmit(value) {
    const values = {
      data: {
        credential: encrypted(value),
        email: value.email,
        username: value.userName,
        fullName: value.fullName,
        password: value.password,
        identityNumber: value.identityNumber,
        key: getKey,
        phone: value.phone
      },
      request: {
        requestId: uuidv4(),
        requestTime: milliseconds.getTime(),
      }
    }
    return values;
  }
  // Ma hoa RSA 
  var encrypt = new JSEncrypt();
  const encrypted = (value) => {
    encrypt.setPublicKey(getKey)
    var json = JSON.stringify({ username: value.userName, password: value.password })
    var encrypted = encrypt.encrypt(json);
    return encrypted;
  }


  // end ma hoa RSA

  const [steps, setSteps] = useState([
    {
      label: 'Thông tin cá nhân',
      isValid: undefined,
    },

    {
      label: 'Thông tin cá nhân',
      isValid: undefined,
    }
  ]);
  const lastStepIndex = steps.length - 1;
  const isLastStep = lastStepIndex === step;
  const isPreviousStepsValid =
    steps
      .slice(0, step)
      .findIndex((currentStep) => currentStep.isValid === false) === -1;
  const onStepSubmit = useCallback(
    async (event) => {

      const { isValid, values } = event;
      const currentSteps = steps.map((currentStep, index) => ({
        ...currentStep,
        isValid: index === step ? isValid : currentStep.isValid,
      }));
      setSteps(currentSteps);
      setStep(() => Math.min(step + 1, lastStepIndex));
      setFormState(values);
      setEmail(values.email)
      if (isLastStep && isPreviousStepsValid && isValid) {
        axios.post(url, JSON.stringify(setDataSubmit(values)), config)
          .then(res => {
            console.log("Posting data", res.data.response.responseCode)
            if (res.data.response.responseCode !== '00') {
              alert(res.data.response.responseMessage)
            } else {
              console.log(setDataSubmit(values))
              window.location.replace("/verify_user")
              navigate("/verify_user", { state: {data:email} });
            }
          }).catch(error => console.log(error))


      }
    },
    [steps, isLastStep, isPreviousStepsValid, step, lastStepIndex]
  );


  const onPrevClick = useCallback(
    (event) => {
      event.preventDefault();
      setStep(() => Math.max(step - 1, 0));
    },
    [step, setStep]
  );
  return (
    <>
      <div className='registerPage'>
        <div className="registerContainer">
          <img src={registerPanner} alt="" className='registerPanner' />
          <div className='registerWrapper' >
            <h1 className='registerH1'>Đăng ký mở tài khoản thanh toán trực tuyến</h1>
            <Stepper value={step} items={steps} className="stepper" />
            <Form
              initialValues={formState}
              onSubmitClick={onStepSubmit}
              render={(formRenderProps) => (
                <div
                  style={{
                    alignSelf: 'center',
                  }}
                >
                  <FormElement
                    style={{
                      width: 480,

                    }}
                  >
                    {stepPages[step]}
                    <span
                      style={{
                        marginTop: '40px',
                      }}
                      className={'k-form-separator'}
                    />
                    <div
                      style={{
                        justifyContent: 'space-between',
                        alignContent: 'center',
                      }}
                      className={
                        'k-form-buttons k-button k-button-md k-rounded-md k-button-solid k-button-solid-bases-end'
                      }
                    >
                      <div className='registerButton'>
                        {step !== 0 ? (
                          <Button
                            className='btnRgButton btnPrevious'
                            onClick={onPrevClick}
                          >
                            Quay lại
                          </Button>
                        ) : undefined}
                        <Button
                          className='btnRgButton btnRgSubmit'
                          disabled={isLastStep ? !isPreviousStepsValid : false}
                          onClick={formRenderProps.onSubmit}
                        >
                          {isLastStep ? 'Đăng ký' : 'Tiếp theo'}
                        </Button>
                      </div>
                    </div>
                  </FormElement>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default MainRegister
