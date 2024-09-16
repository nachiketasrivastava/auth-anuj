import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, Space, Divider } from "antd";
import loginPageImage from "../../../assets/images/loginpageImage.png";
import gtmcopilotLogo from "../../../assets/images/gtmcopilot_logo_s.png";
import { MailOutlined } from "@ant-design/icons";
import "./ForgotPassword.css";
import { Forgotpassword } from "../../../services/AuthServices";
import Toaster from "../../../components/Toaster/Toaster";
import ShowModal from "../../../components/Modal/Modal";

const ForgotPassword = () => {

  const { Title, Text } = Typography;
  const { Header, Footer, Content } = Layout;

  const [ShowToaster, setShowToaster] = useState(false);
  const [ShowToasterContent, setShowToasterContent] = useState({});

  const [Modal, setModal] = useState(false);
  const [ModalContent, setModalContent] = useState({});


  const validate = (values) =>{
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;

    if(values.email && !emailRegex.test(values.email)){
      isValid = false;
      setShowToaster(true);
      setShowToasterContent({
        type: 'error',
        content: 'Please enter a valid email address'
      })
    }
    return isValid;
  }

  const onFinish= async (values) => {
    let isValid = validate(values);
    if(isValid){
      const data = {
        email : values.email
      }
      let response = await Forgotpassword(data);
      if(response.data.status === "success"){
        setModalContent({
          content: 'Please check your mail to verify your account.',
          title: 'Verification Code Sent',
          closeAction: '/login',
          okAction: '/login',
          btnText: 'Return to Login page'
        })
        setModal(true);
      }
      if(response.data.status === "error"){
        setShowToaster(true);
        setShowToasterContent({
          type: response.data.status,
          content: response.data.message
        })
      }
    }
  }

  return (
    <>
      {Modal ?
        <>
          <ShowModal props={ModalContent} />
        </> :
        <>
          {ShowToaster && <Toaster props={ShowToasterContent}  />}
          <Row className={'h-screen bg-white 2xl:overflow-hidden'}>
            <Col span={12} xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <Space direction="vertical" className={'w-full mt-5'}>
                <Layout className={'bg-white xl:px-12 lg:px-0 py-0 xl:gap-y-32 lg:gap-y-20 md:gap-y-20 sm:gap-y-20'} style={{ backgroundColor: '#fff' }}>
                  <Header className={'bg-white'}>
                    <Row>
                      <Col span={12}>
                          <img
                          style={{ height: "50px" }}
                          src={gtmcopilotLogo}
                          alt=""
                        />
                      </Col>
                      <Col span={12}>
                        <div className={'flex justify-end'}>
                          <p>
                            <span>Already a member?</span>
                            <Link to="/login" className={'ml-2.5 text-[#609DA1]'}>
                              Login
                            </Link>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Header>
                  <Content className={'py-0 px-12'}>
                    <Row className={'flex-col'}>
                      <Col span={24} className="gutter-row mb-6">
                        <Title className={'text-center'}>Forgot Password</Title>
                      </Col>
                        <Form layout="vertical" onFinish={onFinish}>
                        <Col span={24} className="gutter-row">
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter your email'
                              }
                            ]}
                            style={{ width: "80%", textAlign: 'center', display: 'inline-block' }}
                          >
                            <Input placeholder="Enter your email" type={"email"} style={{borderRadius: "60px"}} prefix={<MailOutlined />} />
                          </Form.Item>
                        </Col>
                        <Col span={24} className="gutter-row verify-input-btn">
                          <Form.Item>
                            <Button type="primary" htmlType={"submit"} className={'w-full mt-4'} style={{borderRadius: "60px", width: "80%"}}>Verify</Button>
                          </Form.Item>
                        </Col>
                        </Form>
                        <Col span={24} className="gutter-row text-start mb-2 mt-4">
                        <Text type={'secondary'}>New to GTM? <Link to='/sign-up' className="verify-signup">Sign Up Now</Link></Text>
                      </Col>
                    </Row>
                  </Content>
                  <Footer className={'bg-[transparent]'}>
                    <Row>
                      <Col span={24} className={'text-center pb-2 mt-20'}>
                        <p>© All Rights Reserved to GTM COPILOT</p>
                      </Col>
                    </Row>
                  </Footer>
                </Layout>
              </Space>
            </Col>
            <Col span={12} xs={0} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <img src={loginPageImage} alt="" className={'w-full h-full'}/>
            </Col>
          </Row>
        </>
      }
    </>
  );
}

export default ForgotPassword;