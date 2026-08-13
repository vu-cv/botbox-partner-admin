import React from 'react';
import AppAnimateGroup from '@crema/components/AppAnimateGroup';
import AppInfoView from '@crema/components/AppInfoView';
import {
  StyledAuthCard,
  StyledAuthCardHeader,
  StyledAuthMainContent,
  StyledAuthWelContent,
  StyledAuthWellAction,
  StyledAuthWrap,
} from './AuthWrapper.styled';
import AppLogo from '@crema/components/AppLayout/components/AppLogo';

type Props = {
  children: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({children}) => {
  return (
    <AppAnimateGroup
      type='scale'
      animateStyle={{flex: 1}}
      delay={0}
      interval={10}
      duration={200}
    >
      <StyledAuthWrap key={'wrap'}>
        <StyledAuthCard>
          <StyledAuthMainContent>
            <StyledAuthCardHeader>
              <AppLogo />
            </StyledAuthCardHeader>
            {children}
          </StyledAuthMainContent>
          <StyledAuthWellAction>
            <StyledAuthWelContent>
              <h2>Chào mừng đến với Botbox Partner!</h2>
              <p>
                Nền tảng quản lý dành cho đối tác của Botbox — quản lý khách
                hàng, giao dịch và theo dõi hoạt động kinh doanh của bạn.
              </p>
            </StyledAuthWelContent>
          </StyledAuthWellAction>
        </StyledAuthCard>
      </StyledAuthWrap>
      <AppInfoView />
    </AppAnimateGroup>
  );
};
export default AuthWrapper;
