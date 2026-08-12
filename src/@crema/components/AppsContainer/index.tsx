import React, { CSSProperties, ReactNode, useState } from "react";
import AppInfoView from "../AppInfoView";
import AppSidebar from "./AppSidebar";
import clsx from "clsx";
import { MenuOutlined } from "@ant-design/icons";
import { useLayoutContext } from "@crema/context/AppContextProvider/LayoutContextProvider";
import {
  StyledAppContainer,
  StyledAppWrap,
  StyledAppWrapHeader,
  StyledMainContent,
  StyledMainContentCard,
  StyledMenuBtn,
} from "./index.styled";
import { motion, AnimatePresence } from "framer-motion";

interface AppsContainerProps {
  title: string | ReactNode;
  type?: any;
  noContentAnimation?: boolean;
  fullView?: boolean;
  sidebarContent?: ReactNode;
  children: ReactNode;
  cardStyle?: CSSProperties;
}
const AppsContainer: React.FC<AppsContainerProps> = ({
  title = "",
  noContentAnimation = false,
  sidebarContent,
  fullView,
  children,
  type,
  cardStyle,
}) => {
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const { footer, navStyle } = useLayoutContext();

  return (
    <StyledAppWrap>
      <StyledAppWrapHeader
        className={clsx({
          appsWrapHeaderFull: fullView,
        })}
      >
        {fullView ? null : (
          <StyledMenuBtn onClick={() => setAppDrawerOpen(!isAppDrawerOpen)}>
            <MenuOutlined className="menu-btn-icon" />
          </StyledMenuBtn>
        )}
        <AnimatePresence style={{ zIndex: 3, overflow: "hidden" }} type="scale">
          <motion.h2 className="text-truncate" key="title">
            {title}
          </motion.h2>
        </AnimatePresence>
      </StyledAppWrapHeader>

      <StyledAppContainer>
        {sidebarContent ? (
          <AnimatePresence style={{ zIndex: 3 }} type={type ? type : "left"}>
            <motion.div>
              <AppSidebar
                isAppDrawerOpen={isAppDrawerOpen}
                setAppDrawerOpen={setAppDrawerOpen}
                footer={footer}
                fullView={fullView}
                navStyle={navStyle}
                sidebarContent={sidebarContent}
                key="sidebar"
              />
            </motion.div>
          </AnimatePresence>
        ) : null}
        <StyledMainContent
          className={clsx({
            appsMainContentFull: fullView,
          })}
        >
          {noContentAnimation ? (
            <StyledMainContentCard
              bordered={false}
              key="content"
              style={{
                ...cardStyle,
                borderRadius: 16,
              }}
            >
              {children}
            </StyledMainContentCard>
          ) : (
            <AnimatePresence
              type={type ? type : "right"}
              style={{ minHeight: "100%" }}
            >
              <motion.div>
                <StyledMainContentCard
                  bordered={false}
                  key="content"
                  style={{
                    ...cardStyle,
                    borderRadius: 16,
                  }}
                >
                  {children}
                </StyledMainContentCard>
              </motion.div>
            </AnimatePresence>
          )}

          <AppInfoView />
        </StyledMainContent>
      </StyledAppContainer>
    </StyledAppWrap>
  );
};

export default AppsContainer;
