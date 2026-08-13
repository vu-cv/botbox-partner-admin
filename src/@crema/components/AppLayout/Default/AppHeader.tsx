import React from 'react';
import AppLogo from '../components/AppLogo';
import AppLanguageSwitcher from '../../AppLanguageSwitcher';
import {AiOutlineMenu} from 'react-icons/ai';
import {StyledAppHeader, StyledAppHeaderSectionDesk} from './index.styled';
import {allowMultiLanguage} from '../../../constants/AppConst';

type Props = {
  onToggleSidebar: (isCollapsed: boolean) => void;
  isCollapsed: boolean;
};
const AppHeader: React.FC<Props> = ({isCollapsed, onToggleSidebar}) => {
  return (
    <StyledAppHeader>
      <a className='trigger' onClick={() => onToggleSidebar(!isCollapsed)}>
        <AiOutlineMenu />
      </a>
      <AppLogo />
      <StyledAppHeaderSectionDesk style={{marginLeft: 'auto'}}>
        {allowMultiLanguage && <AppLanguageSwitcher />}
      </StyledAppHeaderSectionDesk>
    </StyledAppHeader>
  );
};

export default AppHeader;
