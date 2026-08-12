import React from 'react';
import {Navigate} from 'react-router-dom';

import {authRouteConfig} from "./AuthRoutes";
import Error403 from "../../../modules/errorPages/Error403";
import {errorPagesConfigs} from "./ErrorPagesRoutes";
import {accountPagesConfigs} from "./AccountRoutes";
import {initialUrl} from "@crema/constants/AppConst";
import {samplePagesConfigs} from "./SamplePages.tsx";

const authorizedStructure = {
    fallbackPath: '/signin',
    unAuthorizedComponent: <Error403/>,
    routes: [
        ...samplePagesConfigs,
        ...accountPagesConfigs,
    ],
};

const publicStructure = {
    fallbackPath: initialUrl,
    routes: authRouteConfig,
};
const anonymousStructure = {
    routes: errorPagesConfigs.concat([
        {
            path: '/',
            element: <Navigate to={initialUrl}/>,
        },
        {
            path: '*',
            element: <Navigate to='/error-pages/error-404'/>,
        },
    ]),
};

export {authorizedStructure, publicStructure, anonymousStructure};
