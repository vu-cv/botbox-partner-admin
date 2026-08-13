import styled from "styled-components";

export const StyledAppLogo = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;

  & img {
    height: 50px;
    margin-right: 10px;

    [dir="rtl"] & {
      margin-right: 0;
      margin-left: 10px;
    }
  }
`;

export const StyledAppLogoText = styled.div<{$inverse?: boolean}>`
  font-size: 20px;
  font-weight: ${({theme}) => theme.font.weight.bold};
  color: ${({$inverse, theme}) => ($inverse ? '#fff' : theme.palette.text.primary)};
  white-space: nowrap;

  & span {
    color: ${({theme}) => theme.palette.primary.main};
  }
`;
