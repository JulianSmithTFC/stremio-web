// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Modal, useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { Button, Image, useBinaryState } = require('stremio/common');
const CredentialsTextInput = require('./CredentialsTextInput');
const ConsentCheckbox = require('./ConsentCheckbox');
const PasswordResetModal = require('./PasswordResetModal');
// const useFacebookLogin = require('./useFacebookLogin');
const styles = require('./styles');

const auth = require('../../firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');

// import { auth } from '../../firebase';

const SIGNUP_FORM = 'signup';
const LOGIN_FORM = 'login';

const Intro = ({ queryParams }) => {
    const { core } = useServices();
    const { t } = useTranslation();
    const routeFocused = useRouteFocused();
    // const [startFacebookLogin, stopFacebookLogin] = useFacebookLogin();
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const confirmPasswordRef = React.useRef(null);
    const termsRef = React.useRef(null);
    const privacyPolicyRef = React.useRef(null);
    const marketingRef = React.useRef(null);
    const errorRef = React.useRef(null);
    const [passwordRestModalOpen, openPasswordRestModal, closePasswordResetModal] = useBinaryState(false);
    const [loaderModalOpen, openLoaderModal, closeLoaderModal] = useBinaryState(false);


    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'set-form':
                    if (state.form !== action.form) {
                        return {
                            form: action.form,
                            email: '',
                            password: '',
                            confirmPassword: '',
                            error: ''
                        };
                    }
                    return state;
                case 'change-credentials':
                    return {
                        ...state,
                        error: '',
                        [action.name]: action.value
                    };
                case 'toggle-checkbox':
                    return {
                        ...state,
                        error: '',
                        [action.name]: !state[action.name]
                    };
                case 'error':
                    return {
                        ...state,
                        error: action.error
                    };
                default:
                    return state;
            }
        },
        {
            form: [LOGIN_FORM, SIGNUP_FORM].includes(queryParams.get('form')) ? queryParams.get('form') : LOGIN_FORM,
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        }
    );


    // const loginWithFacebook = React.useCallback(() => {
    //     openLoaderModal();
    //     startFacebookLogin()
    //         .then(({ email, password }) => {
    //             core.transport.dispatch({
    //                 action: 'Ctx',
    //                 args: {
    //                     action: 'Authenticate',
    //                     args: {
    //                         type: 'Login',
    //                         email,
    //                         password,
    //                         facebook: true
    //                     }
    //                 }
    //             });
    //         })
    //         .catch((error) => {
    //             closeLoaderModal();
    //             dispatch({ type: 'error', error: error.message });
    //         });
    // }, []);
    // const cancelLoginWithFacebook = React.useCallback(() => {
    //     stopFacebookLogin();
    //     closeLoaderModal();
    // }, []);


    const loginWithEmail = React.useCallback(async () => {

        if (typeof state.email !== 'string' || state.email.length === 0 || !emailRef.current.validity.valid) {
            dispatch({ type: 'error', error: 'Invalid email' });
            return;
        }
        if (typeof state.password !== 'string' || state.password.length === 0) {
            dispatch({ type: 'error', error: 'Invalid password' });
            return;
        }
        openLoaderModal();

        try {
            const userCredential = await signInWithEmailAndPassword(auth.default, state.email, state.password);
            console.log(userCredential);
            // alert("Logged in successfully!");
            window.location = '';
            closeLoaderModal();
        } catch (error) {
            closeLoaderModal();
            dispatch({ type: 'error', error: error.message });
        }

    }, [state.email, state.password]);

    const signup = React.useCallback(async () => {
        if (typeof state.email !== 'string' || state.email.length === 0 || !emailRef.current.validity.valid) {
            dispatch({ type: 'error', error: 'Invalid email' });
            return;
        }
        if (typeof state.password !== 'string' || state.password.length === 0) {
            dispatch({ type: 'error', error: 'Invalid password' });
            return;
        }
        if (state.password !== state.confirmPassword) {
            dispatch({ type: 'error', error: 'Passwords do not match' });
            return;
        }

        openLoaderModal();

        // console.log(state.email);
        // console.log(state.password);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth.default, state.email, state.password);
            console.log(userCredential);
            // alert("Signed up successfully!");
            window.location = '';
            closeLoaderModal();
        } catch (error) {
            closeLoaderModal();
            dispatch({ type: 'error', error: 'Failed to Create User - Fuck You I Guess...' });
            console.log("failed");
        }

    }, [state.email, state.password, state.confirmPassword]);


    const emailOnChange = React.useCallback((event) => {
        dispatch({
            type: 'change-credentials',
            name: 'email',
            value: event.currentTarget.value
        });
    }, []);


    const emailOnSubmit = React.useCallback(() => {
        passwordRef.current.focus();
    }, []);


    const passwordOnChange = React.useCallback((event) => {
        dispatch({
            type: 'change-credentials',
            name: 'password',
            value: event.currentTarget.value
        });
    }, []);


    const passwordOnSubmit = React.useCallback(() => {
        if (state.form === SIGNUP_FORM) {
            confirmPasswordRef.current.focus();
        } else {
            loginWithEmail();
        }
    }, [state.form, loginWithEmail]);


    const confirmPasswordOnChange = React.useCallback((event) => {
        dispatch({
            type: 'change-credentials',
            name: 'confirmPassword',
            value: event.currentTarget.value
        });
    }, []);


    const confirmPasswordOnSubmit = React.useCallback(() => {
        termsRef.current.focus();
    }, []);


    const switchFormOnClick = React.useCallback(() => {
        const queryParams = new URLSearchParams([['form', state.form === SIGNUP_FORM ? LOGIN_FORM : SIGNUP_FORM]]);
        window.location = `#/intro?${queryParams.toString()}`;
    }, [state.form]);


    React.useEffect(() => {
        if ([LOGIN_FORM, SIGNUP_FORM].includes(queryParams.get('form'))) {
            dispatch({ type: 'set-form', form: queryParams.get('form') });
        }
    }, [queryParams]);


    React.useEffect(() => {
        if (routeFocused && typeof state.error === 'string' && state.error.length > 0) {
            errorRef.current.scrollIntoView();
        }
    }, [state.error]);


    React.useEffect(() => {
        if (routeFocused) {
            emailRef.current.focus();
        }
    }, [state.form, routeFocused]);


    React.useEffect(() => {
        const onCoreEvent = ({ event, args }) => {
            switch (event) {
                case 'UserAuthenticated': {
                    closeLoaderModal();
                    if (routeFocused) {
                        window.location = '#/';
                    }
                    break;
                }
                case 'Error': {
                    if (args.source.event === 'UserAuthenticated') {
                        closeLoaderModal();
                    }

                    break;
                }
            }
        };
        core.transport.on('CoreEvent', onCoreEvent);
        return () => {
            core.transport.off('CoreEvent', onCoreEvent);
        };
    }, [routeFocused]);

    // Function to toggle between signup and login forms
    const toggleForm = React.useCallback(() => {
        dispatch({
            type: 'set-form',
            form: state.form === SIGNUP_FORM ? LOGIN_FORM : SIGNUP_FORM
        });
    }, [state.form]);

    return (
        <div className={styles['intro-container']}>
            <div className={styles['background-container']} />
            <div className={styles['heading-container']}>
                <div className={styles['logo-container']}>
                    <Image className={styles['logo']} src={require('/images/logo.png')} alt={' '} />
                </div>
                <div className={styles['title-container']}>
                    Freedom to Fuck & Stream
                </div>
                <div className={styles['slogan-container']}>
                    All the Video Content You Enjoy in One Place
                </div>
            </div>
            <div className={styles['content-container']}>
                <div className={styles['form-container']}>
                    <CredentialsTextInput
                        ref={emailRef}
                        className={styles['credentials-text-input']}
                        type={'email'}
                        placeholder={'Email'}
                        value={state.email}
                        onChange={emailOnChange}
                        onSubmit={emailOnSubmit}
                    />
                    <CredentialsTextInput
                        ref={passwordRef}
                        className={styles['credentials-text-input']}
                        type={'password'}
                        placeholder={'Password'}
                        value={state.password}
                        onChange={passwordOnChange}
                        onSubmit={passwordOnSubmit}
                    />
                    {
                        state.form === SIGNUP_FORM ?
                            <React.Fragment>
                                <CredentialsTextInput
                                    ref={confirmPasswordRef}
                                    className={styles['credentials-text-input']}
                                    type={'password'}
                                    placeholder={'Confirm Password'}
                                    value={state.confirmPassword}
                                    onChange={confirmPasswordOnChange}
                                    onSubmit={confirmPasswordOnSubmit}
                                />
                            </React.Fragment>
                            :
                            <div className={styles['forgot-password-link-container']}>
                                <Button className={styles['forgot-password-link']} onClick={openPasswordRestModal}>Forgot password?</Button>
                            </div>
                    }
                    {
                        state.error.length > 0 ?
                            <div ref={errorRef} className={styles['error-message']}>{state.error}</div>
                            :
                            null
                    }
                    <br/>
                    {/*<Button className={classnames(styles['form-button'], styles['submit-button'])} onClick={state.form === SIGNUP_FORM ? signup : loginWithEmail}>*/}
                    {/*    <div className={styles['label']}>{state.form === SIGNUP_FORM ? 'Sign up' : 'Log in'}</div>*/}
                    {/*</Button>*/}
                    <Button className={classnames(styles['form-button'], styles['submit-button'])} onClick={state.form === SIGNUP_FORM ? signup : loginWithEmail}>
                        <div className={styles['label']}>Log in</div>
                    </Button>
                    {/* Toggle button */}
                    {/*<Button*/}
                    {/*    className={classnames(styles['form-button'], styles['toggle-button'])}*/}
                    {/*    onClick={toggleForm}>*/}
                    {/*    {state.form === SIGNUP_FORM*/}
                    {/*        ? 'Already have an account? Log in'*/}
                    {/*        : "Don't have an account? Sign up"}*/}
                    {/*</Button>*/}
                </div>
            </div>
            {
                passwordRestModalOpen ?
                    <PasswordResetModal email={state.email} onCloseRequest={closePasswordResetModal} />
                    :
                    null
            }
            {
                loaderModalOpen ?
                    <Modal className={styles['loading-modal-container']}>
                        <div className={styles['loader-container']}>
                            <Icon className={styles['icon']} name={'person'} />
                            <div className={styles['label']}>Authenticating...</div>
                        </div>
                    </Modal>
                    :
                    null
            }
        </div>
    );
};

Intro.propTypes = {
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Intro;
