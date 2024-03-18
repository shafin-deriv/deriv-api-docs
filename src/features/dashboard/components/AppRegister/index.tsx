import React, { useState } from 'react';
import { Button, Text, TextField } from '@deriv/quill-design';
import CustomRadioButton from '@site/src/components/CustomRadioButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './app-register.scss';
import {
  IBaseRegisterAppForm,
  TAppRegisterProps,
  TRestrictionsComponentProps,
  TTermsAndConditionsProps,
  baseAppRegisterSchema,
  error_map,
} from './types';

const TermsAndConditions: React.FC<TTermsAndConditionsProps> = ({
  setTermsConfirmation,
  terms_confirmation,
}) => {
  const handleChange = () => {
    setTermsConfirmation(true);
  };
  return (
    <div className='app_register_container__tnc'>
      <CustomRadioButton
        id='tnc_approval'
        name='tnc_approval'
        value='tnc_confirmed'
        checked={terms_confirmation}
        onChange={handleChange}
      >
        <Text size='md'>
          <span>
            By registering your application, you acknowledge that you&lsquo;ve read and accepted the
            Deriv API{' '}
          </span>
          <a
            href='https://deriv.com/tnc/business-partners-api-user.pdf'
            target='_blank'
            rel='noreferrer'
          >
            <span>terms and conditions</span>
          </a>
        </Text>
      </CustomRadioButton>
    </div>
  );
};

const RestrictionsComponent: React.FC<TRestrictionsComponentProps> = ({ error }) => {
  return (
    <div className='app_register_container__restrictions'>
      <ul>
        <li className={error === error_map.error_code_1 ? 'error' : ''}>
          {error_map.error_code_1}
        </li>
        <li className={error === error_map.error_code_2 ? 'error' : ''}>
          {error_map.error_code_2}
        </li>
        <li className={error === error_map.error_code_3 ? 'error' : ''}>
          {error_map.error_code_3}
        </li>
      </ul>
    </div>
  );
};

const AppRegister: React.FC<TAppRegisterProps> = ({ submit }) => {
  const [terms_confirmation, setTermsConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IBaseRegisterAppForm>({
    mode: 'all',
    resolver: yupResolver(baseAppRegisterSchema),
  });

  const has_error = Object.entries(errors).length !== 0;
  return (
    <form role={'form'} onSubmit={handleSubmit(submit)}>
      <div className='app_register_container'>
        <div className={`${has_error && 'error-border'} app_register_container__fields`}>
          <div className='app_register_container__fields__input'>
            <TextField
              {...register('name')}
              label={`Enter your app's name`}
              placeholder={`Enter your app's name`}
              inputSize='md'
            />
          </div>
          <div className='app_register_container__fields__button'>
            <Button
              colorStyle='coral'
              size='md'
              variant='primary'
              role='submit'
              disabled={has_error || !terms_confirmation}
            >
              Register now
            </Button>
          </div>
        </div>
        <RestrictionsComponent error={errors?.name?.message} />
        <TermsAndConditions
          setTermsConfirmation={setTermsConfirmation}
          terms_confirmation={terms_confirmation}
        />
      </div>
    </form>
  );
};

export default AppRegister;
