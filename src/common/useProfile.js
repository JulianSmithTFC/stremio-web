// Copyright (C) 2017-2023 Smart code 203358507

const auth = require('../firebase');
const useModelState = require('stremio/common/useModelState');

const map = (ctx) => ({
    ...ctx.profile,
    settings: {
        ...ctx.profile.settings,
        streamingServerWarningDismissed: new Date(
            typeof ctx.profile.settings.streamingServerWarningDismissed === 'string' ?
                ctx.profile.settings.streamingServerWarningDismissed
                :
                NaN
        )
    }
});

const useProfile = () => {
    const profile = useModelState({ model: 'ctx', map });
    profile.auth = auth.default.currentUser;
    // console.log(profile);
    return profile;
};

module.exports = useProfile;
