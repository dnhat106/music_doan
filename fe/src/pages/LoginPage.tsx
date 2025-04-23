import { Input, Button, Form, Typography, notification } from "antd";
import styled from "styled-components";
import { motion } from "framer-motion"; // Import framer-motion
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login, SignInDTO } from "../apis/auth.api";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("/landing-page.jpg");
  background-size: cover;
  background-position: center;
  padding: 0 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  width: 140vh;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled(Typography.Title)`
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
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
    border-color: #ffbb33 !important;
    color: white !important;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
  font-size: 18px;
`;

const SocialIcon = styled.div`
  cursor: pointer;
`;

const MusicImage = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  align-items: center;
`;

const MusicImageWrapper = styled.img`
  width: 600px;
  height: auto;
`;

export const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (formData: SignInDTO) => {
      return login(formData);
    },
  });

  const onfinish = (body: any) => {
    loginMutation(body, {
      onSuccess(data) {
        notification.success({
          message: "Login Successful",
          description: "Welcome back! You have successfully logged in.",
        });
        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(data.data.user));
        navigate("/");
      },
      onError(data) {
        console.log(data);
        notification.error({
          message: "Login Failed",
          description: "An error occurred while logging in. Please try again.",
        });
      },
    });
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <Wrapper>
      <FormContainer>
        <div>
          <Title level={1}>Welcome to the world</Title>
          <Typography.Paragraph
            style={{ textAlign: "center", fontSize: "18px" }}
          >
            of our cherished music!
          </Typography.Paragraph>

          <FormWrapper form={form} layout="vertical" onFinish={onfinish}>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <CustomButton
                type="primary"
                htmlType="submit"
                loading={isPending}
                block
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </CustomButton>
            </Form.Item>

            {/* Thêm nút Đăng ký */}
            <Form.Item>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="default"
                  onClick={handleRegister}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontWeight: "500",
                    backgroundColor: "#ffffff",
                    borderColor: "#ffcc00",
                    color: "#ffcc00",
                  }}
                >
                  Register
                </Button>
              </motion.div>
            </Form.Item>
          </FormWrapper>

          <Footer>
            <SocialIcons>
              <SocialIcon>
                <i className="fab fa-facebook"></i>
              </SocialIcon>
              <SocialIcon>
                <i className="fab fa-apple"></i>
              </SocialIcon>
              <SocialIcon>
                <i className="fab fa-google"></i>
              </SocialIcon>
            </SocialIcons>
          </Footer>
        </div>
        <MusicImage>
          <MusicImageWrapper
            src="https://i0.wp.com/liveforlivemusic.com/wp-content/uploads/2016/02/musicbrain.jpg?resize=610%2C390&ssl=1"
            alt="Music Image"
          />
        </MusicImage>
      </FormContainer>
    </Wrapper>
  );
};
