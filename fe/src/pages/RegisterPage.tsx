import { Input, Button, Form, Typography, notification } from "antd";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { register, SignUpDTO } from "../apis/auth.api";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("/landing-page.jpg");
  background-size: cover;
  background-position: center;
  padding: 0 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0px 40px 20px 40px;
  border-radius: 15px;
  width: 450px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled(Typography.Title)`
  text-align: center;
  color: #333;
`;

const FormWrapper = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const CustomButton = styled(motion.create(Button))`
  background-color: #ffcc00;
  border-color: #ffcc00;
  color: black;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: linear-gradient(to right, #ffcc00, #ff6600) !important;
    border-color: #ff6600 !important;
    color: white !important;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const SocialIcon = styled.a`
  font-size: 20px;
  color: #333;
  transition: 0.3s ease;

  &:hover {
    color: #ff6600;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 10px;
`;

export const RegisterPage = () => {
  const [form] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: (formData: SignUpDTO) => {
      return register(formData);
    },
  });

  const onFinish = (body: any) => {
    registerMutation.mutate(body, {
      onSuccess() {
        notification.success({
          message: "Registration Successful",
          description: "Your account has been created successfully. Please log in to continue.",
        });
      },
      onError(data: any) {
        console.log(data);
        notification.error({
          message: "Registration Failed",
          description: data.data?.message || "An error occurred during registration. Please try again.",
        });
      },
    });
  };

  return (
    <Wrapper>
      <FormContainer>
        <div>
          <Title level={2}>Create an Account</Title>
          <Typography.Paragraph style={{ textAlign: "center", fontSize: "18px" }}>
            Join us and explore the world of music!
          </Typography.Paragraph>

          <FormWrapper form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Username" name="username" required>
              <Input placeholder="Enter your username" />
            </Form.Item>
            <Form.Item label="Email" name="email" required>
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              required
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  pattern: /^\d+$/, // Số điện thoại chỉ chứa các chữ số
                  message: "Please enter a valid phone number (only numbers allowed).",
                },
              ]}
            >
              <Input placeholder="Enter your phone" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              required
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, // Password rule: at least 1 uppercase, 1 number, 1 special character
                  message: "Password must be at least 8 characters, contain an uppercase letter, a number, and a special character.",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              required
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                {
                  validator: (_, value) =>
                    value && value !== form.getFieldValue("password")
                      ? Promise.reject("The two passwords do not match!")
                      : Promise.resolve(),
                },
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <CustomButton
                type="primary"
                htmlType="submit"
                block
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register
              </CustomButton>
            </Form.Item>
          </FormWrapper>

          <SocialIcons>
            <SocialIcon href="https://facebook.com" target="_blank">
              <i className="fab fa-facebook" />
            </SocialIcon>
            <SocialIcon href="https://apple.com" target="_blank">
              <i className="fab fa-apple" />
            </SocialIcon>
            <SocialIcon href="https://google.com" target="_blank">
              <i className="fab fa-google" />
            </SocialIcon>
          </SocialIcons>

          <Footer>
            <Typography.Text>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#ff6600" }}>
                Login here
              </a>
            </Typography.Text>
          </Footer>
        </div>
      </FormContainer>
    </Wrapper>
  );
};
