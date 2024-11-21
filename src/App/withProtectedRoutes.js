// Copyright (C) 2017-2023 Smart code 203358507

// const React = require('react');
// const { Intro } = require('stremio/routes');
// const { useProfile } = require('stremio/common');
//
// const withProtectedRoutes = (Component) => {
//     return function withProtectedRoutes(props) {
//         const profile = useProfile();
//
//         console.log(profile);
//
//         const previousAuthRef = React.useRef(profile.auth);
//         React.useEffect(() => {
//             if (previousAuthRef.current !== null && profile.auth === null) {
//                 window.location = '#/intro';
//             }
//             previousAuthRef.current = profile.auth;
//         }, [profile]);
//         const onRouteChange = React.useCallback((routeConfig) => {
//             if (profile.auth !== null && routeConfig.component === Intro) {
//                 window.location.replace('#/');
//                 return true;
//             }
//         }, [profile]);
//         return (
//             <Component {...props} onRouteChange={onRouteChange} />
//         );
//     };
// };
//
// module.exports = withProtectedRoutes;


const React = require('react');
const { onAuthStateChanged } = require('firebase/auth');
const auth = require('../firebase');
const { Intro } = require('stremio/routes');
const { useProfile } = require('stremio/common');

const withProtectedRoutes = (Component) => {
    return function withProtectedRoutes(props) {

        const profile = useProfile();
        // console.log(profile);
        const previousAuthRef = React.useRef(profile.auth);

        const location = window.location.hash;


        // React.useEffect(() => {
        //     if (previousAuthRef.current !== null && profile.auth === null) {
        //         window.location = '#/intro';
        //     }
        //     previousAuthRef.current = profile.auth;
        // }, [profile]);

        React.useEffect(() => {
            onAuthStateChanged(auth.default, (user) => {

                // console.log(user);

                if (user) {
                    if (location === '#/intro') {
                        window.location = '';
                    }
                } else {
                    if (location !== '#/intro') {
                        window.location = '/#/intro';
                    }
                }
                // setLoading(false);
            });

            previousAuthRef.current = profile.auth;

        }, [profile]);



        const onRouteChange = React.useCallback((routeConfig) => {
            // if (profile.auth !== null && routeConfig.component === Intro) {
            //     window.location.replace('#/');
            //     return true;
            // }
            onAuthStateChanged(auth.default, (user) => {
                if (user) {
                    if (location === '#/intro') {
                        window.location = '';
                    }
                } else {
                    if (location !== '#/intro') {
                        window.location = '/#/intro';
                    }
                }
            });

        }, [profile]);







        return (
            <Component {...props} onRouteChange={onRouteChange} />
        );
    };
};

module.exports = withProtectedRoutes;


// src/withProtectedRoutes.js
// const { React, useEffect, useState } = require('react');
// const { onAuthStateChanged } = require('firebase/auth');
// const auth = require('../firebase');
//
// const withProtectedRoutes = (Component) => {
//     return (props) => {
//         const [loading, setLoading] = useState(true);
//
//         const location = window.location.hash;
//
//         useEffect(() => {
//             const unsubscribe = onAuthStateChanged(auth.default, (user) => {
//
//                 console.log(user);
//
//                 if (user) {
//                     if (location === '#/intro') {
//                         window.location = '/#/intro';
//                     }
//                 } else {
//                     if (location !== '#/intro') {
//                         window.location = '/#/intro';
//                     }
//                 }
//                 setLoading(false);
//             });
//
//             return () => unsubscribe();
//         }, [location]);
//
//         // if (loading) {
//         //     return <div>Loading...</div>;
//         // }
//
//         // return <Component {...props} />;
//     };
// };
//
// module.exports = withProtectedRoutes;
