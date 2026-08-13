import React from 'react';
import {useSidebarContext} from '@crema/context/AppContextProvider/SidebarContextProvider';
import {StyledAppLogo, StyledAppLogoText} from './index.styled';

type AppLogoProps = {
  hasSidebarColor?: boolean;
};
const AppLogo: React.FC<AppLogoProps> = ({hasSidebarColor}) => {
  const {sidebarColorSet} = useSidebarContext();
  const isDark = hasSidebarColor && sidebarColorSet.mode === 'dark';
  return (
    <StyledAppLogo>
      <StyledAppLogoText $inverse={isDark}>
        Botbox<span>Partner</span>
      </StyledAppLogoText>
    </StyledAppLogo>
  );
};

export default AppLogo;
