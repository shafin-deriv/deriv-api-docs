import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appEditSchema, IRegisterAppForm } from '../../types';
import CustomCheckbox from '@site/src/components/CustomCheckbox';
import { Button, Heading, Text, TextField, SectionMessage } from '@deriv-com/quill-ui';

import { RestrictionsComponent } from '../../components/AppRegister';
import StepperTextField from '../../components/StepperTextField';

import './app-update-form.scss';

type TAppFormProps = {
  initialValues?: Partial<IRegisterAppForm>;
  submit: (data: IRegisterAppForm) => void;
  onCancel?: () => void;
  is_loading?: boolean;
};

const Explanations: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className='app_register_container__restrictions'>{children}</div>;
};

const UnderlinedLink: React.FC<{ text: string; linkTo: string }> = ({ text, linkTo }) => {
  return (
    <a className='underlined_link' href={linkTo}>
      {text}
    </a>
  );
};

const AppUpdateForm = ({ initialValues, submit, onCancel, is_loading }: TAppFormProps) => {
  const methods = useForm<IRegisterAppForm>({
    mode: 'all',
    criteriaMode: 'firstError',
    resolver: yupResolver(appEditSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  return (
    <div className='update_form'>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className='formContent'>
          <div>
            <Heading.H5>App’s name</Heading.H5>
            <Text size='md' className='mb'>
              The name of the application that you want to register.
            </Text>

            <TextField
              {...register('name')}
              label='App’s name'
              placeholder='App’s name'
              inputSize='md'
              variant='outline'
              value={initialValues?.name}
            />
            {errors?.name && errors?.name?.type === 'required' && (
              <span className='error-message'>{errors.name?.message}</span>
            )}
            <RestrictionsComponent error={errors?.name?.message} />
          </div>

          <Heading.H5 className='mst'>Markup</Heading.H5>
          <Text size='md'>
            You can earn commission by adding a markup to the price of each trade. Enter your markup
            percentage here. Learn more about markup calculations in our detailed{' '}
            <UnderlinedLink text='documentation' linkTo={'/docs/intro/'} />.
          </Text>
          <SectionMessage
            message={`Markup is only available for real accounts and it's only needed for applications that allow trading.`}
            size='md'
            status='info'
            className='mblk'
          />
          <StepperTextField
            name='app_markup_percentage'
            handleOnMinusClick={() => {
              setValue(
                'app_markup_percentage',
                Number((Number(getValues('app_markup_percentage')) - 0.1).toFixed(2)),
                {
                  shouldValidate: true,
                },
              );
            }}
            handleOnPlusClick={() => {
              setValue(
                'app_markup_percentage',
                Number((Number(getValues('app_markup_percentage')) + 0.1).toFixed(2)),
                {
                  shouldValidate: true,
                },
              );
            }}
            min={0}
            max={3}
            error={errors?.app_markup_percentage}
          />
          {errors?.app_markup_percentage && (
            <span className='error-message'>{errors.app_markup_percentage?.message}</span>
          )}

          <Heading.H5 className='mst mb'>OAuth settings</Heading.H5>
          <Text size='md'>
            Log in to your app using your Deriv account without an API token. Set up your OAuth
            application easily with our step-by-step{' '}
            <UnderlinedLink text='guide' linkTo={'/docs/guides/oauth2/'} />.
          </Text>
          <SectionMessage
            message={
              <ul className='update_form__oauth_info'>
                <li>Use OAuth if you have an application which you want other users sign in to.</li>
                <li>Authorization URL is mandatory to enable OAuth on your app.</li>
              </ul>
            }
            size='md'
            status='info'
            className='mblk'
          />
          <div className='update_form__oauth_container'>
            <div>
              <Heading.H5 className='mblk'>URL Configuration</Heading.H5>
              <Text size='md' className='formsubHeading mb'>
                To enable OAuth on your app, you must provide specific URLs for user redirection
                after authorisation and, optionally, for email verification.
              </Text>
            </div>

            <div>
              <TextField
                {...register('redirect_uri')}
                id='app_redirect_uri'
                label='Authorisation URL'
                placeholder='Authorisation URL'
                inputSize='md'
                variant='outline'
                className='uri_input'
                value={initialValues?.redirect_uri}
              />
              {errors && errors?.redirect_uri && (
                <span className='error-message'>{errors.redirect_uri?.message}</span>
              )}
            </div>

            <div>
              <Text size='md' className='formsubHeading mblk'>
                Enter the URL for email verification processes if you have implemented verification
                logic in your app (e.g., account opening verification, password reset):
              </Text>
              <TextField
                {...register('verification_uri')}
                id='app_verification_uri'
                label='Verification URL (optional)'
                placeholder='Verification URL (optional)'
                inputSize='md'
                variant='outline'
                className='uri_input'
                value={initialValues?.verification_uri}
              />
              {errors && errors.verification_uri && (
                <span className='error-message'>{errors.verification_uri.message}</span>
              )}
              <Explanations>
                If provided, the Verification URL will be appended with a token and sent to the
                user&apos;s email. Otherwise, the Authorization URL with the token will be used.
              </Explanations>
            </div>

            <div className='scopes' id='register_scopes'>
              <div>
                <div className='formHeaderContainer mb'>
                  <Heading.H5>Scopes of authorisation</Heading.H5>
                  <Text size='md' className='formsubHeading'>
                    Select the scope for your app:
                  </Text>
                </div>
              </div>

              <div className='scopesWrapper'>
                <div className='customCheckboxWrapper'>
                  <CustomCheckbox name='read' id='read-scope' register={register('read')}>
                    <label htmlFor='read-scope'>
                      <b>Read</b>: You&apos;ll have full access to your clients&apos; information.
                    </label>
                  </CustomCheckbox>
                </div>
                <div className='customCheckboxWrapper'>
                  <CustomCheckbox name='trade' id='trade-scope' register={register('trade')}>
                    <label htmlFor='trade-scope'>
                      <b>Trade</b>: You&apos;ll be able to buy and sell contracts on your
                      clients&apos; behalf.
                    </label>
                  </CustomCheckbox>
                </div>
                <div className='customCheckboxWrapper'>
                  <CustomCheckbox
                    name='trading_information'
                    id='trading_information-scope'
                    register={register('trading_information')}
                  >
                    <label htmlFor='trading_information-scope'>
                      <b>Trading information</b>: You&lsquo;ll be able to view your clients&rsquo;
                      trading information, including their account balance.
                    </label>
                  </CustomCheckbox>
                </div>
                <div className='customCheckboxWrapper'>
                  <CustomCheckbox
                    name='payments'
                    id='payments-scope'
                    register={register('payments')}
                  >
                    <label htmlFor='payments-scope'>
                      <b>Payments</b>: You&lsquo;ll be able to perform deposits and withdrawals on
                      your clients&rsquo; behalf.
                    </label>
                  </CustomCheckbox>
                </div>
                <div className='customCheckboxWrapper mb-0'>
                  <CustomCheckbox name='admin' id='admin-scope' register={register('admin')}>
                    <label htmlFor='admin-scope'>
                      <b>Admin</b>: Full account access, including the access to manage security
                      tokens.
                    </label>
                  </CustomCheckbox>
                </div>

                <SectionMessage
                  message={`Grant admin access only when it’s essential for your app's workflow.`}
                  size='md'
                  status='warning'
                  className='mblk'
                />
              </div>
            </div>
          </div>

          <div className='update_form__fields_button'>
            <Button
              size='lg'
              variant='secondary'
              color='black'
              type='button'
              onClick={onCancel}
              label='Cancel'
            />

            <Button
              size='lg'
              variant='primary'
              role='submit'
              disabled={is_loading}
              label='Update application'
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AppUpdateForm;
