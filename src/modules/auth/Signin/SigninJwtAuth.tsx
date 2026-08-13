import { Checkbox, Form, Input } from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useAuthMethod } from "@crema/hooks/AuthHooks";
import {
  SignInButton,
  StyledRememberMe,
  StyledSign,
  StyledSignContent,
  StyledSignForm,
} from "./index.styled";
import type { SignInProps } from "@crema/services/auth/jwt-auth/JWTAuthProvider";

const SignInJwtAuth = () => {
  const { signInUser } = useAuthMethod();
  const { messages } = useIntl();

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <StyledSign>
      <StyledSignContent>
        <StyledSignForm
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={(values) => signInUser(values as SignInProps)}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            className="form-field"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input placeholder={messages["common.email"] as string} />
          </Form.Item>

          <Form.Item
            name="password"
            className="form-field"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              placeholder={messages["common.password"] as string}
            />
          </Form.Item>

          <StyledRememberMe>
            <Checkbox>
              <IntlMessages id="common.rememberMe" />
            </Checkbox>
          </StyledRememberMe>

          <div className="form-btn-field">
            <SignInButton type="primary" htmlType="submit">
              <IntlMessages id="common.login" />
            </SignInButton>
          </div>
        </StyledSignForm>
      </StyledSignContent>
    </StyledSign>
  );
};

export default SignInJwtAuth;
